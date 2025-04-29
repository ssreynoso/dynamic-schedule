import { useMemo } from 'react'
import { DragOverlay, Modifier } from '@dnd-kit/core'
import { restrictToHorizontalAxis, restrictToVerticalAxis } from '@dnd-kit/modifiers'

import { useDynamicScheduleStore } from '../stores/dynamic-schedule-store'
import { DynamicScheduleProps } from '../types'
import { ActiveItemStartData } from '../hooks/use-container-drag-and-drop'

interface DynamicScheduleDragOverlayProps<T> {
    activeItemData: ActiveItemStartData<T> | null
    ScheduleItemComponent: DynamicScheduleProps<T>['ScheduleItemComponent']
}

export const DynamicScheduleDragOverlay = <T,>(props: DynamicScheduleDragOverlayProps<T>) => {
    const { activeItemData, ScheduleItemComponent } = props

    const columnWidth = useDynamicScheduleStore(state => state.columnWidth)
    const activeItem = useDynamicScheduleStore(state => state.activeItem)

    const modifiers = useMemo<Modifier[] | undefined>(() => {
        if (!activeItemData) return

        const modifiers: Modifier[] = []

        if (!activeItemData.canDragOnX) modifiers.push(restrictToVerticalAxis)
        if (!activeItemData.canDragOnY) modifiers.push(restrictToHorizontalAxis)

        return modifiers
    }, [activeItemData])

    if (!ScheduleItemComponent) return null

    return (
        <DragOverlay dropAnimation={null} modifiers={modifiers}>
            {activeItem && activeItemData ? (
                <div className='h-full' style={{ width: columnWidth || 300 }}>
                    <ScheduleItemComponent original={activeItemData.itemToMove.original} />
                </div>
            ) : null}
        </DragOverlay>
    )
}
