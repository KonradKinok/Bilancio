// export function calculateTotalAmount(quantities: string[], prices: string[]): string {
//   if (quantities && prices) {
//     const totalAmount = quantities.reduce((acc, quantity, i) => {
//       const price = prices[i];
//       if (price) {
//         return acc + parseFloat(quantity) * parseFloat(price);
//       }
//       return acc;
//     }, 0);

//     return currencyFormater(totalAmount.toString());
//   }
//   return currencyFormater("0");
// }

export function calculateTotalAmount(quantities: string[], prices: string[]): string {
  // Sprawdź, czy tablice są poprawne i mają tę samą długość
  if (!quantities || !prices || quantities.length !== prices.length) {
    return currencyFormater("0");
  }

  const totalAmount = quantities.reduce((acc, quantity, i) => {
    const price = prices[i];
    // Sprawdź, czy quantity i price są poprawnymi liczbami
    const parsedQuantity = parseFloat(quantity);
    const parsedPrice = parseFloat(price);
    if (!isNaN(parsedQuantity) && !isNaN(parsedPrice)) {
      return acc + parsedQuantity * parsedPrice;
    }
    return acc; // Pomiń niepoprawne pary
  }, 0);

  return currencyFormater(totalAmount.toString());
}
export function currencyFormater(value: string | number | null | undefined): string {
  const currencyFormatter = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  });

  if (value === null || value === undefined) {
    return currencyFormatter.format(0);
  }

  const num =
    typeof value === "number" ? value : parseFloat(value.replace(",", "."));

  if (isNaN(num)) {
    return currencyFormatter.format(0);
  }

  return currencyFormatter.format(num);
}