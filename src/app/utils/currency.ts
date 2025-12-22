// Helper to get config from localStorage directly (lightweight, no injection needed)
function getConfigFromStorage(): { currency: string; locale: string } {
  try {
    const raw = localStorage.getItem('bm_config_v1');
    if (raw) {
      const config = JSON.parse(raw);
      return {
        currency: config.currency || 'EUR',
        locale: config.locale || 'es-ES',
      };
    }
  } catch (e) {
    // Fallback to defaults
  }
  return { currency: 'EUR', locale: 'es-ES' };
}

export const formatCurrency = (
  value: number,
  currency?: string,
  locale?: string
): string => {
  // Use provided values or get from localStorage config
  const config = currency && locale 
    ? { currency, locale }
    : getConfigFromStorage();

  const activeCurrency = currency || config.currency;
  const activeLocale = locale || config.locale;

  if (value === null || value === undefined || Number.isNaN(value)) {
    return new Intl.NumberFormat(activeLocale, {
      style: 'currency',
      currency: activeCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(0);
  }
  return new Intl.NumberFormat(activeLocale, {
    style: 'currency',
    currency: activeCurrency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
};
