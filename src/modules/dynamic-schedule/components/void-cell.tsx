import { PropsWithChildren } from 'react'
import { cn } from '../lib/utils'

export const VoidCell = ({ children }: PropsWithChildren) => {
    return <div className={cn('w-full h-full border-b flex items-center justify-center')}>{children}</div>
}
