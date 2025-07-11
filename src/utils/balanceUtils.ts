// src/utils/balanceUtils.ts

export const hideBalance = (amount: number | string, type: 'currency' | 'crypto' | 'percentage' = 'currency'): string => {
  switch (type) {
    case 'currency':
      return '••••••••';
    case 'crypto':
      return '••••••';
    case 'percentage':
      return '••••%';
    default:
      return '••••••••';
  }
};

export const formatCurrencyWithHiding = (amount: number, isHidden: boolean): string => {
  if (isHidden) {
    return hideBalance(amount, 'currency');
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatCryptoWithHiding = (amount: number, symbol: string, isHidden: boolean): string => {
  if (isHidden) {
    return `${hideBalance(amount, 'crypto')} ${symbol}`;
  }
  const decimals = symbol === 'USDC' || symbol === 'USDT' ? 2 : 4;
  return `${amount.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })} ${symbol}`;
};

export const formatPercentageWithHiding = (percentage: number, isHidden: boolean): string => {
  if (isHidden) {
    return hideBalance(percentage, 'percentage');
  }
  return `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`;
};