import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useEscapeListener } from '../../hooks/use-escape-listener';

describe('useEscapeListener', () => {
  let onEscape: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onEscape = vi.fn();
  });

  it('should call onEscape(true) when Escape key is pressed', () => {
    renderHook(() => useEscapeListener({ onEscape }));

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    window.dispatchEvent(event);

    expect(onEscape).toHaveBeenCalledWith(true);
    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it('should call onEscape(false) when Escape key is released', () => {
    renderHook(() => useEscapeListener({ onEscape }));

    const event = new KeyboardEvent('keyup', { key: 'Escape' });
    window.dispatchEvent(event);

    expect(onEscape).toHaveBeenCalledWith(false);
    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it('should handle Escape key press and release cycle', () => {
    renderHook(() => useEscapeListener({ onEscape }));

    const keydownEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    window.dispatchEvent(keydownEvent);

    const keyupEvent = new KeyboardEvent('keyup', { key: 'Escape' });
    window.dispatchEvent(keyupEvent);

    expect(onEscape).toHaveBeenCalledTimes(2);
    expect(onEscape).toHaveBeenNthCalledWith(1, true);
    expect(onEscape).toHaveBeenNthCalledWith(2, false);
  });

  it('should not call onEscape for other keys', () => {
    renderHook(() => useEscapeListener({ onEscape }));

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    window.dispatchEvent(event);

    expect(onEscape).not.toHaveBeenCalled();
  });

  it('should remove event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useEscapeListener({ onEscape }));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keyup',
      expect.any(Function)
    );

    removeEventListenerSpy.mockRestore();
  });

  it('should handle multiple Escape key presses', () => {
    renderHook(() => useEscapeListener({ onEscape }));

    const keydownEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    window.dispatchEvent(keydownEvent);
    window.dispatchEvent(keydownEvent);

    expect(onEscape).toHaveBeenCalledTimes(2);
    expect(onEscape).toHaveBeenCalledWith(true);
  });
});
