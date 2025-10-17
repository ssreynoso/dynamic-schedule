import { PropsWithChildren } from 'react'

import { cn } from '../lib/utils'

export const VoidCell = ({ children }: PropsWithChildren) => {
    return <div className={cn('ds-flex ds-h-full ds-w-full ds-items-center ds-justify-center ds-border-b')}>{children}</div>
}
