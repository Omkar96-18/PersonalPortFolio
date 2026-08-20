import React from 'react';

// Brand icons with accurate SVG vector paths
export const Github = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const Linkedin = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// Technology Brand SVG Logos
export const PythonIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.927 0c-5.872 0-5.503.255-5.503 2.556v1.758h5.592v.827H4.212C1.722 5.141 0 6.783 0 11.458c0 4.671 2.164 6.273 4.212 6.273h2.212v-2.736c0-2.616 2.247-4.872 4.903-4.872h5.525V8.349c0-2.484-.537-8.349-4.925-8.349zM9.13 1.774a1.056 1.056 0 1 1 0 2.112 1.056 1.056 0 0 1 0-2.112z" fill="#3776AB"/>
    <path d="M12.073 24c5.872 0 5.503-.255 5.503-2.556v-1.758h-5.592v-.827h7.804c2.49 0 4.212-1.642 4.212-6.317 0-4.671-2.164-6.273-4.212-6.273h-2.212v2.736c0 2.616-2.247 4.872-4.903 4.872H7.149v1.774c0 2.484.537 8.349 4.924 8.349zm2.797-1.774a1.056 1.056 0 1 1 0-2.112 1.056 1.056 0 0 1 0 2.112z" fill="#FFD43B"/>
  </svg>
);

export const ReactIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#61DAFB" strokeWidth="1.5">
    <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(0 12 12)" />
    <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)" />
    <circle cx="12" cy="12" r="2" fill="#61DAFB" />
  </svg>
);

export const DjangoIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#0C4B33">
    <path d="M11.666 0h2.954v18.064c-1.39.263-2.615.34-3.666.34-3.864 0-5.72-1.758-5.72-5.074 0-3.36 2.083-5.337 5.257-5.337.457 0 .804.032 1.175.109V0zm0 10.354a2.916 2.916 0 0 0-.82-.109c-1.574 0-2.5.94-2.5 2.766 0 1.742.85 2.616 2.378 2.616.324 0 .633-.032.942-.093v-5.18zM17.382 8.012h2.954V24h-2.954V8.012zM17.382 3.167h2.954v2.923h-2.954V3.167z" />
  </svg>
);

export const FastApiIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#059669">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1.5 5.5l-1 5h4l-6 8 1-5h-4l6-8z" />
  </svg>
);

export const GoIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#00ADD8">
    <path d="M1.81 10.075c0-1.897 1.348-3.414 3.414-3.414 1.83 0 3.037 1.18 3.328 2.597H6.711c-.201-.582-.738-1.008-1.487-1.008-1.007 0-1.724.851-1.724 1.825 0 .963.717 1.814 1.724 1.814.817 0 1.377-.482 1.545-1.12H4.977v-1.254h3.362v.224c0 1.959-1.254 3.739-3.481 3.739-2.066 0-3.048-1.523-3.048-3.403zm8.388 0c0-1.897 1.348-3.414 3.414-3.414 2.066 0 3.414 1.517 3.414 3.414 0 1.88-1.348 3.403-3.414 3.403-2.066 0-3.414-1.523-3.414-3.403zm5.127 0c0-.974-.717-1.825-1.713-1.825-1.007 0-1.724.851-1.724 1.825 0 .963.717 1.814 1.724 1.814 0.996 0 1.713-.851 1.713-1.814z" />
  </svg>
);

export const PyTorchIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#EE4C2C">
    <path d="M15.42 2.37A9.87 9.87 0 0 0 12 1.76a9.92 9.92 0 0 0-9.93 9.93 9.93 9.93 0 0 0 9.93 9.93A9.93 9.93 0 0 0 21.93 11.7a9.9 9.9 0 0 0-.62-3.42l-2.06 2.06A6.98 6.98 0 0 1 19.4 11.7a7.4 7.4 0 1 1-7.4-7.4c.83 0 1.63.14 2.37.4l1.05-2.33z" />
    <circle cx="16.5" cy="4.5" r="1.5" fill="#EE4C2C" />
  </svg>
);

export const TensorFlowIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#FF6F00">
    <path d="M12.5 0L1 6.5v11L7.5 21v-6.5L12.5 17l5-2.5V8l-5-2.5zm0 3.2L16 5l-3.5 1.8L9 5l3.5-1.8zM4 8.5l3.5 1.8v4.2L4 12.7V8.5zm16 0v4.2l-3.5 1.8v-4.2L20 8.5z" />
  </svg>
);

export const PostgresIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#336791">
    <path d="M11.966 0C5.357 0 0 5.357 0 11.966c0 6.609 5.357 11.966 11.966 11.966 6.609 0 11.966-5.357 11.966-11.966C23.932 5.357 18.575 0 11.966 0zm4.842 16.486c-.722.56-1.638.892-2.632.892-2.316 0-4.195-1.879-4.195-4.195 0-.994.332-1.91 1.012-2.632l1.625 1.625c-.274.274-.442.652-.442 1.007 0 .783.635 1.418 1.418 1.418.355 0 .733-.168 1.007-.442l2.207 2.327z" />
  </svg>
);

export const DockerIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#2496ED">
    <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.186v1.887c0 .102.083.185.185.185zm-2.954-5.43h2.118a.185.185 0 00.186-.186V3.575a.185.185 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .103.083.186.185.186zm0 5.43h2.118a.185.185 0 00.186-.185V9.006a.185.185 0 00-.186-.186h-2.118a.185.185 0 00-.185.186v1.887c0 .102.083.185.185.185zm-2.955 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H8.074a.185.185 0 00-.185.186v1.887c0 .102.083.185.185.185zm-2.954 0h2.118a.185.185 0 00.186-.185V9.006a.185.185 0 00-.186-.186H5.12a.185.185 0 00-.185.186v1.887c0 .102.083.185.185.185zm13.782-2.715h2.119a.186.186 0 00.185-.186V6.291a.186.186 0 00-.185-.186h-2.119a.186.186 0 00-.186.186v1.886c0 .103.083.186.186.186zm-2.954 0h2.119a.186.186 0 00.185-.186V6.291a.186.186 0 00-.185-.186h-2.119a.185.185 0 00-.186.186v1.886c0 .103.083.186.186.186zm-2.954 0h2.118a.185.185 0 00.186-.186V6.291a.185.185 0 00-.186-.186h-2.118a.185.185 0 00-.185.186v1.886c0 .103.083.186.185.186zM.007 13.916c.071 2.378 1.94 4.542 4.417 5.161 3.256.812 7.747.785 10.963-.448 3.518-1.349 5.864-4.52 6.551-7.234.331.066.868.083 1.2.033.473-.07.973-.298 1.348-.6.287-.23.479-.49.516-.76.04-.3-.138-.47-.468-.46-.575.01-1.3.26-1.74.45-.48-1.57-1.74-2.73-3.41-3.23l-.15-.04v1.17c0 .12-.08.22-.2.24-1.28.21-2.22.95-2.72 2.13H.007v.64z" />
  </svg>
);

export const JsIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#F7DF1E">
    <rect width="24" height="24" rx="3" fill="#F7DF1E" />
    <path d="M6.4 18.5c.8 1.3 2 2.1 3.7 2.1 1.9 0 3-1 3-3.1v-7.1H10v7c0 .8-.4 1.2-1 1.2-.7 0-1.1-.4-1.5-1l-1.1.9zm8.2 0c.9 1.3 2.3 2.1 4.2 2.1 2.4 0 3.9-1.2 3.9-3.2 0-1.9-1.2-2.7-3.1-3.4l-.8-.3c-1.1-.4-1.6-.7-1.6-1.4 0-.6.5-1.1 1.4-1.1.9 0 1.5.4 2 1.2l1.1-.9c-.7-1.1-1.8-1.6-3.1-1.6-2.1 0-3.6 1.2-3.6 3 0 1.7 1 2.5 2.8 3.2l.8.3c1.3.5 1.9.9 1.9 1.6 0 .7-.7 1.2-1.7 1.2-1.1 0-1.9-.5-2.5-1.5l-1.3.8z" fill="#000000" />
  </svg>
);

export const N8nIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#EA4B71">
    <path d="M18.8 6.5A5.2 5.2 0 0 0 13.6 12a5.2 5.2 0 0 0 5.2 5.5 5.2 5.2 0 0 0 5.2-5.5 5.2 5.2 0 0 0-5.2-5.5zm0 8.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM5.2 6.5A5.2 5.2 0 0 0 0 12a5.2 5.2 0 0 0 5.2 5.5A5.2 5.2 0 0 0 10.4 12 5.2 5.2 0 0 0 5.2 6.5zm0 8.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
  </svg>
);

// Smart Brand Icon Resolver helper
export const TechBrandIcon = ({ name, size = 20 }) => {
  const n = (name || '').toLowerCase();
  if (n.includes('python')) return <PythonIcon size={size} />;
  if (n.includes('react')) return <ReactIcon size={size} />;
  if (n.includes('django')) return <DjangoIcon size={size} />;
  if (n.includes('fastapi')) return <FastApiIcon size={size} />;
  if (n.includes('go') || n === 'golang') return <GoIcon size={size} />;
  if (n.includes('pytorch') || n.includes('torch')) return <PyTorchIcon size={size} />;
  if (n.includes('tensor')) return <TensorFlowIcon size={size} />;
  if (n.includes('postgres') || n.includes('sql')) return <PostgresIcon size={size} />;
  if (n.includes('docker') || n.includes('container')) return <DockerIcon size={size} />;
  if (n.includes('javascript') || n === 'js') return <JsIcon size={size} />;
  if (n.includes('n8n')) return <N8nIcon size={size} />;

  // Default fallback icon
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
};

// Brand Color Mapping helper
export const getTechBrandColor = (name) => {
  const n = (name || '').toLowerCase();
  if (n.includes('python')) return '#3776AB';
  if (n.includes('react')) return '#61DAFB';
  if (n.includes('django')) return '#0C4B33';
  if (n.includes('fastapi')) return '#059669';
  if (n.includes('go') || n === 'golang') return '#00ADD8';
  if (n.includes('pytorch')) return '#EE4C2C';
  if (n.includes('tensor')) return '#FF6F00';
  if (n.includes('postgres') || n.includes('sql')) return '#336791';
  if (n.includes('docker')) return '#2496ED';
  if (n.includes('javascript') || n === 'js') return '#F7DF1E';
  if (n.includes('n8n')) return '#EA4B71';
  return '#F62440'; // Default Crimson accent
};
