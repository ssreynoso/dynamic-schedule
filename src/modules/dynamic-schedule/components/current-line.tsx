import { cn } from '../lib/utils'
import { useDynamicScheduleScrollIndicatorStore } from '../stores/dynamic-schedule-scroll-indicator-store'
import { useDynamicScheduleStore } from '../stores/dynamic-schedule-store'

interface DynamicScheduleCurrentLineProps {
    firstColumnWidth: number
    columnsQuantity?: number
    className?: string
}

export const DynamicScheduleCurrentLine = (props: DynamicScheduleCurrentLineProps) => {
    const { firstColumnWidth, columnsQuantity, className } = props

    const scrollIndicator = useDynamicScheduleScrollIndicatorStore(state => state.scrollIndicator)
    const columnWidth = useDynamicScheduleStore(state => state.columnWidth)

    const styles = {
        top: `${scrollIndicator?.quantity || 0}px`,
        left: `${firstColumnWidth}px`,
        width:
            columnsQuantity && columnWidth ? `${columnsQuantity * columnWidth}px` : `calc(100% - ${firstColumnWidth}px)`
    }

    if (!scrollIndicator) return null

    return <div className={cn('pointer-events-none absolute z-[1] h-[1px] bg-red-500', className)} style={styles} />
}
