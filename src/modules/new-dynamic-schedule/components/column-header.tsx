import { PropsWithChildren } from 'react'
import { cn } from '../../dynamic-schedule/lib/utils'

type DynamicScheduleColumnHeaderProps = PropsWithChildren<{
    className?: string
}>

export const DynamicScheduleColumnHeader = ({ children, className }: DynamicScheduleColumnHeaderProps) => {
    return <div className={cn('h-full w-full flex items-end p-1 justify-center sticky top-0 border-b', className)}>{children}</div>
}
