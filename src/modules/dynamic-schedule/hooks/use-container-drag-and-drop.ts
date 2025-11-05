import { DragMoveEvent, DragStartEvent } from '@dnd-kit/core'
import { useState } from 'react'

import {
    calculateGridPosition,
    calculateMovementDelta,
    calculatePixelPosition,
    hasMovement,
    validatePositionBounds
} from '../lib/calculations'
import { DEFAULT_COLUMN_WIDTH } from '../lib/constants'
import { mapToArray } from '../lib/utils'
import { useDynamicScheduleMovementStore } from '../stores/dynamic-schedule-movement-store'
import { useDynamicScheduleSelectedItemsStore } from '../stores/dynamic-schedule-selected-items-store'
import { useDynamicScheduleStore } from '../stores/dynamic-schedule-store'
import { DynamicScheduleProps, Item } from '../types'

interface ContainerDragAndDropProps<T> {
    containerRef: React.RefObject<HTMLDivElement | null>
    items: DynamicScheduleProps<T>['items']
    rows: DynamicScheduleProps<T>['rows']
    columns: DynamicScheduleProps<T>['columns']
    onChange: DynamicScheduleProps<T>['onChange']
    rowHeight: number
    styles?: React.CSSProperties
    getItemCanDragOnX?: DynamicScheduleProps<T>['getItemCanDragOnX']
}

export const useContainerDragAndDrop = <T>(props: ContainerDragAndDropProps<T>) => {
    const { containerRef, items, rows, columns, rowHeight, getItemCanDragOnX, onChange } = props

    const columnWidth = useDynamicScheduleStore(state => state.columnWidth)
    const setIsDragging = useDynamicScheduleStore(state => state.setIsDragging)
    const setActiveItem = useDynamicScheduleStore(state => state.setActiveItem)
    const selectedItems = useDynamicScheduleSelectedItemsStore(state => state.selectedItems)
    const clearSelectedItems = useDynamicScheduleSelectedItemsStore(state => state.clearSelectedItems)
    const setDelta = useDynamicScheduleMovementStore(state => state.setDelta)

    const [data, setData] = useState<ActiveItemStartData<T> | null>(null)

    /**
     * Helper function to get items to move based on selection state
     * @returns Array of items to move (either selected items or just the active item)
     */
    const getItemsToMove = (activeItemData: Item<T>): Item<T>[] => {
        const selectedItemsArray = mapToArray(selectedItems)
        const hasMultipleSelection = selectedItemsArray.length > 1

        if (hasMultipleSelection) {
            return selectedItemsArray
                .map(selected => items.find(i => i.id === selected.id))
                .filter((item): item is Item<T> => !!item)
        }

        return [activeItemData]
    }

    /**
     * Handles drag movement, calculating the current grid position based on pixel deltas
     * Respects drag restrictions (X/Y axis only) and updates the active item position
     */
    const handleDragMove = (event: DragMoveEvent) => {
        if (!data || !containerRef.current) return

        // Apply drag restrictions based on item configuration
        const deltaX = data.canDragOnX ? event.delta.x : 0
        const deltaY = data.canDragOnY ? event.delta.y : 0

        // Calculate current grid position from pixel coordinates
        const { columnIndex: currentColumn, rowIndex: currentRow } = calculateGridPosition({
            pixelX: data.relativeX + deltaX,
            pixelY: data.relativeY + deltaY,
            columnWidth: columnWidth || DEFAULT_COLUMN_WIDTH,
            rowHeight
        })

        setDelta({ deltaX, deltaY })

        setActiveItem({
            id: data.itemToMove.id,
            colIndex: currentColumn,
            rowIndex: currentRow,
            rowSpan: data.rowSpan
        })
    }

    /**
     * Initializes drag operation when user starts dragging an item
     * Calculates initial positions, stores drag metadata, and updates store state
     * @param event - DragStartEvent from @dnd-kit
     */
    const handleDragStart = (event: DragStartEvent) => {
        const itemToMove = items.find(i => i.id === event.active.id.toString())

        if (!itemToMove) return

        const columnIndex = columns.findIndex(c => c.id === itemToMove.columnId)
        const column = columnIndex + 1
        const row = itemToMove.rowStart

        // Calculate pixel positions for the item
        const { x: columnInPixels, y: rowInPixels } = calculatePixelPosition({
            columnIndex,
            rowIndex: itemToMove.rowStart - 1,
            columnWidth: columnWidth || DEFAULT_COLUMN_WIDTH,
            rowHeight
        })

        setData({
            itemToMove,
            columnIndex,
            column,
            row,
            relativeX: columnInPixels + (columnWidth || DEFAULT_COLUMN_WIDTH) / 2,
            relativeY: rowInPixels,
            rowSpan: itemToMove.rowSpan,
            canDragOnX: getItemCanDragOnX ? getItemCanDragOnX(itemToMove.id) : true,
            canDragOnY: true
        })
        setActiveItem({
            id: itemToMove.id,
            colIndex: columnIndex,
            rowIndex: itemToMove.rowStart - 1,
            rowSpan: itemToMove.rowSpan
        })
        setIsDragging(true)
    }

    const handleDragEnd = () => {
        void finalizeDrag()
    }

    /**
     * Finalizes the drag operation and executes the onChange callback
     *
     * Flow:
     * 1. Validates active item and position bounds
     * 2. Calculates movement delta
     * 3. Gets all items to move (selected or just active)
     * 4. Applies delta to each item and validates new positions
     * 5. Executes onChange callback with moved items
     * 6. Clears selection if multi-drag
     * 7. Cleans up drag state
     */
    const finalizeDrag = async () => {
        const activeItem = useDynamicScheduleStore.getState().activeItem
        const activeItemData: Item<T> | undefined = items.find(i => i.id === data?.itemToMove.id)

        // Validate we have all required data and active item is within bounds
        if (!activeItemData || !activeItem || !data) {
            close()
            return
        }

        const isWithinBounds = validatePositionBounds({
            columnIndex: activeItem.colIndex,
            rowIndex: activeItem.rowIndex,
            columns,
            rows
        })

        if (!isWithinBounds) {
            close()
            return
        }

        // Calculate movement delta between initial and final positions
        const { deltaColumn, deltaRow } = calculateMovementDelta({
            fromColumnIndex: data.columnIndex,
            fromRowIndex: data.row - 1,
            toColumnIndex: activeItem.colIndex,
            toRowIndex: activeItem.rowIndex
        })

        // If there's no movement, cancel without calling onChange
        if (!hasMovement({ deltaColumn, deltaRow })) {
            close()
            return
        }

        // Get items to move based on selection state
        const itemsToMove = getItemsToMove(activeItemData)
        const hasMultipleSelection = itemsToMove.length > 1

        // Apply delta to each item and validate new positions
        const movedItems = itemsToMove
            .map(item => {
                const currentColumnIndex = columns.findIndex(c => c.id === item.columnId)
                const newColumnIndex = currentColumnIndex + deltaColumn
                const newRowIndex = item.rowStart - 1 + deltaRow

                // Validate new position is within bounds
                const isValid = validatePositionBounds({
                    columnIndex: newColumnIndex,
                    rowIndex: newRowIndex,
                    columns,
                    rows
                })

                if (!isValid) {
                    return null
                }

                const newItemCopy = { ...item }
                newItemCopy.columnId = columns[newColumnIndex].id
                newItemCopy.rowStart = newRowIndex + 1
                newItemCopy.rowSpan = item.rowSpan

                return {
                    newScheduleItem: newItemCopy,
                    newColumnId: columns[newColumnIndex].id,
                    newRowId: rows[newRowIndex].id
                }
            })
            .filter((item): item is NonNullable<typeof item> => item !== null)

        // If no items are valid to move, cancel
        if (movedItems.length === 0) {
            close()
            return
        }

        try {
            if (onChange) {
                await onChange({
                    items: movedItems
                })
            }

            // Clear selection after successful multi-drag
            if (hasMultipleSelection) {
                clearSelectedItems()
            }
        } catch {
            // Silently handle errors - user should handle in onChange callback
        } finally {
            close()
        }
    }

    const close = () => {
        setActiveItem(null)
        setIsDragging(false)
    }

    return {
        activeItemData: data,
        handleDragMove,
        handleDragStart,
        handleDragEnd
    }
}

export type ActiveItemStartData<T> = {
    itemToMove: Item<T>
    columnIndex: number
    column: number
    row: number
    rowSpan: number
    relativeX: number
    relativeY: number
    canDragOnX: boolean
    canDragOnY: boolean
}
