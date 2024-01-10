export function formatCurrency({ value = '0', locale = "pt-BR", currency = "BRL" }) {
  const amount = parseFloat(value)
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount)

  return formatted;
}
