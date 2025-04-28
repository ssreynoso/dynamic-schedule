import { useDroppable } from '@dnd-kit/core'
import React, { PropsWithChildren, useRef } from 'react'
import { DndContext } from '@dnd-kit/core'

import { DynamicScheduleProps } from '../types'
import { DynamicScheduleDragOverlay } from './drag-overlay'
import { useContainerDragAndDrop } from '../hooks/use-container-drag-and-drop'
import { ScrollHandler } from '../hooks/use-scroll-indicator'
import { DynamicScheduleCurrentLine } from './current-line'
import { cn } from '../lib/utils'

type DynamicScheduleContainerProps<T> = PropsWithChildren<{
    items: DynamicScheduleProps<T>['items']
    rows: DynamicScheduleProps<T>['rows']
    columns: DynamicScheduleProps<T>['columns']
    onChange: DynamicScheduleProps<T>['onChange']
    headerHeight: number
    firstColumnWidth: number
    rowHeight: number
    styles?: React.CSSProperties
    className?: string
}>

const DynamicScheduleContainerInner = <T,>(props: DynamicScheduleContainerProps<T>) => {
    const { items, children, columns, rows, rowHeight, firstColumnWidth, styles, onChange, className } = props

    const containerRef = useRef<HTMLDivElement>(null)
    const containerId = 'dynamic-schedule-container'
    const { setNodeRef } = useDroppable({
        id: containerId,
    })

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
                className={cn('w-full relative h-full grid overflow-x-auto', className)}
                style={styles}
            >
                <DynamicScheduleCurrentLine firstColumnWidth={firstColumnWidth} columnsQuantity={columns.length} />
                <ScrollHandler containerRef={containerRef} />
                {children}
            </div>
            <DynamicScheduleDragOverlay />
        </DndContext>
    )
}

export const DynamicScheduleContainer = React.memo(DynamicScheduleContainerInner) as typeof DynamicScheduleContainerInner
