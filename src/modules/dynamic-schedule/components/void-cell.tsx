import { PropsWithChildren } from 'react'

import { cn } from '../lib/utils'

export const VoidCell = ({ children }: PropsWithChildren) => {
    return <div className={cn('flex h-full w-full items-center justify-center border-b')}>{children}</div>
}
