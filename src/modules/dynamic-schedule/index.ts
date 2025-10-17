// Styles
import './styles.css'

// Main component
export { DynamicSchedule } from './components/index'

// Types
export type {
    Column,
    Row,
    Item,
    DynamicScheduleProps,
    DynamicScheduleOnChangeCallback,
    DynamicScheduleOnChangeCallbackInput,
    ScheduleItemComponentProps,
    ScheduleVoidItemComponentProps,
    ScrollIndicator
} from './types'

// Hooks (if needed by consumers)
export { useItemsByColumn } from './hooks/use-items-by-column'
export { useCoincidencesByColumn } from './hooks/use-coincidences-by-column'

// Stores (if consumers need to access them)
export { useDynamicScheduleStore } from './stores/dynamic-schedule-store'
export { useDynamicScheduleScrollIndicatorStore } from './stores/dynamic-schedule-scroll-indicator-store'
export { useDynamicScheduleSelectedItemsStore } from './stores/dynamic-schedule-selected-items-store'
export { useDynamicScheduleMovementStore } from './stores/dynamic-schedule-movement-store'

// Utilities (if needed by consumers)
export { getCoincidences } from './lib/get-coincidences'
export * from './lib/calculations'
export * from './lib/constants'