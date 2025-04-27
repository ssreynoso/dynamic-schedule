import { useState } from 'react'
import { useDynamicScheduleStore } from '../stores/dynamic-schedule-store'
import { DynamicScheduleProps, Item } from '../types'
import { DragMoveEvent, DragStartEvent } from '@dnd-kit/core'

interface ContainerDragAndDropProps<T> {
    containerRef: React.RefObject<HTMLDivElement | null>
    items: DynamicScheduleProps<T>['items']
    rows: DynamicScheduleProps<T>['rows']
    columns: DynamicScheduleProps<T>['columns']
    onChange: DynamicScheduleProps<T>['onChange']
    rowHeight: number
    styles?: React.CSSProperties
}

export const useContainerDragAndDrop = <T>(props: ContainerDragAndDropProps<T>) => {
    const { containerRef, items, rows, columns, onChange, rowHeight } = props

    const columnWidth = useDynamicScheduleStore((state) => state.columnWidth)
    const setIsDragging = useDynamicScheduleStore((state) => state.setIsDragging)
    const setActiveItem = useDynamicScheduleStore((state) => state.setActiveItem)

    const [data, setData] = useState<ActiveItemStartData<T> | null>(null)

    const handleDragMove = (event: DragMoveEvent) => {
        if (!data || !containerRef.current) return

        const currentColumn = Math.floor((data.relativeX + event.delta.x) / (columnWidth || 0))
        const currentRow = Math.floor((data.relativeY + event.delta.y) / rowHeight)

        setActiveItem({
            id: data.itemToMove.id,
            colIndex: currentColumn,
            rowIndex: currentRow,
            rowSpan: data.rowSpan,
        })
    }

    const handleDragStart = (event: DragStartEvent) => {
        const itemToMove = items.find((i) => i.id === event.active.id.toString())

        if (!itemToMove) return

        const columnIndex = columns.findIndex((c) => c.id === itemToMove.columnId)
        const column = columnIndex + 1
        const row = itemToMove.rowStart
        const columnInPixels = columnIndex * (columnWidth || 0)
        const rowInPixels = (itemToMove.rowStart - 1) * rowHeight

        setData({
            itemToMove,
            columnIndex,
            column,
            row,
            relativeX: columnInPixels + (columnWidth || 0) / 2,
            relativeY: rowInPixels,
            rowSpan: itemToMove.rowSpan,
        })
        setActiveItem({
            id: itemToMove.id,
            rowSpan: itemToMove.rowSpan,
        })
        setIsDragging(true)
    }

    const handleDragEnd = () => {
        void finalizeDrag()
    }

    const finalizeDrag = async () => {
        const activeItem = useDynamicScheduleStore.getState().activeItem
        const newItem: Item<T> | undefined = items.find((i) => i.id === data?.itemToMove.id)

        if (
            !newItem ||
            !activeItem ||
            !data ||
            activeItem.colIndex < 0 ||
            activeItem.colIndex >= columns.length ||
            activeItem.rowIndex < 0 ||
            activeItem.rowIndex >= rows.length
        ) {
            close()
            return
        }

        const newItemCopy = { ...newItem }

        newItemCopy.columnId = columns[activeItem.colIndex].id
        newItemCopy.rowStart = activeItem.rowIndex + 1
        newItemCopy.rowSpan = activeItem.rowSpan
        newItemCopy.original = data.itemToMove.original

        await onChange({ items: [newItemCopy] })

        close()
    }

    const close = () => {
        setActiveItem(null)
        setIsDragging(false)
    }

    return {
        handleDragMove,
        handleDragStart,
        handleDragEnd,
    }
}

type ActiveItemStartData<T> = {
    itemToMove: Item<T>
    columnIndex: number
    column: number
    row: number
    rowSpan: number
    relativeX: number
    relativeY: number
}
