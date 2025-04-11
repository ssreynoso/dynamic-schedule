import { cn, generateUUID } from '../lib/utils'
import { Row } from '../types'

type Props = {
    rows: Row[]
    style: React.CSSProperties
    className?: string
}

export const DynamicScheduleRows = ({ rows, style, className }: Props) => {
    return (
        <div className={cn('grid w-full', className)} style={style}>
            {rows.map((row) => (
                <p key={generateUUID()} className='relative flex h-full w-full items-center justify-center p-0 pr-2 text-muted-foreground'>
                    {row.label}
                </p>
            ))}
        </div>
    )
}
