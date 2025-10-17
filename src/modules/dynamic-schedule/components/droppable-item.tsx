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

    return (
        <div className={cn('ds-h-full ds-w-full ds-transition-colors', isActive ? 'ds-bg-cyan-800-20' : 'ds-bg-white-20')}>
            {children}
        </div>
    )
})

DynamicScheduleDroppableItem.displayName = 'DynamicScheduleDroppableItem'
