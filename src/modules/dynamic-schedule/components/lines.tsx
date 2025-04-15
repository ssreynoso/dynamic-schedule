import { cn } from '../lib/utils'

type Props = {
    columns: number
    rows: number
    columnsStyle: React.CSSProperties
    rowsStyle: React.CSSProperties
    className?: string
}

export const DynamicScheduleLines = ({ columns, rows, columnsStyle, rowsStyle, className }: Props) => {
    const rowsArray = Array.from<number>({ length: rows }).fill(0)
    const columnsArray = Array.from<number>({ length: columns }).fill(0)

    return (
        <div className='absolute left-0 top-12 grid h-auto w-full' style={rowsStyle}>
            {rowsArray.map((_, rowIndex) => (
                <div key={`line-${rowIndex}`} className={cn('grid h-full border-b', className)} style={columnsStyle}>
                    {columnsArray.map((_, columnIndex) => (
                        <div key={`line-${rowIndex}-${columnIndex}`} className={cn('h-full w-full border-r', className)}></div>
                    ))}
                </div>
            ))}
        </div>
    )
}
