export function formatUsd(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) return '$0.00';
  if (amount === 0) return '$0.00';
  if (Math.abs(amount) < 0.01) {
    return '$' + amount.toFixed(4);
  }
  return '$' + amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatRupiah(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) return 'Rp 0';
  return 'Rp ' + Math.round(amount).toLocaleString('id-ID');
}

export function formatTokens(tokens: number): string {
  if (typeof tokens !== 'number' || isNaN(tokens)) return '0';
  if (tokens >= 1_000_000) {
    return (tokens / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (tokens >= 1_000) {
    return (tokens / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return tokens.toLocaleString('id-ID');
}

export function formatRelativeTime(dateString: string | null, locale: 'en' | 'id' = 'id'): string {
  if (!dateString) return '-';
  const time = new Date(dateString).getTime();
  if (isNaN(time)) return '-';
  const diffSec = Math.floor((Date.now() - time) / 1000);
  if (diffSec < 60) return locale === 'en' ? 'Just now' : 'Baru saja';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return locale === 'en' ? `${diffMin}m ago` : `${diffMin}m lalu`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return locale === 'en' ? `${diffHour}h ago` : `${diffHour}j lalu`;
  const diffDay = Math.floor(diffHour / 24);
  return locale === 'en' ? `${diffDay}d ago` : `${diffDay}h lalu`;
}
