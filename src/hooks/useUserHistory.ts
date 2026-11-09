import { useMemo, useSyncExternalStore } from 'react'
import { getUserHistorySnapshot, parseUserHistory, subscribe } from '../lib/userHistory'

function getServerSnapshot() {
  return JSON.stringify({
    version: 1,
    updatedAt: new Date(0).toISOString(),
    itemCounts: {},
    storeOrderCounts: {},
    geo: null,
  })
}

export function useUserHistory() {
  const snapshot = useSyncExternalStore(subscribe, getUserHistorySnapshot, getServerSnapshot)

  return useMemo(() => parseUserHistory(snapshot), [snapshot])
}
