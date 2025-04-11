import { useDynamicScheduleStore } from '../stores/dynamic-schedule-store'
import { Separator } from './separator'

interface Props {
    headerHeight: number
    containerHeight: number
    containerWidth: number
}

export const DynamicScheduleCurrentLine = ({ headerHeight, containerHeight, containerWidth }: Props) => {
    const currentLinePercentage = useDynamicScheduleStore((state) => state.currentLinePercentage)

    if (!currentLinePercentage || currentLinePercentage < 0 || containerHeight === 0) return null

    const pixelsToTop = (containerHeight * currentLinePercentage) / 100 + headerHeight

    const styles = {
        top: `${pixelsToTop}px`,
        width: `${containerWidth}px`,
    }

    return <Separator style={styles} className='absolute h-[2px] bg-crearTurno opacity-40' />
}
