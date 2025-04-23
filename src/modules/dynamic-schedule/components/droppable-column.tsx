import { PropsWithChildren } from 'react'
import { cn } from '../lib/utils'

type DynamicScheduleDroppableColumnProps = PropsWithChildren<{
    className?: string
    rowHeight: number
    hearderHeight: number
}>

export const DynamicScheduleDroppableColumn = (props: DynamicScheduleDroppableColumnProps) => {
    const { className, children, hearderHeight, rowHeight } = props

    const styles: React.CSSProperties = {
        gridTemplateRows: hearderHeight,
        gridAutoRows: rowHeight,
    }

    return (
        <div className={cn('w-full h-full grid grid-cols-1 relative', className)} style={styles}>
            <div />
            {children}
        </div>
    )
}
