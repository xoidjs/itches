type DeepObject = { [x: string]: unknown }

const dasherize = (str: string) => str.replace(/([A-Z])/g, ($1) => `-${$1.toLowerCase()}`)

const withVar = (str: string) => `var( ${str} )`

// const checkIsLeaf = (obj: object) => Object.values(obj).every((item) => typeof item !== 'object')

export const varify = function <T>(obj: DeepObject, separator = '-', prefix = '-') {
  const flatObject: Record<string, T> = {}
  const copiedObject = {}

  function inner(o: DeepObject, c: DeepObject, p: string) {
    for (const f in o) {
      const oo = o[f]
      const key = p + separator + dasherize(f)

      if (oo && typeof oo === 'object') {
        // const isLeaf = checkIsLeaf(oo)
        Object.assign(c, { [f]: /* isLeaf ? withVar(key)  */ { ...oo } })

        inner(oo as any, c[f] as any, (p ? p + separator : '') + f)
      } else {
        Object.assign(c, { [f]: withVar(key) })

        // @ts-ignore
        flatObject[key] = o[f]
      }
    }
    return [flatObject, c]
  }
  return inner(obj, copiedObject, prefix)
}
