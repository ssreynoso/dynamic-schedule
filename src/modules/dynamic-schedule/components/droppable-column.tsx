import { PropsWithChildren } from 'react'
import { cn } from '../lib/utils'

type DynamicScheduleDroppableColumnProps = PropsWithChildren<{
    className?: string
    rowHeight: number
    headerHeight: number
}>

export const DynamicScheduleDroppableColumn = (props: DynamicScheduleDroppableColumnProps) => {
    const { className, children, headerHeight, rowHeight } = props

    const styles: React.CSSProperties = {
        gridTemplateRows: headerHeight,
        gridAutoRows: rowHeight,
    }

    return (
        <div className={cn('w-full h-full grid grid-cols-1 relative', className)} style={styles}>
            <div />
            {children}
        </div>
    )
}
