import { DndContext, useDroppable } from '@dnd-kit/core'
import React, { PropsWithChildren, useRef } from 'react'

import { DynamicScheduleProps } from '../types'
import { useContainerDragAndDrop } from '../hooks/use-container-drag-and-drop'
import { ScrollHandler } from '../hooks/use-scroll-indicator'
import { cn } from '../lib/utils'

import { DynamicScheduleDragOverlay } from './drag-overlay'

type DynamicScheduleContainerProps<T> = PropsWithChildren<{
    items: DynamicScheduleProps<T>['items']
    rows: DynamicScheduleProps<T>['rows']
    ScheduleItemComponent: DynamicScheduleProps<T>['ScheduleItemComponent']
    columns: DynamicScheduleProps<T>['columns']
    headerHeight: number
    rowHeight: number
    styles?: React.CSSProperties
    className?: string
    onChange: DynamicScheduleProps<T>['onChange']
    getItemCanDragOnX?: DynamicScheduleProps<T>['getItemCanDragOnX']
}>

const DynamicScheduleContainerInner = <T,>(props: DynamicScheduleContainerProps<T>) => {
    const {
        items,
        children,
        columns,
        rows,
        rowHeight,
        styles,
        onChange,
        className,
        ScheduleItemComponent,
        getItemCanDragOnX
    } = props

    const containerRef = useRef<HTMLDivElement>(null)
    const containerId = 'dynamic-schedule-container'
    const { setNodeRef } = useDroppable({
        id: containerId
    })

    const { activeItemData, handleDragStart, handleDragMove, handleDragEnd } = useContainerDragAndDrop({
        containerRef,
        items,
        rows,
        columns,
        rowHeight,
        onChange,
        getItemCanDragOnX
    })

    return (
        <DndContext onDragMove={handleDragMove} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div
                ref={node => {
                    setNodeRef(node)
                    // @ts-expect-error wanna use ref from useDroppable
                    containerRef.current = node
                }}
                id={containerId}
                className={cn('relative grid h-full w-full overflow-x-auto', className)}
                style={styles}
            >
                <ScrollHandler containerRef={containerRef} />
                {children}
            </div>
            <DynamicScheduleDragOverlay ScheduleItemComponent={ScheduleItemComponent} activeItemData={activeItemData} />
        </DndContext>
    )
}

export const DynamicScheduleContainer = React.memo(
    DynamicScheduleContainerInner
) as typeof DynamicScheduleContainerInner
