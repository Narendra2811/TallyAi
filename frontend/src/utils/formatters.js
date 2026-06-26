/**
 * Indian number formatting utilities.
 *
 * Indian SMB owners think in lakhs and crores, not millions.
 * "₹2.5L" is immediately meaningful. "₹250,000" makes them do math.
 */

export function formatINR(value) {
  const n = parseFloat(value);
  if (isNaN(n)) return String(value);

  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";

  if (abs >= 10_000_000) return `${sign}₹${(abs / 10_000_000).toFixed(2)} Cr`;
  if (abs >= 100_000)    return `${sign}₹${(abs / 100_000).toFixed(2)} L`;
  if (abs >= 1_000)      return `${sign}₹${(abs / 1_000).toFixed(1)}K`;
  return `${sign}₹${abs.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export function formatNumber(value) {
  const n = parseFloat(value);
  if (isNaN(n)) return String(value);
  return n.toLocaleString("en-IN");
}

/**
 * Compact Y-axis labels for charts — keeps the chart readable.
 */
export function chartAxisFormatter(value) {
  const abs = Math.abs(value);
  if (abs >= 10_000_000) return `${(value / 10_000_000).toFixed(1)}Cr`;
  if (abs >= 100_000)    return `${(value / 100_000).toFixed(1)}L`;
  if (abs >= 1_000)      return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
}
