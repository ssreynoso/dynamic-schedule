import { useEffect, useState } from 'react'

import { useDynamicScheduleStore } from '../stores/dynamic-schedule-store'

export const useKeyboardListeners = () => {
    const [keyPressed, setKeyPressed] = useState(false)

    const setIsCtrlPressed = useDynamicScheduleStore(state => state.setIsCtrlPressed)
    const setSelectedItems = useDynamicScheduleStore(state => state.setSelectedItems)

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.code === 'ControlLeft' || event.code === 'ControlRight') && !keyPressed) {
                setIsCtrlPressed(true)
                setKeyPressed(true)
            }

            if (event.code === 'Escape') {
                setSelectedItems([])
            }
        }

        const handleKeyUp = () => {
            setIsCtrlPressed(false)
            setKeyPressed(false)
        }

        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keyup', handleKeyUp)
        document.addEventListener('blur', handleKeyUp)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('keyup', handleKeyUp)
            document.removeEventListener('blur', handleKeyUp)
        }
    }, [keyPressed, setIsCtrlPressed])
}
