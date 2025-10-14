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

    // Convertir el Map a array para poder usar .map()
    const selectedItemsArray = Array.from(selectedItems.values())

    // Obtener el rect del item activo para calcular posiciones relativas
    const activeItemRect = selectedItemsArray.find(item => item.id === activeItemData?.itemToMove.id)?.rect

    return (
        <DragOverlay dropAnimation={null} modifiers={modifiers}>
            {activeItem && activeItemData ? (
                <div className='relative h-full' style={{ width: columnWidth || 300 }}>
                    {/* Item principal que se está arrastrando */}
                    <ScheduleItemComponent original={activeItemData.itemToMove.original} />

                    {/* Items seleccionados adicionales */}
                    {selectedItemsArray.map(item => {
                        // No renderizar el item activo dos veces
                        if (item.id === activeItemData.itemToMove.id) return null

                        // Calcular posición relativa al item activo
                        const relativeTop = activeItemRect && item.rect
                            ? item.rect.top - activeItemRect.top
                            : 0
                        const relativeLeft = activeItemRect && item.rect
                            ? item.rect.left - activeItemRect.left
                            : 0

                        const itemStyles: React.CSSProperties = {
                            position: 'absolute',
                            width: item.rect?.width || columnWidth || 300,
                            height: item.rect?.height || 50,
                            top: relativeTop,
                            left: relativeLeft
                        }

                        return (
                            <div key={item.id} style={itemStyles} className='opacity-70'>
                                <ScheduleItemComponent original={item.original as T} />
                            </div>
                        )
                    })}
                </div>
            ) : null}
        </DragOverlay>
    )
}
