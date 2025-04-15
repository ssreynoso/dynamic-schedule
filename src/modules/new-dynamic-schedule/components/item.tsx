import { PropsWithChildren } from 'react'
import { cn } from '../../dynamic-schedule/lib/utils'
import { ItemCoincidences } from '../lib/get-coincidences'

type DynamicScheduleAbsoluteProps = PropsWithChildren<{
    className?: string
    row: number
    rowSpan: number
    coincidences: ItemCoincidences
}>

export const DynamicScheduleItem = (props: DynamicScheduleAbsoluteProps) => {
    const { className, children, row, rowSpan } = props

    const maxCoincidences = Math.max(...props.coincidences.rows.map((c) => c.coincidentItems))

    console.log('maxCoincidences', maxCoincidences)

    const styles: React.CSSProperties = {
        gridRowStart: row + 1,
        height: `calc(${rowSpan * 100}px - 1px)`, // Ajusta el alto dinámicamente
        width: `calc(${100 / (maxCoincidences + 1)}%)`, // Ajusta el ancho dinámicamente
    }

    return (
        <div className={cn('absolute  bg-green-400', className)} style={styles}>
            {children}
        </div>
    )
}
