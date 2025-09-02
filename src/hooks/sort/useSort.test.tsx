import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useSort } from './useSort';
import type { Country } from '../../types/country';

const makeCountries = (): Country[] => [
    { code: 'B', name: 'Brazil', region: 'Americas', flag: 'b.svg' },
    { code: 'A', name: 'Argentina', region: 'Americas', flag: 'a.svg' },
    { code: 'C', name: 'Chile', region: 'Americas', flag: 'c.svg' },
];

describe('useSort', () => {
    it('returns the same list when sortOn = false', () => {
        const list = makeCountries();
        const { result } = renderHook(() => useSort(list, false));

        // same reference
        expect(result.current).toBe(list);
    });

    it('returns a sorted copy when sortOn = true', () => {
        const list = makeCountries();
        const { result } = renderHook(() => useSort(list, true));

        // new array, not the same reference
        expect(result.current).not.toBe(list);

        // correctly sorted by name
        const names = result.current.map(c => c.name);
        expect(names).toEqual(['Argentina', 'Brazil', 'Chile']);
    });

    it('does not mutate the original list', () => {
        const list = makeCountries();
        const copy = [...list];

        renderHook(() => useSort(list, true));

        expect(list).toEqual(copy); // unchanged
    });

    it('updates when list changes', () => {
        const list1 = makeCountries();
        const list2: Country[] = [
            { code: 'X', name: 'Xylophone', region: 'Test', flag: 'x.svg' },
            { code: 'Z', name: 'Zebra', region: 'Test', flag: 'z.svg' },
        ];

        const { result, rerender } = renderHook(
            ({ list, sortOn }) => useSort(list, sortOn),
            { initialProps: { list: list1, sortOn: true } }
        );

        expect(result.current.map(c => c.name)).toContain('Argentina');

        rerender({ list: list2, sortOn: true });
        expect(result.current.map(c => c.name)).toEqual(['Xylophone', 'Zebra']);
    });
});
