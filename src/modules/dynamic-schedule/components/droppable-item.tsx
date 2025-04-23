import React, { PropsWithChildren, useCallback } from 'react'
import { DynamicScheduleStore, useDynamicScheduleStore } from '../stores/dynamic-schedule-store'
import { cn } from '../lib/utils'

type DroppableItemProps = PropsWithChildren<{ colIndex: number; rowIndex: number }>

export const DynamicScheduleDroppableItem = React.memo((props: DroppableItemProps) => {
    const { colIndex, rowIndex, children } = props

    const isActiveCalculator = useCallback(
        (s: DynamicScheduleStore) => {
            return (
                s.activeItem?.colIndex === colIndex &&
                (s.activeItem?.rowIndex === rowIndex ||
                    (rowIndex < s.activeItem?.rowIndex + s.activeItem?.rowSpan && rowIndex >= s.activeItem?.rowIndex))
            )
        },
        [colIndex, rowIndex]
    )

    const isActive = useDynamicScheduleStore(isActiveCalculator)

    return <div className={cn('w-full h-full flex items-center justify-center border', isActive ? 'bg-green-300' : 'bg-blue-300')}>{children}</div>
})
