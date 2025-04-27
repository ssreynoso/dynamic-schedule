import { useEffect, useState } from 'react'
import { DynamicScheduleProps } from '../types'

interface ScrollIndicatorProps<T> {
    containerRef: React.RefObject<HTMLDivElement | null>
    scrollIndicator: DynamicScheduleProps<T>['scrollIndicator']
}

export const useScrollIndicator = <T>(props: ScrollIndicatorProps<T>) => {
    const { containerRef, scrollIndicator } = props

    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const canScroll = scrollIndicator?.autoScroll || !scrolled

        if (containerRef.current && scrollIndicator && scrollIndicator.quantity !== 0 && canScroll) {
            containerRef.current.scrollTo({ top: scrollIndicator.quantity, left: 0, behavior: 'smooth' })
            setScrolled(true)
        }
    }, [containerRef, scrollIndicator, scrolled])
}
