import { useEffect } from 'react'

interface Props {
    onCtrl: (value: boolean) => void
}

export const useCtrlListener = (props: Props) => {
    const { onCtrl } = props

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Control') {
            onCtrl(true)
        }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
        if (event.key === 'Control') {
            onCtrl(false)
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
