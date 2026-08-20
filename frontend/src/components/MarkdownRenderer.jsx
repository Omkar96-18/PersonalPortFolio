import React, { useEffect, useRef } from 'react';
import { Copy, Check } from 'lucide-react';

export const MarkdownRenderer = ({ content }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Attach copy button click listeners to rendered code blocks
    const copyButtons = containerRef.current.querySelectorAll('.code-copy-btn');
    copyButtons.forEach(btn => {
      const handleCopy = () => {
        const codeText = btn.getAttribute('data-code') || '';
        navigator.clipboard.writeText(codeText);
        btn.innerHTML = `<span class="copy-success">✓ Copied</span>`;
        setTimeout(() => {
          btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> Copy`;
        }, 2000);
      };
      btn.removeEventListener('click', handleCopy);
      btn.addEventListener('click', handleCopy);
    });
  }, [content]);

  if (!content) return null;

  const parseMarkdown = (text) => {
    // 1. Escape HTML
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // 2. Code blocks with language label & Copy Button
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const cleanCode = code.trim();
      const encodedCode = encodeURIComponent(cleanCode);
      const displayLang = lang || 'code';

      return `
        <div class="code-block-wrapper">
          <div class="code-block-header">
            <div class="code-dots">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
              <span class="code-lang-label">${displayLang}</span>
            </div>
            <button class="code-copy-btn" data-code="${cleanCode.replace(/"/g, '&quot;')}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> Copy
            </button>
          </div>
          <pre><code class="language-${displayLang}">${cleanCode}</code></pre>
        </div>
      `;
    });

    html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
      const cleanCode = code.trim();
      return `
        <div class="code-block-wrapper">
          <div class="code-block-header">
            <div class="code-dots">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <button class="code-copy-btn" data-code="${cleanCode.replace(/"/g, '&quot;')}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> Copy
            </button>
          </div>
          <pre><code>${cleanCode}</code></pre>
        </div>
      `;
    });

    // 3. Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // 4. Blockquotes
    html = html.replace(/^&gt;\s?(.*$)/gim, '<blockquote>$1</blockquote>');

    // 5. Bold & Italics
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // 6. Headings
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // 7. Table rows
    html = html.replace(/\|(.+)\|/g, (match, rowContent) => {
      if (rowContent.includes("---")) return "";
      const cells = rowContent.split("|").map(c => `<td>${c.trim()}</td>`).join("");
      return `<tr>${cells}</tr>`;
    });

    // 8. Lists & Paragraphs
    const lines = html.split('\n');
    let inList = false;
    let inTable = false;
    const processedLines = lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const liText = trimmed.substring(2);
        let prefix = '';
        if (!inList) {
          inList = true;
          prefix = '<ul>';
        }
        return prefix + `<li>${liText}</li>`;
      } else {
        let suffix = '';
        if (inList) {
          inList = false;
          suffix = '</ul>';
        }
        if (trimmed.startsWith('<tr>') && !inTable) {
          inTable = true;
          return suffix + '<table><tbody>' + line;
        } else if (!trimmed.startsWith('<tr>') && inTable) {
          inTable = false;
          return suffix + '</tbody></table>' + line;
        }
        return suffix + line;
      }
    });

    html = processedLines.join('\n');
    if (inList) html += '</ul>';
    if (inTable) html += '</tbody></table>';

    // Paragraph wrapping
    html = html.split(/\n{2,}/).map(p => {
      const pTrimmed = p.trim();
      if (!pTrimmed) return '';
      if (
        pTrimmed.startsWith('<h') || 
        pTrimmed.startsWith('<div class="code-block-wrapper"') || 
        pTrimmed.startsWith('<ul') || 
        pTrimmed.startsWith('<ul>') || 
        pTrimmed.startsWith('<li>') ||
        pTrimmed.startsWith('<table') ||
        pTrimmed.startsWith('<blockquote')
      ) {
        return pTrimmed;
      }
      return `<p>${pTrimmed.replace(/\n/g, '<br />')}</p>`;
    }).join('\n');

    return html;
  };

  const parsed = parseMarkdown(content);

  return (
    <div ref={containerRef}>
      <div 
        className="markdown-body" 
        dangerouslySetInnerHTML={{ __html: parsed }} 
      />
      <style>{`
        .code-block-wrapper {
          margin: 28px 0;
          border-radius: var(--border-radius-md);
          overflow: hidden;
          background: #040407;
          border: 1px solid var(--border-color);
          box-shadow: 0 15px 35px rgba(0,0,0,0.6);
        }
        .code-block-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid var(--border-color);
        }
        .code-dots {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .code-dots .dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          display: inline-block;
        }
        .code-dots .red { background: #ff5f56; }
        .code-dots .yellow { background: #ffbd2e; }
        .code-dots .green { background: #27c93f; }
        .code-lang-label {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-left: 8px;
        }
        .code-copy-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          cursor: pointer;
          transition: var(--transition-smooth);
          padding: 2px 8px;
          border-radius: 4px;
        }
        .code-copy-btn:hover {
          color: var(--text-primary);
          background: rgba(255,255,255,0.06);
        }
        .copy-success {
          color: #27c93f;
          font-weight: 600;
        }
        .code-block-wrapper pre {
          margin: 0 !important;
          padding: 18px 20px !important;
          background: transparent !important;
          border: none !important;
        }
        .code-block-wrapper pre::before {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default MarkdownRenderer;
