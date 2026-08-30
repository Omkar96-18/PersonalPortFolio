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

export const TwitterIcon = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const YoutubeIcon = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" stroke="none" />
  </svg>
);

export const LeetCodeIcon = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .666-1.607L9.947 7.99l4.497-4.819c.54-.54.54-1.414 0-1.955a1.374 1.374 0 0 0-.961-.438zM16.48 7.375a1.375 1.375 0 0 0-.968.402l-4.707 4.708a1.376 1.376 0 1 0 1.946 1.946l4.707-4.708a1.375 1.375 0 0 0-.978-2.348z" />
  </svg>
);

export const KaggleIcon = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M18.825 23.859c-.022.08-.095.141-.185.141h-3.339c-.12 0-.23-.06-.29-.16l-4.82-6.84-1.41 1.35v5.51c0 .08-.07.14-.15.14H5.85c-.08 0-.15-.06-.15-.14V.14c0-.08.07-.14.15-.14h2.78c.08 0 .15.06.15.14v13.5l6.08-6.19c.06-.06.14-.09.23-.09h3.47c.1 0 .17.06.2.14.03.09.01.18-.06.25l-6.72 6.64 6.78 9.38c.06.07.08.17.05.25z" />
  </svg>
);

export const DiscordIcon = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

export const TelegramIcon = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

export const InstagramIcon = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const GlobeIcon = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" x2="22" y1="12" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export const MailIcon = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export const LinkIcon = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

// Smart Social Brand Icon Resolver helper
export const SocialBrandIcon = ({ platform, icon, size = 18, className = '', ...props }) => {
  const p = (icon || platform || '').toLowerCase().trim();
  if (p.includes('github') || p.includes('git')) return <Github size={size} className={className} {...props} />;
  if (p.includes('linkedin') || p.includes('in')) return <Linkedin size={size} className={className} {...props} />;
  if (p.includes('twitter') || p.includes('x.com') || p === 'x') return <TwitterIcon size={size} className={className} {...props} />;
  if (p.includes('youtube') || p.includes('yt')) return <YoutubeIcon size={size} className={className} {...props} />;
  if (p.includes('leetcode')) return <LeetCodeIcon size={size} className={className} {...props} />;
  if (p.includes('kaggle')) return <KaggleIcon size={size} className={className} {...props} />;
  if (p.includes('discord')) return <DiscordIcon size={size} className={className} {...props} />;
  if (p.includes('telegram') || p.includes('tg')) return <TelegramIcon size={size} className={className} {...props} />;
  if (p.includes('instagram') || p.includes('insta')) return <InstagramIcon size={size} className={className} {...props} />;
  if (p.includes('mail') || p.includes('email')) return <MailIcon size={size} className={className} {...props} />;
  if (p.includes('globe') || p.includes('web') || p.includes('portfolio') || p.includes('site')) return <GlobeIcon size={size} className={className} {...props} />;
  return <LinkIcon size={size} className={className} {...props} />;
};

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
