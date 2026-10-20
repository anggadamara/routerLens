import { describe, it, expect } from 'vitest';
import { getModelIconPath } from './BrandLogo';

describe('getModelIconPath resolver', () => {
  it('correctly maps popular models to TypingMind icon paths', () => {
    expect(getModelIconPath('anthropic/claude-3.5-sonnet')).toBe('/model-icons/claude.webp');
    expect(getModelIconPath('openai/gpt-4o')).toBe('/model-icons/gpt-4.webp');
    expect(getModelIconPath('openai/o1-mini')).toBe('/model-icons/gpt-o1.webp');
    expect(getModelIconPath('deepseek/deepseek-chat')).toBe('/model-icons/deepseek.png');
    expect(getModelIconPath('google/gemini-2.0-flash')).toBe('/model-icons/gemini.png');
    expect(getModelIconPath('meta-llama/llama-3.3-70b-instruct')).toBe('/model-icons/llama.png');
    expect(getModelIconPath('mistralai/mistral-large-2411')).toBe('/model-icons/mistralai.png');
    expect(getModelIconPath('qwen/qwen-2.5-72b-instruct')).toBe('/model-icons/qwen2.png');
    expect(getModelIconPath('perplexity/sonar-reasoning')).toBe('/model-icons/perplexityai.png');
  });

  it('returns null for unknown generic models', () => {
    expect(getModelIconPath('custom/unknown-model')).toBeNull();
  });
});
