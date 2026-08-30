import React, { useRef } from 'react';

export const MarkdownRenderer = ({ content }) => {
  const containerRef = useRef(null);

  // Reliable clipboard copy function supporting all browsers, secure and non-secure contexts
  const copyToClipboard = async (text) => {
    if (!text) return false;

    // 1. Try modern Clipboard API
    if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.warn('Navigator clipboard error, trying fallback', err);
      }
    }

    // 2. Robust fallback using temporary textarea
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.setAttribute('readonly', '');
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      textArea.style.opacity = '0';
      textArea.style.pointerEvents = 'none';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (fallbackErr) {
      console.error('All copy methods failed:', fallbackErr);
      return false;
    }
  };

  // Event delegation: intercepts clicks on .code-copy-btn anywhere inside the rendered markdown
  const handleContainerClick = async (e) => {
    const btn = e.target.closest('.code-copy-btn');
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    let codeText = '';
    const rawData = btn.getAttribute('data-raw');
    if (rawData) {
      try {
        codeText = decodeURIComponent(rawData);
      } catch (err) {
        codeText = rawData;
      }
    }

    // Fallback if data-raw is somehow unavailable
    if (!codeText) {
      const codeWrapper = btn.closest('.code-block-wrapper');
      const lineTexts = codeWrapper ? codeWrapper.querySelectorAll('.line-text') : null;
      if (lineTexts && lineTexts.length > 0) {
        codeText = Array.from(lineTexts).map(el => el.innerText || el.textContent || '').join('\n');
      } else {
        const codeEl = codeWrapper ? codeWrapper.querySelector('code') : null;
        codeText = codeEl ? (codeEl.innerText || codeEl.textContent || '') : '';
      }
    }

    if (!codeText) return;

    const ok = await copyToClipboard(codeText);
    if (ok) {
      btn.classList.add('copied');
      btn.innerHTML = `
        <svg class="tick-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Copied!</span>
      `;
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = `
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
          </svg>
          <span>Copy</span>
        `;
      }, 2200);
    }
  };

  if (!content) return null;

  // Single-pass syntax highlighter & line number generator
  const formatCodeBlock = (rawCode, lang) => {
    const l = (lang || 'text').toLowerCase();
    const clean = rawCode.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const rawLines = clean.split('\n');
    
    // Trim trailing empty lines
    while (rawLines.length > 0 && rawLines[rawLines.length - 1].trim() === '') {
      rawLines.pop();
    }

    const pythonKeywords = new Set([
      'def', 'class', 'import', 'from', 'return', 'as', 'if', 'else', 'elif', 'for', 'while', 'in', 'is', 'not', 'and', 'or', 'try', 'except', 'finally', 'with', 'raise', 'yield', 'lambda', 'pass', 'self', 'async', 'await', 'print', 'len', 'range', 'str', 'int', 'dict', 'list', 'set'
    ]);
    const jsKeywords = new Set([
      'function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'switch', 'case', 'break', 'default', 'new', 'typeof', 'instanceof', 'export', 'import', 'from', 'as', 'extends', 'super', 'this', 'async', 'await', 'try', 'catch', 'finally', 'throw', 'true', 'false', 'null', 'undefined'
    ]);
    const goKeywords = new Set([
      'package', 'import', 'func', 'return', 'var', 'const', 'type', 'struct', 'interface', 'if', 'else', 'for', 'range', 'switch', 'case', 'default', 'defer', 'go', 'chan', 'select', 'make', 'nil', 'map'
    ]);
    const sqlKeywords = new Set([
      'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'GROUP', 'BY', 'ORDER', 'LIMIT', 'OFFSET', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'DATABASE', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'NOT', 'NULL', 'AND', 'OR', 'UNION', 'ALL', 'AS', 'HAVING', 'select', 'from', 'where', 'join', 'group', 'by', 'order', 'limit'
    ]);

    let activeKwSet = pythonKeywords;
    if (['javascript', 'js', 'typescript', 'ts', 'jsx', 'tsx'].includes(l)) activeKwSet = jsKeywords;
    else if (['go', 'golang'].includes(l)) activeKwSet = goKeywords;
    else if (['sql', 'pgsql', 'mysql'].includes(l)) activeKwSet = sqlKeywords;

    const escapeHtml = (str) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const highlightLine = (line) => {
      if (!line) return '&nbsp;';

      const trimmed = line.trim();
      // Full line comment check
      if (['python', 'py', 'bash', 'sh', 'yaml', 'yml', 'dockerfile'].includes(l) && trimmed.startsWith('#')) {
        return `<span class="tok-comment">${escapeHtml(line)}</span>`;
      }
      if (['sql'].includes(l) && trimmed.startsWith('--')) {
        return `<span class="tok-comment">${escapeHtml(line)}</span>`;
      }
      if ((trimmed.startsWith('//') || trimmed.startsWith('/*')) && !['python', 'bash'].includes(l)) {
        return `<span class="tok-comment">${escapeHtml(line)}</span>`;
      }

      // Regex tokenization without corrupting HTML
      const tokenRegex = /(".*?"|'.*?'|`.*?`|\/\/.*$|#.*$|--.*$|\b[a-zA-Z_]\w*\b|\b\d+(?:\.\d+)?\b|[^\s\w])/g;
      
      let result = '';
      let lastIndex = 0;
      let match;

      while ((match = tokenRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          result += escapeHtml(line.substring(lastIndex, match.index));
        }
        lastIndex = tokenRegex.lastIndex;

        const token = match[0];
        
        // Comment
        if (token.startsWith('//') || token.startsWith('#') || token.startsWith('--')) {
          result += `<span class="tok-comment">${escapeHtml(token)}</span>`;
        }
        // String
        else if ((token.startsWith('"') && token.endsWith('"')) ||
                 (token.startsWith("'") && token.endsWith("'")) ||
                 (token.startsWith('`') && token.endsWith('`'))) {
          result += `<span class="tok-string">${escapeHtml(token)}</span>`;
        }
        // Number
        else if (/^\d+(\.\d+)?$/.test(token)) {
          result += `<span class="tok-number">${escapeHtml(token)}</span>`;
        }
        // Boolean / Null constants
        else if (['True', 'False', 'true', 'false', 'null', 'None', 'undefined', 'nil'].includes(token)) {
          result += `<span class="tok-boolean">${escapeHtml(token)}</span>`;
        }
        // Keyword
        else if (activeKwSet.has(token)) {
          result += `<span class="tok-keyword">${escapeHtml(token)}</span>`;
        }
        // Function invocation
        else if (line[tokenRegex.lastIndex] === '(') {
          result += `<span class="tok-func">${escapeHtml(token)}</span>`;
        }
        // Standard token
        else {
          result += escapeHtml(token);
        }
      }

      if (lastIndex < line.length) {
        result += escapeHtml(line.substring(lastIndex));
      }

      return result || '&nbsp;';
    };

    return rawLines.map((line, idx) => {
      const lineNum = idx + 1;
      const highlighted = highlightLine(line);
      return `<div class="code-line"><span class="line-num">${lineNum}</span><span class="line-text">${highlighted}</span></div>`;
    }).join('');
  };

  const parseMarkdown = (text) => {
    if (!text) return '';
    
    // Normalize line breaks
    let normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // 1. Extract fenced code blocks with placeholders
    const codeBlocks = [];
    normalized = normalized.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const idx = codeBlocks.length;
      codeBlocks.push({ lang: lang || 'code', code });
      return `@@CODE_BLOCK_${idx}@@`;
    });
    normalized = normalized.replace(/```([\s\S]*?)```/g, (match, code) => {
      const idx = codeBlocks.length;
      codeBlocks.push({ lang: 'code', code });
      return `@@CODE_BLOCK_${idx}@@`;
    });

    // 2. Extract inline code with placeholders
    const inlineCodes = [];
    normalized = normalized.replace(/`([^`\n]+)`/g, (match, code) => {
      const idx = inlineCodes.length;
      inlineCodes.push(code);
      return `@@INLINE_CODE_${idx}@@`;
    });

    // 3. Escape HTML
    normalized = normalized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // 4. Block-level parsing
    const lines = normalized.split('\n');
    const outputBlocks = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      // Skip standalone blank lines
      if (!trimmed) {
        i++;
        continue;
      }

      // Code block placeholder
      if (/^@@CODE_BLOCK_\d+@@$/.test(trimmed)) {
        outputBlocks.push(trimmed);
        i++;
        continue;
      }

      // Horizontal Rule
      if (/^(?:---|\*\*\*|___)\s*$/.test(trimmed)) {
        outputBlocks.push('<hr class="markdown-hr" />');
        i++;
        continue;
      }

      // Headings (# to ######)
      const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const htext = headingMatch[2];
        outputBlocks.push(`<h${level}>${htext}</h${level}>`);
        i++;
        continue;
      }

      // Blockquotes & Callout Alerts
      if (trimmed.startsWith('&gt;')) {
        const bqLines = [];
        while (i < lines.length && lines[i].trim().startsWith('&gt;')) {
          bqLines.push(lines[i].trim().replace(/^&gt;\s?/, ''));
          i++;
        }
        const firstLine = bqLines[0] || '';
        let alertType = '';
        if (/^\[!NOTE\]/i.test(firstLine)) alertType = 'note';
        else if (/^\[!TIP\]/i.test(firstLine)) alertType = 'tip';
        else if (/^\[!IMPORTANT\]/i.test(firstLine)) alertType = 'important';
        else if (/^\[!WARNING\]/i.test(firstLine)) alertType = 'warning';
        else if (/^\[!CAUTION\]/i.test(firstLine)) alertType = 'caution';

        if (alertType) {
          bqLines[0] = bqLines[0].replace(/^\[!(?:NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i, '');
          const alertContent = bqLines.filter(l => l.trim().length > 0).join('<br />');
          outputBlocks.push(`
            <div class="markdown-callout callout-${alertType}">
              <div class="callout-header"><span class="callout-indicator"></span> ${alertType.toUpperCase()}</div>
              <div class="callout-body">${alertContent}</div>
            </div>
          `.trim());
        } else {
          outputBlocks.push(`<blockquote>${bqLines.join('<br />')}</blockquote>`);
        }
        continue;
      }

      // Unordered Lists (- , * , + )
      if (/^[-*+]\s+/.test(trimmed)) {
        const ulItems = [];
        while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) {
          let itemText = lines[i].trim().replace(/^[-*+]\s+/, '');
          if (itemText.startsWith('[ ] ')) {
            itemText = `<input type="checkbox" disabled class="task-checkbox" /> ` + itemText.substring(4);
          } else if (itemText.startsWith('[x] ') || itemText.startsWith('[X] ')) {
            itemText = `<input type="checkbox" checked disabled class="task-checkbox" /> ` + itemText.substring(4);
          }
          ulItems.push(`<li>${itemText}</li>`);
          i++;
        }
        outputBlocks.push(`<ul>${ulItems.join('')}</ul>`);
        continue;
      }

      // Ordered Lists (1. 2. 3.)
      if (/^\d+\.\s+/.test(trimmed)) {
        const olItems = [];
        while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
          const itemText = lines[i].trim().replace(/^\d+\.\s+/, '');
          olItems.push(`<li>${itemText}</li>`);
          i++;
        }
        outputBlocks.push(`<ol>${olItems.join('')}</ol>`);
        continue;
      }

      // Tables (| col1 | col2 |)
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        const tableLines = [];
        while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
          tableLines.push(lines[i].trim());
          i++;
        }
        if (tableLines.length >= 2 && tableLines[1].includes('---')) {
          const headers = tableLines[0].split('|').slice(1, -1).map(c => c.trim());
          const thead = `<thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>`;
          const tbodyRows = [];
          for (let r = 2; r < tableLines.length; r++) {
            const cells = tableLines[r].split('|').slice(1, -1).map(c => c.trim());
            tbodyRows.push(`<tr>${cells.map(c => `<td>${c}</td>`).join('')}</tr>`);
          }
          const tbody = `<tbody>${tbodyRows.join('')}</tbody>`;
          outputBlocks.push(`<div class="markdown-table-wrap"><table>${thead}${tbody}</table></div>`);
          continue;
        }
      }

      // Paragraph: gather lines until blank line or block indicator
      const pLines = [];
      while (i < lines.length) {
        const curr = lines[i].trim();
        if (!curr) break;
        if (
          /^@@CODE_BLOCK_\d+@@$/.test(curr) ||
          /^(?:---|\*\*\*|___)\s*$/.test(curr) ||
          /^#{1,6}\s+/.test(curr) ||
          curr.startsWith('&gt;') ||
          /^[-*+]\s+/.test(curr) ||
          /^\d+\.\s+/.test(curr) ||
          (curr.startsWith('|') && curr.endsWith('|'))
        ) {
          break;
        }
        pLines.push(curr);
        i++;
      }

      if (pLines.length > 0) {
        outputBlocks.push(`<p>${pLines.join('<br />')}</p>`);
      }
    }

    let parsedHtml = outputBlocks.join('\n');

    // 5. Inline markdown formatting
    // Images: ![alt](url)
    parsedHtml = parsedHtml.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g, 
      '<figure class="markdown-img-wrap"><img src="$2" alt="$1" class="markdown-img" /><figcaption>$1</figcaption></figure>'
    );
    // Links: [text](url)
    parsedHtml = parsedHtml.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g, 
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="markdown-link">$1</a>'
    );
    // Bold: **text** or __text__
    parsedHtml = parsedHtml.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    parsedHtml = parsedHtml.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    // Italic: *text* or _text_
    parsedHtml = parsedHtml.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    parsedHtml = parsedHtml.replace(/(?<!\w)_([^_]+)_(?!\w)/g, '<em>$1</em>');
    // Strikethrough: ~~text~~
    parsedHtml = parsedHtml.replace(/~~([^~]+)~~/g, '<del>$1</del>');
    // Highlight: ==text==
    parsedHtml = parsedHtml.replace(/==([^=]+)==/g, '<mark class="markdown-highlight">$1</mark>');

    // 6. Restore inline codes safely
    inlineCodes.forEach((code, idx) => {
      const esc = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      parsedHtml = parsedHtml.replace(`@@INLINE_CODE_${idx}@@`, `<code class="inline-code">${esc}</code>`);
    });

    // 7. Restore code blocks with terminal chrome, line numbers & copy buttons
    codeBlocks.forEach(({ lang, code }, idx) => {
      const cleanCode = code.trim();
      const rawEncoded = encodeURIComponent(cleanCode);
      const formattedLines = formatCodeBlock(cleanCode, lang);
      const lineCount = cleanCode.split('\n').length;
      
      const block = `
        <div class="code-block-wrapper">
          <div class="code-block-header">
            <div class="code-dots">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
              <span class="code-lang-label">${lang}</span>
              <span class="code-lines-count">${lineCount} ${lineCount === 1 ? 'line' : 'lines'}</span>
            </div>
            <button class="code-copy-btn" data-raw="${rawEncoded}" title="Copy code snippet">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
              </svg>
              <span>Copy</span>
            </button>
          </div>
          <pre class="code-pre"><code class="language-${lang}">${formattedLines}</code></pre>
        </div>
      `.trim();
      parsedHtml = parsedHtml.replace(`@@CODE_BLOCK_${idx}@@`, block);
    });

    return parsedHtml;
  };

  const parsed = parseMarkdown(content);

  return (
    <div ref={containerRef} className="markdown-renderer-root" onClick={handleContainerClick}>
      <div 
        className="markdown-body" 
        dangerouslySetInnerHTML={{ __html: parsed }} 
      />
      <style>{`
        /* ════════════════════════════════════════════════════
           MARKDOWN RENDERER — NEAT CODE & CYBER TYPOGRAPHY
        ════════════════════════════════════════════════════ */
        .markdown-renderer-root {
          width: 100%;
        }

        .markdown-body {
          font-family: var(--font-body, 'Inter', -apple-system, sans-serif);
          color: var(--text-body, #CBD5E1);
          font-size: 1.05rem;
          line-height: 1.88;
          word-break: break-word;
        }

        /* Headings */
        .markdown-body h1,
        .markdown-body h2,
        .markdown-body h3,
        .markdown-body h4,
        .markdown-body h5,
        .markdown-body h6 {
          font-family: var(--font-sans, sans-serif);
          font-weight: 800;
          color: #FFFFFF;
          letter-spacing: -0.5px;
          line-height: 1.25;
          margin-top: 36px;
          margin-bottom: 16px;
        }
        .markdown-body h1:first-child,
        .markdown-body h2:first-child,
        .markdown-body h3:first-child {
          margin-top: 0;
        }

        .markdown-body h1 {
          font-size: clamp(1.6rem, 4vw, 2.1rem);
          letter-spacing: -0.8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 12px;
        }

        .markdown-body h2 {
          font-size: clamp(1.35rem, 3.5vw, 1.65rem);
          letter-spacing: -0.6px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding-bottom: 8px;
        }

        .markdown-body h3 {
          font-size: clamp(1.15rem, 3vw, 1.35rem);
          letter-spacing: -0.4px;
        }

        .markdown-body h4 {
          font-size: 1.08rem;
          font-weight: 700;
        }

        .markdown-body h5,
        .markdown-body h6 {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        /* Paragraphs */
        .markdown-body p {
          margin: 0 0 20px 0;
          color: #CBD5E1;
          font-size: 1.04rem;
          line-height: 1.88;
        }
        .markdown-body p:last-child {
          margin-bottom: 0;
        }

        /* Inline formatting */
        .markdown-body strong {
          color: #FFFFFF;
          font-weight: 700;
        }
        .markdown-body em {
          color: #E2E8F0;
          font-style: italic;
        }
        .markdown-body del {
          color: var(--text-muted);
          text-decoration: line-through;
        }
        .markdown-highlight {
          background: rgba(246, 36, 64, 0.22);
          color: #FFFFFF;
          padding: 2px 6px;
          border-radius: 3px;
          border: 1px solid rgba(246, 36, 64, 0.4);
        }

        /* Links */
        .markdown-link {
          color: var(--accent-red);
          text-decoration: underline;
          text-underline-offset: 3px;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .markdown-link:hover {
          color: #FFFFFF;
          text-shadow: 0 0 8px var(--accent-red);
        }

        /* Lists */
        .markdown-body ul,
        .markdown-body ol {
          margin: 0 0 22px 0;
          padding-left: 26px;
          color: #CBD5E1;
          font-size: 1.02rem;
          line-height: 1.82;
        }
        .markdown-body li {
          margin-bottom: 8px;
          padding-left: 4px;
        }
        .markdown-body ul li::marker {
          color: var(--accent-red);
        }
        .markdown-body ol li::marker {
          color: var(--accent-red);
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 0.85rem;
        }
        .task-checkbox {
          accent-color: var(--accent-red);
          margin-right: 8px;
          vertical-align: middle;
        }

        /* Blockquotes */
        .markdown-body blockquote {
          border-left: 3px solid var(--accent-red);
          padding: 16px 22px;
          margin: 26px 0;
          background: linear-gradient(90deg, rgba(128, 10, 28, 0.16) 0%, rgba(7, 7, 10, 0.4) 100%);
          border-radius: 0 var(--border-radius-sm) var(--border-radius-sm) 0;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          border-right: 1px solid rgba(255, 255, 255, 0.04);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          color: #E2E8F0;
          font-style: italic;
          font-size: 1.02rem;
          line-height: 1.8;
        }

        /* Callout Alerts */
        .markdown-callout {
          margin: 26px 0;
          padding: 16px 20px;
          border-radius: var(--border-radius-md);
          background: rgba(10, 10, 15, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-left: 4px solid var(--accent-red);
        }
        .callout-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 1.5px;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .callout-indicator {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          display: inline-block;
        }
        .callout-note { border-left-color: #38bdf8; }
        .callout-note .callout-header { color: #38bdf8; }
        .callout-note .callout-indicator { background: #38bdf8; box-shadow: 0 0 6px #38bdf8; }
        .callout-tip { border-left-color: #34d399; }
        .callout-tip .callout-header { color: #34d399; }
        .callout-tip .callout-indicator { background: #34d399; box-shadow: 0 0 6px #34d399; }
        .callout-important { border-left-color: var(--accent-red); }
        .callout-important .callout-header { color: var(--accent-red); }
        .callout-important .callout-indicator { background: var(--accent-red); box-shadow: 0 0 6px var(--accent-red); }
        .callout-warning { border-left-color: #fbbf24; }
        .callout-warning .callout-header { color: #fbbf24; }
        .callout-warning .callout-indicator { background: #fbbf24; box-shadow: 0 0 6px #fbbf24; }
        .callout-caution { border-left-color: #f87171; }
        .callout-caution .callout-header { color: #f87171; }
        .callout-caution .callout-indicator { background: #f87171; box-shadow: 0 0 6px #f87171; }
        .callout-body {
          color: #E2E8F0;
          font-size: 0.95rem;
          line-height: 1.7;
        }

        /* Horizontal rule */
        .markdown-hr {
          border: none;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(246, 36, 64, 0.4) 50%, transparent 100%);
          margin: 36px 0;
        }

        /* ─── CODE BLOCK STYLING — LUXURY CYBER TERMINAL ─── */
        .code-block-wrapper {
          margin: 28px 0;
          border-radius: var(--border-radius-md);
          overflow: hidden;
          background: #06070B;
          border: 1px solid rgba(255, 255, 255, 0.09);
          box-shadow: 0 20px 45px -12px rgba(0, 0, 0, 0.92), 0 0 0 1px rgba(246, 36, 64, 0.05);
          position: relative;
        }
        .code-block-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 18px;
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(8px);
        }
        .code-dots {
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .code-dots .dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          display: inline-block;
          transition: transform 0.2s ease;
        }
        .code-block-wrapper:hover .dot { transform: scale(1.1); }
        .code-dots .red { background: #ff5f56; box-shadow: 0 0 6px rgba(255, 95, 86, 0.4); }
        .code-dots .yellow { background: #ffbd2e; box-shadow: 0 0 6px rgba(255, 189, 46, 0.4); }
        .code-dots .green { background: #27c93f; box-shadow: 0 0 6px rgba(39, 201, 63, 0.4); }
        
        .code-lang-label {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--accent-red);
          text-transform: uppercase;
          letter-spacing: 1.2px;
          margin-left: 10px;
          background: rgba(246, 36, 64, 0.1);
          padding: 2px 7px;
          border-radius: 4px;
          border: 1px solid rgba(246, 36, 64, 0.2);
        }
        .code-lines-count {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--text-muted);
          margin-left: 8px;
          opacity: 0.7;
        }

        .code-copy-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 4px 10px;
          border-radius: 6px;
          user-select: none;
        }
        .code-copy-btn:hover {
          color: #FFFFFF;
          background: rgba(246, 36, 64, 0.18);
          border-color: rgba(246, 36, 64, 0.4);
          box-shadow: 0 0 12px rgba(246, 36, 64, 0.25);
        }
        .code-copy-btn.copied {
          background: rgba(39, 201, 63, 0.15) !important;
          border-color: rgba(39, 201, 63, 0.45) !important;
          color: #27c93f !important;
          box-shadow: 0 0 12px rgba(39, 201, 63, 0.35) !important;
        }
        .code-copy-btn .tick-icon {
          animation: tickBounce 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          color: #27c93f;
        }
        @keyframes tickBounce {
          0% { transform: scale(0.6); opacity: 0; }
          50% { transform: scale(1.25); }
          100% { transform: scale(1); opacity: 1; }
        }

        .code-pre {
          margin: 0 !important;
          padding: 16px 0 !important;
          background: transparent !important;
          border: none !important;
          overflow-x: auto;
          font-family: var(--font-mono, 'Fira Code', Consolas, monospace);
          font-size: 0.88rem;
          line-height: 1.75;
          color: #F1F5F9;
        }
        .code-pre code {
          background: transparent !important;
          padding: 0 !important;
          border: none !important;
          display: block;
          min-width: 100%;
        }

        /* Line Numbers & Code Lines */
        .code-line {
          display: flex;
          align-items: baseline;
          padding: 0 18px 0 0;
          transition: background 0.15s ease;
        }
        .code-line:hover {
          background: rgba(255, 255, 255, 0.025);
        }
        .line-num {
          user-select: none;
          -webkit-user-select: none;
          color: var(--text-muted);
          opacity: 0.38;
          padding-right: 16px;
          text-align: right;
          width: 44px;
          min-width: 44px;
          font-family: var(--font-mono);
          font-size: 0.76rem;
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          margin-right: 16px;
        }
        .line-text {
          white-space: pre;
          flex: 1;
          tab-size: 4;
          -moz-tab-size: 4;
        }

        /* Syntax Highlight Token Colors */
        .tok-keyword {
          color: #F43F5E;
          font-weight: 700;
        }
        .tok-func {
          color: #38BDF8;
          font-weight: 600;
        }
        .tok-string {
          color: #34D399;
        }
        .tok-number {
          color: #FB923C;
        }
        .tok-boolean {
          color: #C084FC;
          font-weight: 600;
        }
        .tok-comment {
          color: #64748B;
          font-style: italic;
        }
        .tok-decorator {
          color: #FBBF24;
          font-weight: 600;
        }

        /* Inline code */
        .inline-code {
          font-family: var(--font-mono);
          font-size: 0.86em;
          padding: 2px 7px;
          border-radius: 4px;
          background: rgba(246, 36, 64, 0.12);
          border: 1px solid rgba(246, 36, 64, 0.25);
          color: #F8FAFC;
          word-break: break-word;
        }

        /* Tables */
        .markdown-table-wrap {
          overflow-x: auto;
          margin: 26px 0;
          border-radius: var(--border-radius-md);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .markdown-table-wrap table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.92rem;
        }
        .markdown-table-wrap th {
          padding: 12px 16px;
          background: rgba(128, 10, 28, 0.22);
          color: #FFFFFF;
          font-weight: 700;
          font-family: var(--font-mono);
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          border-bottom: 1px solid rgba(246, 36, 64, 0.3);
        }
        .markdown-table-wrap td {
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          color: #CBD5E1;
        }
        .markdown-table-wrap tr:last-child td {
          border-bottom: none;
        }
        .markdown-table-wrap tr:hover td {
          background: rgba(255, 255, 255, 0.02);
        }

        /* Images */
        .markdown-img-wrap {
          margin: 32px 0;
          text-align: center;
        }
        .markdown-img {
          max-width: 100%;
          border-radius: var(--border-radius-md);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.7);
        }
        .markdown-img-wrap figcaption {
          font-family: var(--font-mono);
          font-size: 0.76rem;
          color: var(--text-muted);
          margin-top: 10px;
        }

        /* Light Mode Theme Overrides */
        body.light-theme .markdown-body {
          color: #334155;
        }
        body.light-theme .markdown-body h1,
        body.light-theme .markdown-body h2,
        body.light-theme .markdown-body h3,
        body.light-theme .markdown-body h4 {
          color: #0F172A;
          border-bottom-color: rgba(0, 0, 0, 0.08);
        }
        body.light-theme .markdown-body p {
          color: #334155;
        }
        body.light-theme .markdown-body strong {
          color: #0F172A;
        }
        body.light-theme .markdown-body blockquote {
          background: rgba(246, 36, 64, 0.06);
          color: #1E293B;
          border-color: rgba(0, 0, 0, 0.06);
          border-left-color: var(--accent-red);
        }
        body.light-theme .markdown-callout {
          background: #FFFFFF;
          border-color: rgba(0, 0, 0, 0.08);
        }
        body.light-theme .callout-body {
          color: #334155;
        }
        body.light-theme .inline-code {
          background: rgba(246, 36, 64, 0.08);
          border-color: rgba(246, 36, 64, 0.2);
          color: #990011;
        }

        /* Light Mode Code Block Terminal & Typography */
        body.light-theme .code-block-wrapper {
          background: #F8FAFC;
          border-color: rgba(15, 23, 42, 0.12);
          box-shadow: 0 12px 30px -8px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15, 23, 42, 0.04);
        }
        body.light-theme .code-block-header {
          background: #F1F5F9;
          border-bottom-color: rgba(15, 23, 42, 0.08);
        }
        body.light-theme .code-lang-label {
          background: rgba(246, 36, 64, 0.08);
          border-color: rgba(246, 36, 64, 0.25);
          color: #990011;
        }
        body.light-theme .code-lines-count {
          color: #64748B;
        }
        body.light-theme .code-copy-btn {
          background: #FFFFFF;
          border-color: rgba(15, 23, 42, 0.14);
          color: #334155;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        body.light-theme .code-copy-btn:hover {
          background: rgba(246, 36, 64, 0.08);
          border-color: var(--accent-red);
          color: var(--accent-red);
        }
        body.light-theme .code-copy-btn.copied {
          background: rgba(16, 185, 129, 0.12) !important;
          border-color: #10B981 !important;
          color: #059669 !important;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.25) !important;
        }
        body.light-theme .code-pre {
          color: #0F172A;
        }
        body.light-theme .line-num {
          color: #94A3B8;
          border-right-color: rgba(15, 23, 42, 0.08);
        }
        body.light-theme .code-line:hover {
          background: rgba(15, 23, 42, 0.035);
        }

        /* Light Mode Syntax Highlight Tokens */
        body.light-theme .tok-keyword {
          color: #BE123C;
          font-weight: 700;
        }
        body.light-theme .tok-func {
          color: #0284C7;
          font-weight: 600;
        }
        body.light-theme .tok-string {
          color: #059669;
        }
        body.light-theme .tok-number {
          color: #D97706;
        }
        body.light-theme .tok-boolean {
          color: #7C3AED;
          font-weight: 600;
        }
        body.light-theme .tok-comment {
          color: #64748B;
          font-style: italic;
        }
        body.light-theme .tok-decorator {
          color: #B45309;
          font-weight: 600;
        }

        body.light-theme .markdown-table-wrap {
          border-color: rgba(0, 0, 0, 0.08);
        }
        body.light-theme .markdown-table-wrap th {
          background: rgba(246, 36, 64, 0.1);
          color: #0F172A;
        }
        body.light-theme .markdown-table-wrap td {
          color: #334155;
          border-bottom-color: rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
};

export default MarkdownRenderer;
