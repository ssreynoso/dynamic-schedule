import { PropsWithChildren } from 'react'

import { cn } from '../lib/utils'

type DynamicScheduleColumnHeaderProps = PropsWithChildren<{
    className?: string
}>

export const DynamicScheduleColumnHeader = ({ children, className }: DynamicScheduleColumnHeaderProps) => {
    return (
        <div className={cn('sticky top-0 z-[1] flex h-full w-full items-end justify-center border-b p-1', className)}>
            {children}
        </div>
    )
}
