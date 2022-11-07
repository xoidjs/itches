import { createRuntimeFn } from './createRuntileFn'
import type {
  PatternOptions,
  PatternResult,
  RuntimeFn,
  VariantGroups,
  VariantSelection,
} from './types'

function mapValues<Input extends Record<string, any>, OutputValue>(
  input: Input,
  fn: (value: Input[keyof Input], key: keyof Input) => OutputValue
): Record<keyof Input, OutputValue> {
  const result: any = {}

  for (const key in input) {
    result[key] = fn(input[key], key)
  }

  return result
}
export function recipe<Variants extends VariantGroups<T>, T, D>(
  options: PatternOptions<T, Variants, D>
): RuntimeFn<T, Variants, D>
export function recipe<Variants extends VariantGroups<T>, T, D>(
  maybeCss: (css: T) => string,
  options: PatternOptions<T, Variants, D>
): RuntimeFn<T, Variants, D>
export function recipe<Variants extends VariantGroups<T>, T, D>(
  maybeCss: any,
  options?: PatternOptions<T, Variants, D>
): RuntimeFn<T, Variants, D> {
  if (!options) {
    // @ts-ignore
    options = maybeCss
    maybeCss = (s: any) => s
  }
  const {
    variants = {},
    defaultVariants = {},
    compoundVariants = [],
    base = '',
  } = options as PatternOptions<T, Variants, D>

  const defaultClassName = maybeCss(base)

  // @ts-expect-error
  const variantClassNames: PatternResult<Variants>['variantClassNames'] = mapValues(
    variants,
    (variantGroup) => mapValues(variantGroup, maybeCss)
  )

  const compounds: Array<[VariantSelection<T, Variants>, string]> = []

  for (const { style: theStyle, variants } of compoundVariants) {
    compounds.push([variants as any, maybeCss(theStyle)])
  }

  const config: PatternResult<T, Variants> = {
    defaultClassName,
    variantClassNames,
    // @ts-ignore
    defaultVariants,
    compoundVariants: compounds,
  }

  return createRuntimeFn(config)
}
