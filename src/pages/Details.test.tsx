import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { vi, describe, it, expect, afterEach, type MockedFunction } from 'vitest'

type Detail = {
  code: string
  name: string
  region: string
  capital: string[]
  population: number
  languages: Record<string, string>
  currencies: Record<string, { name: string; symbol?: string }>
  timezones: string[]
  flag: string
  maps: { googleMaps?: string; openStreetMaps?: string }
}
type UseCountryDetailResult = {
  country: Detail | null
  loading: boolean
  error: string | null
  getCountryDetail: (code: string) => void | Promise<void>
}

vi.mock('../hooks/useCountry', () => ({
  useCountryDetail: vi.fn<() => UseCountryDetailResult>(),
}))

import Detail from './Detail'
import { useCountryDetail } from '../hooks/useCountry'

const mockedUseCountryDetail = useCountryDetail as unknown as MockedFunction<
    () => UseCountryDetailResult
>

afterEach(() => vi.clearAllMocks())

function renderWithRoute(initialPath = '/countries/CRI') {
  return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/countries/:code" element={<Detail />} />
        </Routes>
      </MemoryRouter>
  )
}

describe('Detail', () => {
  it('shows loading', () => {
    mockedUseCountryDetail.mockReturnValue({
      country: null,
      loading: true,
      error: null,
      getCountryDetail: vi.fn(),
    })
    renderWithRoute()
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('shows error', () => {
    mockedUseCountryDetail.mockReturnValue({
      country: null,
      loading: false,
      error: 'Oops',
      getCountryDetail: vi.fn(),
    })
    renderWithRoute()
    expect(screen.getByText(/error: oops/i)).toBeInTheDocument()
  })

  it('calls getCountryDetail with code from params', async () => {
    const spy = vi.fn()
    mockedUseCountryDetail.mockReturnValue({
      country: null,
      loading: false,
      error: null,
      getCountryDetail: spy,
    })
    renderWithRoute('/countries/CRI')
    await waitFor(() => expect(spy).toHaveBeenCalledWith('CRI'))
  })

  it('renders country data, flag and map links', () => {
    const country: Detail = {
      code: 'CRI',
      name: 'Costa Rica',
      region: 'Americas',
      capital: ['San José'],
      population: 5094118,
      languages: { spa: 'Spanish' },
      currencies: { CRC: { name: 'Costa Rican colón', symbol: '₡' } },
      timezones: ['UTC-06:00'],
      flag: 'https://flagcdn.com/cr.svg',
      maps: {
        googleMaps: 'https://maps.google.com/?q=costa+rica',
        openStreetMaps: 'https://www.openstreetmap.org/relation/287667',
      },
    }

    mockedUseCountryDetail.mockReturnValue({
      country,
      loading: false,
      error: null,
      getCountryDetail: vi.fn(),
    })

    renderWithRoute()

    expect(screen.getByRole('heading', { name: /costa rica/i })).toBeInTheDocument()
    expect(screen.getByText(/americas/i)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /costa rica/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /google maps/i }))
        .toHaveAttribute('href', country.maps.googleMaps)
    expect(screen.getByRole('link', { name: /openstreetmap/i }))
        .toHaveAttribute('href', country.maps.openStreetMaps)
  })
})

describe('Detail effect behavior', () => {
  it('does NOT refetch on rerender with the same :code', async () => {
    const spy = vi.fn()
    mockedUseCountryDetail.mockReturnValue({
      country: null,
      loading: false,
      error: null,
      getCountryDetail: spy,
    })

    const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <MemoryRouter initialEntries={['/countries/CRI']}>
          <Routes>
            <Route path="/countries/:code" element={<>{children}</>} />
          </Routes>
        </MemoryRouter>
    )

    const { rerender } = render(<Detail />, { wrapper: Wrapper })

    await waitFor(() => expect(spy).toHaveBeenCalledWith('CRI'))
    expect(spy).toHaveBeenCalledTimes(1)

    rerender(<Detail />)
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('refetches when :code changes (new route)', async () => {
    const spy = vi.fn()
    mockedUseCountryDetail.mockReturnValue({
      country: null,
      loading: false,
      error: null,
      getCountryDetail: spy,
    })

    const { unmount } = renderWithRoute('/countries/CRI')
    await waitFor(() => expect(spy).toHaveBeenCalledWith('CRI'))

    spy.mockClear()
    unmount()
    renderWithRoute('/countries/USA')

    await waitFor(() => expect(spy).toHaveBeenCalledWith('USA'))
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
