import { create } from 'zustand'

import { BaseItem } from '../types'

type DynamicScheduleStore = {
    activeItem: BaseItem | null
    setActiveItem: (element: BaseItem | null) => void
    selectedItems: BaseItem[]
    setSelectedItems: (elements: BaseItem[]) => void
    isCtrlPressed: boolean
    setIsCtrlPressed: (value: boolean) => void
    selectedItemTransform: { x: number; y: number } | null
    setSelectedItemTransform: (transform: { x: number; y: number } | null) => void
    scrolledAmount: number
    resetScrolledAmount: () => void
    addScrolledAmount: (amount: number) => void
    currentLinePercentage: number | null
    setCurrentLinePercentage: (percentage: number | null) => void
}

export const useDynamicScheduleStore = create<DynamicScheduleStore>((set, get) => ({
    activeItem: null,
    setActiveItem: element => set({ activeItem: element }),
    selectedItems: [],
    setSelectedItems: elements => set({ selectedItems: elements }),
    isCtrlPressed: false,
    setIsCtrlPressed: value => set({ isCtrlPressed: value }),
    selectedItemTransform: null,
    setSelectedItemTransform: transform => set({ selectedItemTransform: transform }),
    scrolledAmount: 0,
    resetScrolledAmount: () => set({ scrolledAmount: 0 }),
    addScrolledAmount: amount => set({ scrolledAmount: get().scrolledAmount + amount }),
    currentLinePercentage: null,
    setCurrentLinePercentage: percentage => set({ currentLinePercentage: percentage })
}))
