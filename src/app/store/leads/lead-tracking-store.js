import { useStore } from "zustand";
import { createLeadTrackingStore } from "../../../shared/lib/lead-trip-status.js";
import { getLeadTracking } from "../../../shared/api/lead-tracking.js";

export const leadTrackingStore = createLeadTrackingStore(getLeadTracking);
export const useLeadTrackingStore = (selector) => useStore(leadTrackingStore, selector);
