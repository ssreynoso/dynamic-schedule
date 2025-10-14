import { DragOverlay, Modifier } from '@dnd-kit/core'
import { restrictToHorizontalAxis, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { useMemo } from 'react'

import { ActiveItemStartData } from '../hooks/use-container-drag-and-drop'
import { useDynamicScheduleSelectedItemsStore } from '../stores/dynamic-schedule-selected-items-store'
import { useDynamicScheduleStore } from '../stores/dynamic-schedule-store'
import { DynamicScheduleProps } from '../types'

interface DynamicScheduleDragOverlayProps<T> {
    activeItemData: ActiveItemStartData<T> | null
    ScheduleItemComponent: DynamicScheduleProps<T>['ScheduleItemComponent']
}

export const DynamicScheduleDragOverlay = <T,>(props: DynamicScheduleDragOverlayProps<T>) => {
    const { activeItemData, ScheduleItemComponent } = props

    const columnWidth = useDynamicScheduleStore(state => state.columnWidth)
    const activeItem = useDynamicScheduleStore(state => state.activeItem)
    const selectedItems = useDynamicScheduleSelectedItemsStore(state => state.selectedItems)

    const modifiers = useMemo<Modifier[] | undefined>(() => {
        if (!activeItemData) return

        const modifiers: Modifier[] = []

        if (!activeItemData.canDragOnX) modifiers.push(restrictToVerticalAxis)
        if (!activeItemData.canDragOnY) modifiers.push(restrictToHorizontalAxis)

        return modifiers
    }, [activeItemData])

    if (!ScheduleItemComponent) return null

    console.log({ selectedItems })

    return (
        <DragOverlay dropAnimation={null} modifiers={modifiers}>
            {activeItem && activeItemData ? (
                <div className='relative h-full' style={{ width: columnWidth || 300 }}>
                    <ScheduleItemComponent original={activeItemData.itemToMove.original} />
                    <>
                        {selectedItems.forEach(item => {
                            console.log({ item })
                            if (item.id === activeItemData.itemToMove.id) return null

                            const itemStyles: React.CSSProperties = {
                                // position: 'absolute',
                                width: item.rect?.width || columnWidth || 300,
                                height: item.rect?.height || 50,
                                top: item.rect?.top || 0,
                                left: item.rect?.left || 0
                            }

                            return (
                                <div key={item.id} style={itemStyles} className='opacity-50'>
                                    <ScheduleItemComponent original={item.original as T} />
                                </div>
                            )
                        })}
                    </>
                </div>
            ) : null}
        </DragOverlay>
    )
}
