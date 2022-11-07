export const make = <T, U, V extends Record<string, T | ((...arg: any) => T)>>(
  fn: (value: T) => U,
  items: V
): {
  [K in keyof V]: V[K] extends (...args: infer P) => T ? (...args: P) => U : U
} => {
  const nextItems = {}
  Object.keys(items).forEach((key) => {
    const item = items[key]
    ;(nextItems as any)[key] =
      typeof item === 'function' ? (...args: any) => fn((item as any)(...args)) : fn(item)
  })
  return nextItems as any
}