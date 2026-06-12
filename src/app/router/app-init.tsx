import { useEffect } from "react";
import { useLeadsStore } from "../store/leads-store";

export function AppInitializer() {
  const fetchLeads = useLeadsStore((state) => state.fetchLeads);
  const getHistoryLead = useLeadsStore((state) => state.getHistoryLead);

  useEffect(() => {
    fetchLeads();
    getHistoryLead();
  }, []);

  return null;
}
