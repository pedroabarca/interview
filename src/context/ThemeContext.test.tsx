import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { ThemeProvider, useTheme } from './ThemeContext';

// A small test component to consume the context
function ThemeConsumer() {
    const { theme, toggleTheme } = useTheme();
    return (
        <div>
            <span data-testid="theme">{theme}</span>
            <button onClick={toggleTheme}>Toggle</button>
        </div>
    );
}

describe('ThemeContext', () => {
    beforeEach(() => {
        document.body.className = ''; // reset body classes before each test
    });

    it('provides default value without provider', () => {
        render(<ThemeConsumer />);
        expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });

    it('applies dark class to body when theme is dark', () => {
        // Force starting theme = dark
        window.matchMedia = () =>
            ({ matches: true } as unknown as MediaQueryList);

        render(
            <ThemeProvider>
                <ThemeConsumer />
            </ThemeProvider>
        );

        expect(document.body.classList.contains('dark')).toBe(true);
    });
});
