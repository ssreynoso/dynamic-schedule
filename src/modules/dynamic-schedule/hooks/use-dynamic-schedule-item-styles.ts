import { ItemCoincidences } from '../lib/get-coincidences'

interface Props {
    rowStart: number
    rowSpan: number
    rowHeight: number
    coincidences: ItemCoincidences
}
export const useDynamicScheduleItemStyles = (props: Props) => {
    const { rowStart, rowSpan, rowHeight, coincidences } = props

    const firstRowCoincidence = coincidences.rows[0]?.rowStartCoincidences === 0

    const maxCoincidences = Math.max(...coincidences.rows.map(c => c.coincidentItems))
    const maxOrder = Math.max(...coincidences.rows.map(c => c.order))

    const widthPercent = firstRowCoincidence ? 100 - (maxOrder - 1) * 10 : 100 / (maxCoincidences + 1)
    const translateX = firstRowCoincidence ? 0 : (maxOrder - 1) * 100

    const styles: React.CSSProperties = {
        gridRowStart: rowStart + 1,
        height: `calc(${rowSpan * rowHeight}px - 1px)`,
        width: `calc(${widthPercent}%)`,
        transform: `translateX(${translateX}%)`,
        justifySelf: firstRowCoincidence ? 'flex-end' : undefined
    }

    return { styles }
}
