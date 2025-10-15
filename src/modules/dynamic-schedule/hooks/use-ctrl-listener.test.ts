import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCtrlListener } from './use-ctrl-listener';

describe('useCtrlListener', () => {
  let onCtrl: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onCtrl = vi.fn();
  });

  it('should call onCtrl(true) when Control key is pressed', () => {
    renderHook(() => useCtrlListener({ onCtrl }));

    const event = new KeyboardEvent('keydown', { key: 'Control' });
    window.dispatchEvent(event);

    expect(onCtrl).toHaveBeenCalledWith(true);
    expect(onCtrl).toHaveBeenCalledTimes(1);
  });

  it('should call onCtrl(false) when Control key is released', () => {
    renderHook(() => useCtrlListener({ onCtrl }));

    const event = new KeyboardEvent('keyup', { key: 'Control' });
    window.dispatchEvent(event);

    expect(onCtrl).toHaveBeenCalledWith(false);
    expect(onCtrl).toHaveBeenCalledTimes(1);
  });

  it('should handle Control key press and release cycle', () => {
    renderHook(() => useCtrlListener({ onCtrl }));

    const keydownEvent = new KeyboardEvent('keydown', { key: 'Control' });
    window.dispatchEvent(keydownEvent);

    const keyupEvent = new KeyboardEvent('keyup', { key: 'Control' });
    window.dispatchEvent(keyupEvent);

    expect(onCtrl).toHaveBeenCalledTimes(2);
    expect(onCtrl).toHaveBeenNthCalledWith(1, true);
    expect(onCtrl).toHaveBeenNthCalledWith(2, false);
  });

  it('should not call onCtrl for other keys', () => {
    renderHook(() => useCtrlListener({ onCtrl }));

    const event = new KeyboardEvent('keydown', { key: 'Shift' });
    window.dispatchEvent(event);

    expect(onCtrl).not.toHaveBeenCalled();
  });

  it('should remove event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useCtrlListener({ onCtrl }));

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

  it('should handle multiple Control key presses', () => {
    renderHook(() => useCtrlListener({ onCtrl }));

    const keydownEvent = new KeyboardEvent('keydown', { key: 'Control' });
    window.dispatchEvent(keydownEvent);
    window.dispatchEvent(keydownEvent);
    window.dispatchEvent(keydownEvent);

    expect(onCtrl).toHaveBeenCalledTimes(3);
    expect(onCtrl).toHaveBeenCalledWith(true);
  });
});
