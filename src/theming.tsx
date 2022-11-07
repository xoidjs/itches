export type DefaultTheme = {}

const dasherize = (str: string) => str.replace(/([A-Z])/g, ($1) => `-${$1.toLowerCase()}`)

const withVar = (str: string) => `var( ${str} )`

const map = new Map()

const varify = function (obj: unknown, separator = '-', prefix = '-') {
  const variables = {},
    lookup = {},
    objCopy = {}
  function varifyInner(obj: any, clonedObj: any, beginKey: string) {
    for (const key in obj) {
      const childObj = obj[key]
      const variableKey = beginKey + separator + dasherize(key)
      if (typeof childObj === 'object' && childObj !== null) {
        clonedObj[key] = {}
        varifyInner(childObj as any, clonedObj[key] as any, beginKey + separator + key)
      } else {
        clonedObj[key] = withVar(variableKey)
        ;(lookup as any)[clonedObj[key]] = obj[key]
        ;(variables as any)[variableKey] = obj[key]
      }
    }
  }
  varifyInner(obj, objCopy, prefix)
  map.set(objCopy, { lookup, variables })
  return objCopy
}

export function createTheme<T extends DefaultTheme>(theme: T): T
export function createTheme<T extends DefaultTheme>(baseTheme: T, theme: T): T
export function createTheme<T extends DefaultTheme>(themeOrBaseTheme: T, theme?: T): T {
  return varify(theme || themeOrBaseTheme) as T
}

export const getVars = <T,>(theme: T): Record<string, string> => map.get(theme).variables

export const readVar = <T extends DefaultTheme>(theme: T, variable: string): string =>
  map.get(theme).lookup[variable] || getVars(theme)[variable]
