import { RefObject, useEffect } from 'react'

type ContainerRef = RefObject<HTMLDivElement>
type RowHeight = number

interface IIntervalScrollingInput {
    containerRef: ContainerRef
    rowHeight: RowHeight
    unnecesaryScroll?: number
}

export type IntervalScrollingCallback = (input: IIntervalScrollingInput) => {
    scroll: () => void
    intervalId: number
}

export const useIntervalScrolling = (ref: ContainerRef, rh: RowHeight, callback?: IntervalScrollingCallback) => {
    useEffect(() => {
        if (!callback) return

        const { scroll, intervalId } = callback({ containerRef: ref, rowHeight: rh })
        scroll()

        return () => clearInterval(intervalId)
    }, [])
}
