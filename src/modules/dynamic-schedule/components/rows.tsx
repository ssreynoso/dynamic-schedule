import { generateUUID } from '../lib/utils'
import { Row } from '../types'

type Props = {
    rows: Row[]
    style: React.CSSProperties
    className?: string
}

export const DynamicScheduleRows = ({ rows, style }: Props) => {
    return (
        <div className='grid w-full sticky left-0 z-[1]' style={style}>
            {rows.map((row) => (
                <p key={generateUUID()} className='relative flex h-full w-full items-center text-center justify-center p-2'>
                    {row.label}
                </p>
            ))}
        </div>
    )
}
