import { PropsWithChildren, useEffect, useRef } from 'react'

import { cn } from '../lib/utils'
import { useDynamicScheduleStore } from '../stores/dynamic-schedule-store'

type DynamicScheduleColumnProps = PropsWithChildren<{
    id: string
    isLast?: boolean
    className?: string
    saveColumnWidth?: boolean
    rowHeight: number
    headerHeight: number
    minColumnWidth?: number
}>

export const DynamicScheduleColumn = (props: DynamicScheduleColumnProps) => {
    const { id, className, isLast, children, saveColumnWidth, headerHeight, rowHeight, minColumnWidth } = props

    const columnRef = useRef<HTMLDivElement>(null)

    const setColumnWidth = useDynamicScheduleStore(state => state.setColumnWidth)

    useEffect(() => {
        if (saveColumnWidth && columnRef.current) {
            const columnWidth = columnRef.current.offsetWidth
            if (columnWidth) {
                setColumnWidth(columnWidth)
            }
        }
    }, [id, saveColumnWidth, setColumnWidth, minColumnWidth])

    const styles: React.CSSProperties = {
        gridTemplateRows: headerHeight,
        gridAutoRows: rowHeight
    }

    return (
        <div
            ref={columnRef}
            id={id}
            className={cn('ds-relative ds-grid ds-h-full ds-w-full ds-grid-cols-1 ds-border-r', className, isLast && 'ds-border-none')}
            style={styles}
        >
            {children}
        </div>
    )
}
