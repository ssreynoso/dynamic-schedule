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
}>

export const DynamicScheduleColumn = (props: DynamicScheduleColumnProps) => {
    const { id, className, isLast, children, saveColumnWidth, headerHeight, rowHeight } = props

    const columnRef = useRef<HTMLDivElement>(null)

    const setColumnWidth = useDynamicScheduleStore((state) => state.setColumnWidth)

    useEffect(() => {
        if (saveColumnWidth && columnRef.current) {
            const columnWidth = columnRef.current.offsetWidth
            if (columnWidth) {
                setColumnWidth(columnWidth)
            }
        }
    }, [id, saveColumnWidth, setColumnWidth])

    const styles: React.CSSProperties = {
        gridTemplateRows: headerHeight,
        gridAutoRows: rowHeight,
    }

    return (
        <div
            ref={columnRef}
            id={id}
            className={cn('w-full h-full border-r grid grid-cols-1 relative', className, isLast && 'border-none')}
            style={styles}
        >
            {children}
        </div>
    )
}
