export const formatMoney = (cents: number): string => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    maximumFractionDigits: 2,
    currency: "USD",
  }).format(cents / 100);
};
