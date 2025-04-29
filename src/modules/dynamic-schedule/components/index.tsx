import { useEffect } from 'react'

import { useDynamicScheduleScrollIndicatorStore } from '../stores/dynamic-schedule-scroll-indicator-store'
import { DynamicScheduleProps } from '../types'

import { DynamicScheduleContent } from './content'

export const DynamicSchedule = <T,>(props: DynamicScheduleProps<T>) => {
    const { scrollIndicator, ...rest } = props

    const setScrollIndicator = useDynamicScheduleScrollIndicatorStore(store => store.setScrollIndicator)

    useEffect(() => {
        if (scrollIndicator) {
            setScrollIndicator(scrollIndicator)
        }
    }, [scrollIndicator, setScrollIndicator])

    return <DynamicScheduleContent {...rest} />
}
