import { PropsWithChildren } from 'react'
import { cn } from '../../dynamic-schedule/lib/utils'

type DynamicScheduleColumnProps = PropsWithChildren<{
    id: string
    isLast?: boolean
    className?: string
}>

export const DynamicScheduleColumn = (props: DynamicScheduleColumnProps) => {
    const { id, className, isLast, children } = props

    return (
        <div
            id={id}
            className={cn('w-full h-full border-r grid grid-cols-1 grid-rows-[40px] auto-rows-[100px] relative', className, isLast && 'border-none')}
        >
            {children}
        </div>
    )
}
