import { useEffect } from "react";
import { useLeadsStore } from "../store/leads-store";

export function AppInitializer() {
  const fetchLeads = useLeadsStore((state) => state.fetchLeads);

  useEffect(() => {
    fetchLeads();
  }, []);

  return null;
}
