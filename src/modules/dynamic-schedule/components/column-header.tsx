import { PropsWithChildren } from 'react'

import { cn } from '../lib/utils'

type DynamicScheduleColumnHeaderProps = PropsWithChildren<{
    className?: string
}>

export const DynamicScheduleColumnHeader = ({ children, className }: DynamicScheduleColumnHeaderProps) => {
    return (
        <div className={cn('ds-sticky ds-top-0 ds-z-1 ds-flex ds-h-full ds-w-full ds-items-end ds-justify-center ds-border-b ds-p-1', className)}>
            {children}
        </div>
    )
}
