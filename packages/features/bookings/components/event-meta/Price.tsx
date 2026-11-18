import { formatPrice } from "@rondevu/lib/currencyConversions";
import { SatSymbol } from "@rondevu/ui/components/icon";

import type { EventPrice } from "@rondevu/features/bookings/types";

export const Price = ({ price, currency, displayAlternateSymbol = true }: EventPrice) => {
  if (price === 0) return null;

  const formattedPrice = formatPrice(price, currency);

  return currency !== "BTC" ? (
    <>{formattedPrice}</>
  ) : (
    <div className="inline-flex items-center justify-center">
      {displayAlternateSymbol && <SatSymbol className="h-4 w-4" />}
      {formattedPrice}
    </div>
  );
};
