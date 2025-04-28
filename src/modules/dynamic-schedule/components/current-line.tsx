import { useDynamicScheduleScrollIndicatorStore } from '../stores/dynamic-schedule-scroll-indicator-store'
import { useDynamicScheduleStore } from '../stores/dynamic-schedule-store'

interface DynamicScheduleCurrentLineProps {
    firstColumnWidth: number
    columnsQuantity?: number
}

export const DynamicScheduleCurrentLine = (props: DynamicScheduleCurrentLineProps) => {
    const { firstColumnWidth, columnsQuantity } = props

    const scrollIndicator = useDynamicScheduleScrollIndicatorStore((state) => state.scrollIndicator)
    const columnWidth = useDynamicScheduleStore((state) => state.columnWidth)

    const styles = {
        top: `${scrollIndicator?.quantity || 0}px`,
        left: `${firstColumnWidth}px`,
        width: columnsQuantity && columnWidth ? `${columnsQuantity * columnWidth}px` : `calc(100% - ${firstColumnWidth}px)`,
    }

    return <div className='absolute h-[1px] z-1 bg-red-500 pointer-events-none' style={styles} />
}
