import { ref, watch } from 'vue'

/**
 * 本地存储 composable
 */
export function useStorage<T>(key: string, defaultValue: T) {
  const storedValue = localStorage.getItem(key)
  const value = ref<T>(
    storedValue ? JSON.parse(storedValue) : defaultValue
  )

  // 监听变化并保存到 localStorage
  watch(
    value,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    { deep: true }
  )

  return value
}

/**
 * 读取本地存储
 */
export function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const storedValue = localStorage.getItem(key)
    return storedValue ? JSON.parse(storedValue) : defaultValue
  } catch {
    return defaultValue
  }
}

/**
 * 保存到本地存储
 */
export function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

