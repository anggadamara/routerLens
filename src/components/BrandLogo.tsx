import React from 'react';

interface BrandLogoProps {
  modelName: string;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ modelName, className = 'w-5 h-5' }) => {
  const name = modelName.toLowerCase();

  if (name.includes('deepseek')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
        <path d="M12 6a6 6 0 0 0-6 6c0 2.5 1.5 4.5 4 5.5" />
        <circle cx="14" cy="10" r="1.5" fill="currentColor" />
      </svg>
    );
  }

  if (name.includes('meta') || name.includes('llama')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 18c4-4 4-8 0-12m12 12c-4-4-4-8 0-12" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  if (name.includes('mistral')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <rect x="3" y="4" width="4" height="16" rx="1" />
        <rect x="10" y="8" width="4" height="12" rx="1" />
        <rect x="17" y="4" width="4" height="16" rx="1" />
      </svg>
    );
  }

  if (name.includes('anthropic') || name.includes('claude')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m18 15-6-6-6 6" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    );
  }

  if (name.includes('openai') || name.includes('gpt')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v18" />
        <path d="M3 12h18" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    );
  }

  if (name.includes('google') || name.includes('gemini')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 15 9 22 12 15 15 12 22 9 15 2 12 9 9 12 2" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
};

export const OpenRouterLensGlyph: React.FC<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }> = ({
  className = 'w-6 h-6',
  'aria-hidden': ariaHidden = true,
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
    <line x1="12" y1="2" x2="12" y2="4" />
    <line x1="12" y1="20" x2="12" y2="22" />
    <line x1="2" y1="12" x2="4" y2="12" />
    <line x1="20" y1="12" x2="22" y2="12" />
  </svg>
);
