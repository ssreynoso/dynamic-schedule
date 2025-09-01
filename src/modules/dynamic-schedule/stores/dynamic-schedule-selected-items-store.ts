import { create } from 'zustand'

export interface DynamicScheduleSelectedItemsStore {
    isCtrlPressed?: boolean
    setCtrlPressed: (pressed: boolean) => void
    selectedItems: string[]
    addSelectedItem: (item: string) => void
    removeSelectedItem: (item: string) => void
    clearSelectedItems: () => void
}

export const useDynamicScheduleSelectedItemsStore = create<DynamicScheduleSelectedItemsStore>((set, get) => ({
    isCtrlPressed: false,
    setCtrlPressed: pressed => set(() => ({ isCtrlPressed: pressed })),
    selectedItems: [],
    addSelectedItem: item => {
        const currentItems = get().selectedItems
        if (!currentItems.includes(item)) {
            set(() => ({ selectedItems: [...currentItems, item] }))
        }
    },
    removeSelectedItem: item => {
        const currentItems = get().selectedItems
        set(() => ({ selectedItems: currentItems.filter(i => i !== item) }))
    },
    clearSelectedItems: () => set(() => ({ selectedItems: [] }))
}))
