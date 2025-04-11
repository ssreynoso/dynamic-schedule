import { useEffect, useState } from 'react'

import { useDynamicScheduleStore } from '../stores/dynamic-schedule-store'

export const useAutoScroll = (containerRef: React.RefObject<HTMLDivElement | null>) => {
    const [scrollTo, setScrollTo] = useState<'top' | 'bottom' | null>(null)

    const activeItem = useDynamicScheduleStore((state) => state.activeItem)

    const handleMouseMove = (event: React.MouseEvent) => {
        if (!containerRef.current || !activeItem) return

        const bounds = containerRef.current.getBoundingClientRect()
        const { clientY } = event

        const distanceToTop = clientY - bounds.top
        const distanceToBottom = bounds.bottom - clientY

        const threshold = 100

        if (distanceToTop > 0 && distanceToTop < threshold) {
            setScrollTo('top')
        } else if (distanceToBottom > 0 && distanceToBottom < threshold) {
            setScrollTo('bottom')
        } else {
            setScrollTo(null)
        }
    }

    useEffect(() => {
        if (!scrollTo || !containerRef.current || !activeItem) return

        const scrollAmount = 100
        const scrollDirection = scrollTo === 'top' ? -scrollAmount : scrollAmount

        containerRef.current.scrollBy({ top: scrollDirection, behavior: 'smooth' })

        const interval = setInterval(() => {
            if (!containerRef.current) return

            containerRef.current.scrollBy({ top: scrollDirection, behavior: 'smooth' })
        }, 200)

        return () => {
            clearInterval(interval)
        }
    }, [scrollTo, activeItem])

    return { handleMouseMove }
}
