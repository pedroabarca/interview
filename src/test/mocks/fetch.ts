import type { MockedFunction } from 'vitest'

export function makeFetchResponse<T>(data: T, ok = true, status = 200): Response {
    return { ok, status, json: async () => data } as unknown as Response
}

export function getFetchMock(): MockedFunction<typeof fetch> {
    return globalThis.fetch as unknown as MockedFunction<typeof fetch>
}