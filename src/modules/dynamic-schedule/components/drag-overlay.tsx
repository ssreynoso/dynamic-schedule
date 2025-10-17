import { DragOverlay, Modifier } from '@dnd-kit/core'
import { restrictToHorizontalAxis, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { useMemo } from 'react'

import { ActiveItemStartData } from '../hooks/use-container-drag-and-drop'
import { calculateRelativePosition } from '../lib/calculations'
import { DEFAULT_COLUMN_WIDTH, DEFAULT_ROW_HEIGHT, DRAG_OVERLAY_SECONDARY_OPACITY } from '../lib/constants'
import { mapToArray } from '../lib/utils'
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

    const selectedItemsArray = mapToArray(selectedItems)
    const activeItemRect = selectedItemsArray.find(item => item.id === activeItemData?.itemToMove.id)?.rect

    return (
        <DragOverlay dropAnimation={null} modifiers={modifiers}>
            {activeItem && activeItemData ? (
                <div className='ds-relative ds-h-full' style={{ width: columnWidth || DEFAULT_COLUMN_WIDTH }}>
                    {/* Primary item being dragged */}
                    <ScheduleItemComponent original={activeItemData.itemToMove.original} />

                    {/* Additional selected items in multi-drag */}
                    {selectedItemsArray.map(item => {
                        // Don't render the active item twice
                        if (item.id === activeItemData.itemToMove.id) return null

                        // Calculate position relative to active item
                        const { top: relativeTop, left: relativeLeft } =
                            activeItemRect && item.rect
                                ? calculateRelativePosition({ targetRect: item.rect, baseRect: activeItemRect })
                                : { top: 0, left: 0 }

                        const itemStyles: React.CSSProperties = {
                            position: 'absolute',
                            width: item.rect?.width || columnWidth || DEFAULT_COLUMN_WIDTH,
                            height: item.rect?.height || DEFAULT_ROW_HEIGHT,
                            top: relativeTop,
                            left: relativeLeft,
                            opacity: DRAG_OVERLAY_SECONDARY_OPACITY
                        }

                        return (
                            <div key={item.id} style={itemStyles}>
                                <ScheduleItemComponent original={item.original as T} />
                            </div>
                        )
                    })}
                </div>
            ) : null}
        </DragOverlay>
    )
}
