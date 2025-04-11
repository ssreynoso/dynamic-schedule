import { PropsWithChildren } from 'react'
import { cn } from '../lib/utils'

type Props = PropsWithChildren<{
    className?: string
    style: React.CSSProperties
}>

export const DynamicScheduleHeader = ({ style, className, children }: Props) => {
    return (
        <div className={cn('sticky top-0 z-40 grid h-12', className)} style={style}>
            {children}
        </div>
    )
}
