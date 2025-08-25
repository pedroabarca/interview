// src/components/Items.test.tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { Items } from './Items'
import type { ComponentProps } from 'react'

type ItemsProps = ComponentProps<typeof Items>
type Country = ItemsProps['countries'][number]

const makeCountry = (overrides: Partial<Country> = {}): Country => ({
    code: 'XXX',
    name: 'Example',
    region: 'Test Region',
    flag: 'https://flagcdn.com/xx.svg',
    ...overrides,
})

describe('Items', () => {
    it('renders countries with names, flags and links', () => {
        const countries: ItemsProps['countries'] = [
            makeCountry({ code: 'CRI', name: 'Costa Rica', flag: 'https://flagcdn.com/cr.svg' }),
            makeCountry({ code: 'USA', name: 'United States', flag: 'https://flagcdn.com/us.svg' }),
        ]

        render(
            <MemoryRouter>
                <Items countries={countries} />
            </MemoryRouter>
        )

        expect(screen.getByRole('list')).toBeInTheDocument()
        expect(screen.getAllByRole('listitem')).toHaveLength(2)
        expect(screen.getByText('Costa Rica')).toBeInTheDocument()
        expect(screen.getByText('United States')).toBeInTheDocument()
        expect(screen.getByRole('img', { name: 'Costa Rica' })).toBeInTheDocument()
        expect(screen.getByRole('img', { name: 'United States' })).toBeInTheDocument()
        const hrefs = screen.getAllByRole('link').map(a => a.getAttribute('href'))
        expect(hrefs).toContain('/countries/CRI')
        expect(hrefs).toContain('/countries/USA')
    })

    it('renders empty state when no countries', () => {
        const countries: ItemsProps['countries'] = []

        render(
            <MemoryRouter>
                <Items countries={countries} />
            </MemoryRouter>
        )

        expect(screen.getByText(/No Countries available\./i)).toBeInTheDocument()
        expect(screen.queryByRole('list')).not.toBeInTheDocument()
        expect(screen.queryAllByRole('listitem')).toHaveLength(0)
    })
})
