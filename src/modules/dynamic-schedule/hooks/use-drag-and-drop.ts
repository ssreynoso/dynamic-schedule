import { useEffect, useRef, useState } from 'react'

export const useDragAndDrop = () => {
    const [dragging, setDragging] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    const [offset, setOffset] = useState({ x: 0, y: 0 })

    const [isOriginalVisible, setIsOriginalVisible] = useState(true)
    const [currentContainer, setCurrentContainer] = useState(1)
    const [hoveredContainer, setHoveredContainer] = useState<number | null>(null)

    const elementRef = useRef<HTMLDivElement>(null)
    const cloneRef = useRef<HTMLDivElement>(null)
    const containerRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)]

    // Handle mouse on the selected element to drag
    const handleMouseDown = (e: React.MouseEvent) => {
        if (elementRef.current) {
            const rect = elementRef.current.getBoundingClientRect()

            setDimensions({ width: rect.width, height: rect.height })
            setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top })
            setDragging(true)
            setPosition({ x: rect.left, y: rect.top })
            setIsOriginalVisible(false)
        }
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (dragging) {
            setPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y })

            // Update hovered container based on mouse position
            let newHoveredContainer: number | null = null
            containerRefs.forEach((ref, index) => {
                if (ref.current) {
                    const rect = ref.current.getBoundingClientRect()
                    if (
                        e.clientX >= rect.left &&
                        e.clientX <= rect.right &&
                        e.clientY >= rect.top &&
                        e.clientY <= rect.bottom
                    ) {
                        newHoveredContainer = index
                    }
                }
            })
            setHoveredContainer(newHoveredContainer)
        }
    }

    const handleMouseUp = (e: MouseEvent) => {
        setDragging(false)
        setIsOriginalVisible(true)

        // Determine the new container based on the drop position
        containerRefs.forEach((ref, index) => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect()
                if (
                    e.clientX >= rect.left &&
                    e.clientX <= rect.right &&
                    e.clientY >= rect.top &&
                    e.clientY <= rect.bottom
                ) {
                    setCurrentContainer(index)
                }
            }
        })
        setHoveredContainer(null)
    }

    useEffect(() => {
        if (dragging) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
        } else {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [dragging])

    return {
        elementRef,
        cloneRef,
        containerRefs,
        currentContainer,
        hoveredContainer,
        dragging,
        position,
        dimensions,
        isOriginalVisible,
        handleMouseDown
    }
}
