import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect, afterEach, type MockedFunction } from 'vitest'

type HomeCountry = { code: string; name: string }
type UseCountryResult = { countries: HomeCountry[]; loading: boolean; error: string | null }

vi.mock('../hooks/useCountry', () => ({
    useCountry: vi.fn<() => UseCountryResult>(),
}))

import Home from './Home'
import { useCountry } from '../hooks/useCountry'
import {MemoryRouter} from "react-router-dom";

const mockedUseCountry = useCountry as unknown as MockedFunction<() => UseCountryResult>

afterEach(() => vi.clearAllMocks())

describe('Home', () => {
    it('shows loading', () => {
        mockedUseCountry.mockReturnValue({ countries: [], loading: true, error: null })
        render(<Home />)
        expect(screen.getByText(/Loading countries/i)).toBeInTheDocument()
    })

    it('shows error', () => {
        mockedUseCountry.mockReturnValue({ countries: [], loading: false, error: 'Oops' })
        render(<Home />)
        expect(screen.getByText(/Error: Oops/i)).toBeInTheDocument()
    })

    it('renders content', () => {
        mockedUseCountry.mockReturnValue({
            countries: [{ code: 'CRI', name: 'Costa Rica' }],
            loading: false,
            error: null,
        })
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        )
        expect(screen.getByRole('heading', { name: /countries/i })).toBeInTheDocument()
    })
})
