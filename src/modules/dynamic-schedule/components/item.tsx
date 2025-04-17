import { PropsWithChildren } from 'react'
import { ItemCoincidences } from '../lib/get-coincidences'
import { cn } from '../lib/utils'

type DynamicScheduleAbsoluteProps = PropsWithChildren<{
    className?: string
    row: number
    rowSpan: number
    coincidences: ItemCoincidences
}>

export const DynamicScheduleItem = (props: DynamicScheduleAbsoluteProps) => {
    const { className, children, row, rowSpan, coincidences } = props

    const firstRowCoincidence = coincidences.rows[0].rowStartCoincidences === 0

    const maxCoincidences = Math.max(...coincidences.rows.map((c) => c.coincidentItems))
    const maxOrder = Math.max(...coincidences.rows.map((c) => c.order))

    const widthPercent = firstRowCoincidence ? 100 - (maxOrder - 1) * 10 : 100 / (maxCoincidences + 1)
    const translateX = firstRowCoincidence ? 0 : (maxOrder - 1) * 100

    // Debería recibir el alto de la fila por prop

    const styles: React.CSSProperties = {
        gridRowStart: row + 1,
        height: `calc(${rowSpan * 100}px - 1px)`,
        width: `calc(${widthPercent}%)`,
        transform: `translateX(${translateX}%)`,
        justifySelf: firstRowCoincidence ? 'flex-end' : undefined,
    }

    return (
        <div className={cn('absolute  bg-green-400', className)} style={styles}>
            {children}
        </div>
    )
}
