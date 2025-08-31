# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development**: `pnpm dev` - Start development server with auto-reload
- **Build**: `pnpm build` - Build for production (includes TypeScript compilation)
- **Lint**: `pnpm lint` - Run ESLint
- **Preview**: `pnpm preview` - Preview production build locally

## Architecture

This is a React + TypeScript project built with Vite that implements a dynamic schedule component library. The main component is located in `src/modules/dynamic-schedule/`.

### Core Structure

- **Main Component**: `DynamicSchedule` component in `src/modules/dynamic-schedule/components/index.tsx`
- **State Management**: Uses Zustand stores for global state management
  - `dynamic-schedule-store.ts` - Manages column width, drag state, and active items
  - `dynamic-schedule-scroll-indicator-store.ts` - Handles scroll indicator functionality
- **Types**: Core interfaces defined in `src/modules/dynamic-schedule/types/index.ts`
  - `Column`, `Row`, `Item<T>` interfaces for schedule data
  - `DynamicScheduleProps<T>` for component configuration
  - `ScrollIndicator` for scroll behavior

### Key Features

- **Drag & Drop**: Uses `@dnd-kit/core` for drag and drop functionality
- **Generic Type Support**: Component is generic `<T>` to work with any data type
- **Scroll Indicators**: Built-in scroll indicator system with auto-scroll
- **Customizable Styling**: Uses Tailwind CSS with customizable class props
- **Current Line**: Visual indicator for current time/position

### Development Setup

- Uses pnpm workspace configuration
- Vite with React SWC plugin for fast development
- ESLint with TypeScript configuration
- Tailwind CSS v4 with Vite plugin