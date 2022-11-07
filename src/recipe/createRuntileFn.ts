import type { PatternResult, RuntimeFn, VariantGroups, VariantSelection } from './types'

const shouldApplyCompound = <T, Variants extends VariantGroups<T>>(
  compoundCheck: VariantSelection<T, Variants>,
  selections: VariantSelection<T, Variants>,
  defaultVariants: VariantSelection<T, Variants>
) => {
  for (const key of Object.keys(compoundCheck)) {
    if (compoundCheck[key] !== (selections[key] ?? defaultVariants[key])) {
      return false
    }
  }

  return true
}

export const createRuntimeFn =
  <T, Variants extends VariantGroups<T>>(
    config: PatternResult<T, Variants>
  ): RuntimeFn<T, Variants, any> =>
  // @ts-ignore
  (options) => {
    const className = [config.defaultClassName]

    const selections: VariantSelection<T, Variants> = {
      ...config.defaultVariants,
      ...options,
    }
    for (const variantName in selections) {
      const variantSelection = selections[variantName] ?? config.defaultVariants[variantName]

      if (variantSelection != null) {
        let selection = variantSelection

        if (typeof selection === 'boolean') {
          // @ts-expect-error
          selection = selection === true ? 'true' : 'false'
        }

        // @ts-expect-error
        const selectionClassName = config.variantClassNames[variantName][selection]

        if (selectionClassName) {
          className.push(selectionClassName)
        }
      }
    }

    for (const [compoundCheck, compoundClassName] of config.compoundVariants) {
      // @ts-ignore
      if (shouldApplyCompound(compoundCheck, selections, config.defaultVariants)) {
        className.push(compoundClassName)
      }
    }

    return className
  }
