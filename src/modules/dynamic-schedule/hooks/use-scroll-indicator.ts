import { useEffect, useState } from 'react'
import { useDynamicScheduleScrollIndicatorStore } from '../stores/dynamic-schedule-scroll-indicator-store'

interface ScrollHandlerProps {
    containerRef: React.RefObject<HTMLDivElement | null>
}

export const ScrollHandler = (props: ScrollHandlerProps) => {
    const { containerRef } = props

    const scrollIndicator = useDynamicScheduleScrollIndicatorStore((store) => store.scrollIndicator)
    const [scrolled, setScrolled] = useState(false)

    // console.log('ScrollHandler render')

    useEffect(() => {
        const canScroll = scrollIndicator?.autoScroll || !scrolled

        if (containerRef.current && scrollIndicator && scrollIndicator.quantity !== 0 && canScroll) {
            containerRef.current.scrollTo({ top: scrollIndicator.quantity, left: 0, behavior: 'smooth' })
            setScrolled(true)
        }
    }, [containerRef, scrollIndicator, scrolled])

    return null
}
