import { useDroppable } from '@dnd-kit/core'
import React, { PropsWithChildren, useRef } from 'react'
import { DndContext } from '@dnd-kit/core'

import { DynamicScheduleProps } from '../types'
import { DynamicScheduleDragOverlay } from './drag-overlay'
import { useContainerDragAndDrop } from '../hooks/use-container-drag-and-drop'
import { ScrollHandler } from '../hooks/use-scroll-indicator'
import { DynamicScheduleCurrentLine } from './current-line'

type DynamicScheduleContainerProps<T> = PropsWithChildren<{
    items: DynamicScheduleProps<T>['items']
    rows: DynamicScheduleProps<T>['rows']
    columns: DynamicScheduleProps<T>['columns']
    onChange: DynamicScheduleProps<T>['onChange']
    headerHeight: number
    firstColumnWidth: number
    rowHeight: number
    styles?: React.CSSProperties
}>

const DynamicScheduleContainerInner = <T,>(props: DynamicScheduleContainerProps<T>) => {
    const { items, children, columns, rows, rowHeight, firstColumnWidth, styles, onChange } = props

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
                className='bg-blue-300 w-full relative h-full grid overflow-x-auto'
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
