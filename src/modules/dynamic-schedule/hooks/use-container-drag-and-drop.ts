import { DragMoveEvent, DragStartEvent } from '@dnd-kit/core'
import { useState } from 'react'

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

    const handleDragMove = (event: DragMoveEvent) => {
        if (!data || !containerRef.current) return

        // Los delta son los que tengo que limitar segun el tipo de movimiento
        const deltaX = data.canDragOnX ? event.delta.x : 0
        const deltaY = data.canDragOnY ? event.delta.y : 0
        const currentColumn = Math.floor((data.relativeX + deltaX) / (columnWidth || 0))
        const currentRow = Math.floor((data.relativeY + deltaY) / rowHeight)

        setDelta({ deltaX, deltaY })

        setActiveItem({
            id: data.itemToMove.id,
            colIndex: currentColumn,
            rowIndex: currentRow,
            rowSpan: data.rowSpan
        })
    }

    const handleDragStart = (event: DragStartEvent) => {
        const itemToMove = items.find(i => i.id === event.active.id.toString())

        if (!itemToMove) return

        const columnIndex = columns.findIndex(c => c.id === itemToMove.columnId)
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
            canDragOnX: getItemCanDragOnX ? getItemCanDragOnX(itemToMove.id) : true,
            canDragOnY: true
        })
        setActiveItem({
            id: itemToMove.id,
            rowSpan: itemToMove.rowSpan
        })
        setIsDragging(true)
    }

    const handleDragEnd = () => {
        void finalizeDrag()
    }

    const finalizeDrag = async () => {
        const activeItem = useDynamicScheduleStore.getState().activeItem
        const activeItemData: Item<T> | undefined = items.find(i => i.id === data?.itemToMove.id)

        if (
            !activeItemData ||
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

        // Calcular el delta de movimiento del item activo
        const deltaColumn = activeItem.colIndex - data.columnIndex
        const deltaRow = activeItem.rowIndex - (data.row - 1)

        // Obtener los items seleccionados o solo el item activo si no hay selección
        const selectedItemsArray = Array.from(selectedItems.values())
        const hasMultipleSelection = selectedItemsArray.length > 1

        const itemsToMove = hasMultipleSelection
            ? selectedItemsArray.map(selected => items.find(i => i.id === selected.id)).filter((item): item is Item<T> => !!item)
            : [activeItemData]

        // Crear las nuevas posiciones para cada item
        const movedItems = itemsToMove.map(item => {
            const currentColumnIndex = columns.findIndex(c => c.id === item.columnId)
            const newColumnIndex = currentColumnIndex + deltaColumn
            const newRowIndex = item.rowStart - 1 + deltaRow

            // Validar que la nueva posición esté dentro de los límites
            if (
                newColumnIndex < 0 ||
                newColumnIndex >= columns.length ||
                newRowIndex < 0 ||
                newRowIndex >= rows.length
            ) {
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
        }).filter((item): item is NonNullable<typeof item> => item !== null)

        // Si no hay items válidos para mover, cancelar
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

            // Si hubo multi-selección exitosa, limpiar la selección
            if (hasMultipleSelection) {
                clearSelectedItems()
            }
        } catch {
            //
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
