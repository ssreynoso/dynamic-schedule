import { create } from 'zustand'

interface DeltaInput {
    deltaX: number
    deltaY: number
}

interface DynamicScheduleMovementStore {
    deltaX: number
    deltaY: number
    setDelta: (input: DeltaInput) => void
    resetDelta: () => void
}

export const useDynamicScheduleMovementStore = create<DynamicScheduleMovementStore>(set => ({
    deltaX: 0,
    deltaY: 0,
    setDelta: (input: DeltaInput) =>
        set(() => ({
            deltaX: input.deltaX,
            deltaY: input.deltaY
        })),
    resetDelta: () => set(() => ({ deltaX: 0, deltaY: 0 }))
}))
