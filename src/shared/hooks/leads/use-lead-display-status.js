import { useEffect } from "react";
import { useLeadTrackingStore } from "../../../app/store/leads/lead-tracking-store.js";
import { getLeadDisplayStatus, needsTripStartCheck, TRIP_STATUS_REFRESH_MS } from "../../lib/lead-trip-status.js";

export function useLeadDisplayStatus(lead) {
  const hasPolyline = useLeadTrackingStore((state) => state.byLead[String(lead?.id)]);
  const load = useLeadTrackingStore((state) => state.load);
  const shouldCheck = lead?.id != null && needsTripStartCheck(lead) && hasPolyline !== true;
  const leadId = lead?.id;
  const trackingToken = lead?.tracking?.token;
  const trackingUrl = lead?.tracking?.url;

  useEffect(() => {
    if (!shouldCheck) return;
    const check = () => {
      void load({ id: leadId, tracking: { token: trackingToken, url: trackingUrl } })
        .catch(() => {});
    };
    check();
    const timer = setInterval(check, TRIP_STATUS_REFRESH_MS);
    return () => clearInterval(timer);
  }, [shouldCheck, leadId, trackingToken, trackingUrl, load]);

  return getLeadDisplayStatus(lead, hasPolyline);
}
