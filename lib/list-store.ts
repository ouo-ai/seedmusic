import { loadList, saveList } from "./studio-store"

/**
 * 极简的 localStorage 列表存储 + 订阅，供 useSyncExternalStore 在同一标签页内
 * 跨组件同步（创作页新增 → 曲库页即时可见）。快照引用在 set 之前保持稳定。
 */

type Listener = () => void

export type ListStore<T> = {
  get: () => T[]
  set: (next: T[] | ((prev: T[]) => T[])) => void
  subscribe: (listener: Listener) => () => void
}

export function createListStore<T>(storageKey: string): ListStore<T> {
  let cache: T[] | null = null
  const listeners = new Set<Listener>()

  const read = (): T[] => {
    if (cache === null) cache = loadList<T>(storageKey)
    return cache
  }

  return {
    get: read,
    set(next) {
      const prev = read()
      const value = typeof next === "function" ? (next as (p: T[]) => T[])(prev) : next
      cache = value
      saveList(storageKey, value)
      listeners.forEach((listener) => listener())
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}
