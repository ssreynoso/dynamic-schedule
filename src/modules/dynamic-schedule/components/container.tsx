import { useDroppable } from '@dnd-kit/core'
import React, { PropsWithChildren, useRef } from 'react'
import { DndContext } from '@dnd-kit/core'

import { DynamicScheduleProps } from '../types'
import { DynamicScheduleDragOverlay } from './drag-overlay'
import { useContainerDragAndDrop } from '../hooks/use-container-drag-and-drop'
import { useScrollIndicator } from '../hooks/use-scroll-indicator'

type DynamicScheduleContainerProps<T> = PropsWithChildren<{
    items: DynamicScheduleProps<T>['items']
    rows: DynamicScheduleProps<T>['rows']
    columns: DynamicScheduleProps<T>['columns']
    scrollIndicator: DynamicScheduleProps<T>['scrollIndicator']
    onChange: DynamicScheduleProps<T>['onChange']
    headerHeight: number
    rowHeight: number
    styles?: React.CSSProperties
}>

const DynamicScheduleContainerInner = <T,>(props: DynamicScheduleContainerProps<T>) => {
    const { items, children, columns, rows, rowHeight, styles, onChange, scrollIndicator } = props

    const containerRef = useRef<HTMLDivElement>(null)
    const containerId = 'dynamic-schedule-container'
    const { setNodeRef } = useDroppable({
        id: containerId,
    })

    useScrollIndicator({ containerRef, scrollIndicator })

    const { handleDragStart, handleDragMove, handleDragEnd } = useContainerDragAndDrop({
        containerRef,
        items,
        rows,
        columns,
        onChange,
        rowHeight,
    })

    return (
        <DndContext onDragMove={handleDragMove} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div
                ref={(node) => {
                    setNodeRef(node)
                    containerRef.current = node
                }}
                id={containerId}
                className='bg-blue-300 w-full relative h-full grid overflow-x-auto'
                style={styles}
            >
                {children}
            </div>
            <DynamicScheduleDragOverlay />
        </DndContext>
    )
}

export const DynamicScheduleContainer = React.memo(DynamicScheduleContainerInner) as typeof DynamicScheduleContainerInner
