import React, { useState } from 'react';

interface BrandLogoProps {
  modelName: string;
  className?: string;
}

export const getModelIconPath = (modelName: string): string | null => {
  const name = modelName.toLowerCase();

  // Anthropic / Claude
  if (name.includes('anthropic') || name.includes('claude')) {
    return '/model-icons/claude.webp';
  }

  // DeepSeek
  if (name.includes('deepseek')) {
    return '/model-icons/deepseek.png';
  }

  // Google / Gemini / Gemma
  if (name.includes('google') || name.includes('gemini') || name.includes('gemma')) {
    return '/model-icons/gemini.png';
  }

  // Meta / Llama
  if (name.includes('meta') || name.includes('llama')) {
    return '/model-icons/llama.png';
  }

  // Mistral AI / Mixtral / Codestral
  if (name.includes('mistral') || name.includes('mixtral') || name.includes('codestral')) {
    return '/model-icons/mistralai.png';
  }

  // Qwen
  if (name.includes('qwen')) {
    return '/model-icons/qwen2.png';
  }

  // OpenAI
  if (name.includes('openai') || name.includes('gpt') || name.includes('chatgpt')) {
    if (name.includes('o1') || name.includes('o3')) return '/model-icons/gpt-o1.webp';
    if (name.includes('gpt-4')) return '/model-icons/gpt-4.webp';
    return '/model-icons/openai.svg';
  }

  // Perplexity
  if (name.includes('perplexity') || name.includes('sonar')) {
    return '/model-icons/perplexityai.png';
  }

  // Cohere
  if (name.includes('cohere') || name.includes('command')) {
    return '/model-icons/cohere.png';
  }

  // Groq
  if (name.includes('groq')) {
    return '/model-icons/groq.svg';
  }

  // xAI / Grok
  if (name.includes('x-ai') || name.includes('xai') || name.includes('grok')) {
    return '/model-icons/xai.jpg';
  }

  // Microsoft / Phi
  if (name.includes('microsoft') || name.includes('phi')) {
    return '/model-icons/phi-2.png';
  }

  // Hugging Face
  if (name.includes('huggingface') || name.includes('hf')) {
    return '/model-icons/huggingface.png';
  }

  // Kimi / Moonshot
  if (name.includes('kimi') || name.includes('moonshot')) {
    return '/model-icons/kimi-dev.webp';
  }

  // OpenRouter
  if (name.includes('openrouter')) {
    return '/model-icons/openrouterai.png';
  }

  return null;
};

export const BrandLogo: React.FC<BrandLogoProps> = ({ modelName, className = 'w-5 h-5' }) => {
  const [hasError, setHasError] = useState(false);
  const iconPath = getModelIconPath(modelName);

  if (iconPath && !hasError) {
    return (
      <img
        src={iconPath}
        alt=""
        aria-hidden="true"
        loading="lazy"
        onError={() => setHasError(true)}
        className={`${className} object-contain rounded-[4px]`}
      />
    );
  }

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
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
