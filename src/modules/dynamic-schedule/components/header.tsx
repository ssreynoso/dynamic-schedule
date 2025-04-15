import { PropsWithChildren } from 'react'
import { cn } from '../lib/utils'

type Props = PropsWithChildren<{
    className?: string
    style: React.CSSProperties
}>

export const DynamicScheduleHeader = ({ style, className, children }: Props) => {
    return (
        <>
            <div className='fixed top-0 left-0 w-max bg-red-500 h-12' />
            <div className={cn('sticky top-0 w-max grid h-12 z-[1]', className)} style={style}>
                {children}
            </div>
        </>
    )
}
