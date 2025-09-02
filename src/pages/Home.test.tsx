import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { type MockedFunction } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'

// --- Types used in mocks (minimal shape Items expects) ---
type HomeCountry = { code: string; name: string; region: string; flag: string }
type UseCountryResult = { countries: HomeCountry[]; loading: boolean; error: string | null }
type UseCountrySearchResult = {
    data?: HomeCountry[]
    isLoading: boolean
    isError: boolean
    error?: unknown
}

// --- Mocks ---
// Theme (so the button renders without provider)
vi.mock('../context/ThemeContext', () => ({
    useTheme: vi.fn(() => ({ theme: 'light', toggleTheme: vi.fn() })),
}))

// All countries (original async/await hook)
vi.mock('../hooks/countries/useCountry', () => ({
    useCountry: vi.fn<() => UseCountryResult>(),
}))

// Search (React Query hook) — we mock it so we don't need QueryClientProvider
vi.mock('../hooks/countrySearch/useCountrySearch', () => ({
    useCountrySearch: vi.fn<(q: string) => UseCountrySearchResult>(),
}))

// Sort hook — identity by default (returns input list unchanged)
vi.mock('../hooks/sort/useSort', () => ({
    useSort: vi.fn(<T,>(list: T, _sortOn: boolean) => list),
}))

// --- Imports AFTER mocks ---
import { useCountry } from '../hooks/countries/useCountry'
import { useCountrySearch } from '../hooks/countrySearch/useCountrySearch'
import { useSort } from '../hooks/sort/useSort'

const mockedUseCountry = useCountry as unknown as MockedFunction<() => UseCountryResult>
const mockedUseCountrySearch = useCountrySearch as unknown as MockedFunction<
    (q: string) => UseCountrySearchResult
>
const mockedUseSort = useSort as unknown as MockedFunction<(list: unknown, sortOn: boolean) => unknown>

afterEach(() => vi.clearAllMocks())

describe('Home', () => {
    it('shows loading', () => {
        mockedUseCountry.mockReturnValue({ countries: [], loading: true, error: null })
        mockedUseCountrySearch.mockReturnValue({ data: [], isLoading: false, isError: false })
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        )
        expect(screen.getByText(/loading…/i)).toBeInTheDocument()
    })

    it('shows error (from all countries hook)', () => {
        mockedUseCountry.mockReturnValue({ countries: [], loading: false, error: 'Oops' })
        mockedUseCountrySearch.mockReturnValue({ data: [], isLoading: false, isError: false })
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        )
        expect(screen.getByText(/error: oops/i)).toBeInTheDocument()
    })

    it('renders header and list content (all countries)', () => {
        mockedUseCountry.mockReturnValue({
            countries: [{ code: 'CRI', name: 'Costa Rica', region: 'Americas', flag: 'cr.svg' }],
            loading: false,
            error: null,
        })
        mockedUseCountrySearch.mockReturnValue({ data: [], isLoading: false, isError: false })

        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        )

        // Header text changed to "Search Countries"
        expect(screen.getByRole('heading', { name: /search countries/i })).toBeInTheDocument()
        // Country from the "all" hook is rendered
        expect(screen.getByText(/costa rica/i)).toBeInTheDocument()
    })

    it('switches to search results when typing ≥ 2 characters', async () => {
        const user = userEvent.setup()

        // All countries (initial render)
        mockedUseCountry.mockReturnValue({
            countries: [{ code: 'AAA', name: 'Alpha', region: 'Nowhere', flag: 'a.svg' }],
            loading: false,
            error: null,
        })

        // Search results (returned when input has 2+ chars)
        mockedUseCountrySearch.mockImplementation((q: string) => {
            if ((q ?? '').trim().length >= 2) {
                return {
                    data: [{ code: 'CRI', name: 'Costa Rica', region: 'Americas', flag: 'cr.svg' }],
                    isLoading: false,
                    isError: false,
                }
            }
            return { data: [], isLoading: false, isError: false }
        })

        mockedUseSort.mockImplementation((list: unknown) => list)

        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        )

        // Initially shows "Alpha" from all countries
        expect(screen.getByText(/alpha/i)).toBeInTheDocument()

        // Type 2+ chars → should switch to search list
        const input = screen.getByRole('textbox', { name: /search countries/i })
        await user.type(input, 'co')

        // Now the search result appears
        expect(screen.getByText(/costa rica/i)).toBeInTheDocument()
    })
})
