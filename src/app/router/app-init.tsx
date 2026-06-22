import { useEffect } from "react";
import { useLeadsStore } from "../store/leads/leads-store";

export function AppInitializer() {
  const fetchLeads = useLeadsStore((state) => state.fetchLeads);
  const getHistoryLeads = useLeadsStore((state) => state.getHistoryLeads);

  useEffect(() => {
    fetchLeads();
    getHistoryLeads();
  }, []);

  return null;
}
