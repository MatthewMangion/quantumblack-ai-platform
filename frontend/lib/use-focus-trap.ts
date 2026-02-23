import { useEffect, useRef } from 'react';

/**
 * Traps focus within a container element when active.
 * Returns a ref to attach to the container element.
 */
export function useFocusTrap<T extends HTMLElement>(active: boolean) {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (!active || !ref.current) return;

        const container = ref.current;
        const previouslyFocused = document.activeElement as HTMLElement | null;

        // Focus the first focusable element
        const focusableSelector =
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

        const focusFirst = () => {
            const firstFocusable = container.querySelector<HTMLElement>(focusableSelector);
            firstFocusable?.focus();
        };

        // Small delay to let animation start
        const timerId = setTimeout(focusFirst, 50);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            const focusableElements = container.querySelectorAll<HTMLElement>(focusableSelector);
            if (focusableElements.length === 0) return;

            const first = focusableElements[0];
            const last = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        container.addEventListener('keydown', handleKeyDown);

        return () => {
            clearTimeout(timerId);
            container.removeEventListener('keydown', handleKeyDown);
            // Restore focus when closing
            previouslyFocused?.focus();
        };
    }, [active]);

    return ref;
}
