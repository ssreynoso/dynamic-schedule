import { create } from 'zustand'

interface SelectedItem {
    id: string
    rect: DOMRect | undefined
    original: unknown
}

interface RemoveSelectedItemInput {
    id: string
}

export interface DynamicScheduleSelectedItemsStore {
    isCtrlPressed?: boolean
    setCtrlPressed: (pressed: boolean) => void
    selectedItems: Map<string, SelectedItem>
    addSelectedItem: (selectedItem: SelectedItem) => void
    removeSelectedItem: (input: RemoveSelectedItemInput) => void
    clearSelectedItems: () => void
}

export const useDynamicScheduleSelectedItemsStore = create<DynamicScheduleSelectedItemsStore>(set => ({
    isCtrlPressed: false,
    setCtrlPressed: pressed => set(() => ({ isCtrlPressed: pressed })),
    selectedItems: new Map<string, SelectedItem>(),
    addSelectedItem: selectedItem =>
        set(state => {
            if (state.selectedItems.has(selectedItem.id)) return state // no cambies nada si ya existe
            const next = new Map(state.selectedItems)
            next.set(selectedItem.id, selectedItem)
            return { selectedItems: next }
        }),

    removeSelectedItem: ({ id }) =>
        set(state => {
            if (!state.selectedItems.has(id)) return state // evita renders innecesarios
            const next = new Map(state.selectedItems)
            next.delete(id)
            return { selectedItems: next }
        }),

    clearSelectedItems: () => set(() => ({ selectedItems: new Map<string, SelectedItem>() }))
}))
