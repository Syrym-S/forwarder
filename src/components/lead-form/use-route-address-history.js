import { useEffect, useState } from "react";
import {
  readRouteAddressHistory,
  ROUTE_ADDRESS_HISTORY_EVENT,
  ROUTE_ADDRESS_HISTORY_KEY,
} from "./lib/route-address-history.js";

export function useRouteAddressHistory() {
  const [history, setHistory] = useState(() => readRouteAddressHistory());

  useEffect(() => {
    const refresh = () => setHistory(readRouteAddressHistory());
    const handleStorage = (event) => {
      if (event.key === ROUTE_ADDRESS_HISTORY_KEY || event.key === null)
        refresh();
    };
    window.addEventListener(ROUTE_ADDRESS_HISTORY_EVENT, refresh);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", refresh);
    const timer = history.length
      ? setTimeout(
          refresh,
          Math.max(
            0,
            Math.min(...history.map((entry) => entry.expiresAt)) - Date.now(),
          ),
        )
      : undefined;

    return () => {
      window.removeEventListener(ROUTE_ADDRESS_HISTORY_EVENT, refresh);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", refresh);
      clearTimeout(timer);
    };
  }, [history]);

  return history;
}
