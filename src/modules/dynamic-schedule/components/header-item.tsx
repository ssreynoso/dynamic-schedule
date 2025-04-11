import { PropsWithChildren } from 'react'

import { HeaderOnClick } from '../types'
import { cn } from '../lib/utils'

type Props = PropsWithChildren<{
    onClick?: HeaderOnClick
    columnId: string | number
}>

export const DynamicScheduleHeaderItem = ({ onClick, columnId, children }: Props) => {
    return (
        <p
            onClick={() => onClick && onClick(columnId)}
            className={cn(
                'flex items-center justify-center border-b bg-muted text-center',
                onClick ? 'cursor-pointer hover:underline' : 'cursor-default'
            )}
        >
            <span className='text-sm font-bold text-muted-foreground'>{children}</span>
        </p>
    )
}
