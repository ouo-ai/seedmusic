/**
 * DB-backed list store with an optimistic in-memory cache, exposed to React via
 * useSyncExternalStore. Mutations update the cache immediately (snappy UI) and
 * write through to the REST endpoint in the background. Loads once per session.
 */

type Listener = () => void

export type Identified = { id: string }

export type ResourceStore<T extends Identified> = {
  get: () => T[]
  subscribe: (listener: Listener) => () => void
  ensureLoaded: () => void
  add: (item: T) => void
  update: (id: string, patch: Partial<T>) => void
  remove: (id: string) => void
}

export function createResourceStore<T extends Identified>(endpoint: string): ResourceStore<T> {
  let cache: T[] = []
  let loaded = false
  let loading = false
  const listeners = new Set<Listener>()
  const emit = () => listeners.forEach((listener) => listener())

  return {
    get: () => cache,
    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    ensureLoaded() {
      if (loaded || loading) return
      loading = true
      fetch(endpoint)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data?.items)) {
            cache = data.items as T[]
            loaded = true
            emit()
          }
        })
        .catch(() => {})
        .finally(() => {
          loading = false
        })
    },
    add(item) {
      cache = [item, ...cache.filter((entry) => entry.id !== item.id)]
      emit()
      void fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      }).catch(() => {})
    },
    update(id, patch) {
      cache = cache.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry))
      emit()
      void fetch(`${endpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      }).catch(() => {})
    },
    remove(id) {
      cache = cache.filter((entry) => entry.id !== id)
      emit()
      void fetch(`${endpoint}/${id}`, { method: "DELETE" }).catch(() => {})
    },
  }
}
