import { create } from 'zustand'

interface ActiveItem {
    id: string
    colIndex: number
    rowIndex: number
    rowSpan: number
}

const defaultActiveItem: ActiveItem = {
    id: '',
    colIndex: 0,
    rowIndex: 0,
    rowSpan: 0,
}

export interface DynamicScheduleStore {
    columnWidth: number | null
    setColumnWidth: (width: number) => void
    isDragging: boolean
    setIsDragging: (isDragging: boolean) => void
    activeItem: ActiveItem | null
    setActiveItem: (pointer: Partial<ActiveItem> | null) => void
}

export const useDynamicScheduleStore = create<DynamicScheduleStore>((set, get) => ({
    columnWidth: null,
    setColumnWidth: (width) => set(() => ({ columnWidth: width })),
    isDragging: false,
    setIsDragging: (isDragging) => set(() => ({ isDragging })),
    activeItem: null,
    setActiveItem: (activeItem) => {
        const prevItem = get().activeItem

        if (!activeItem) {
            set(() => ({ activeItem: null }))

            return
        }

        if (!prevItem) {
            set(() => ({ activeItem: { ...defaultActiveItem, ...activeItem } }))
        } else {
            set(() => ({
                activeItem: {
                    ...prevItem,
                    ...activeItem,
                },
            }))
        }
    },
}))
