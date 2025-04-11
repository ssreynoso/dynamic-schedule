import { useEffect } from 'react'

import { useDynamicScheduleStore } from '../stores/dynamic-schedule-store'

interface Props {
    percentage: number | null
}

export const useDynamicScheduleCurrentTime = ({ percentage }: Props) => {
    const setCurrentLinePercentage = useDynamicScheduleStore(state => state.setCurrentLinePercentage)

    useEffect(() => {
        setCurrentLinePercentage(percentage)
    }, [percentage])
}
