import { useEffect } from 'react'

interface Props {
    onEscape: (value: boolean) => void
}

export const useEscapeListener = (props: Props) => {
    const { onEscape } = props

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onEscape(true)
        }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onEscape(false)
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [])
}
