import { create } from "zustand";

import { ScrollIndicator } from "../types";

interface DynamicScheduleScrollIndicatorStore {
  scrollIndicator: ScrollIndicator | null;
  setScrollIndicator: (scrollIndicator?: ScrollIndicator) => void;
}

export const useDynamicScheduleScrollIndicatorStore = create<DynamicScheduleScrollIndicatorStore>(
  (set) => ({
    scrollIndicator: null,
    setScrollIndicator: (scrollIndicator) => set(() => ({ scrollIndicator })),
  }),
);
