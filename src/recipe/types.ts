export type VariantDefinitions<T> = Record<string, T>

type BooleanMap<T> = T extends 'true' | 'false' ? boolean : T

export type VariantGroups<StyleRule> = Record<string, VariantDefinitions<StyleRule>>
export type VariantSelection<
  StyleRule,
  Variants extends VariantGroups<StyleRule>,
  DefaultProps = {}
> = {
  [VariantGroup in Exclude<keyof Variants, keyof DefaultProps>]: BooleanMap<
    keyof Variants[VariantGroup]
  >
} & Partial<DefaultProps>

export type PatternResult<T, Variants extends VariantGroups<T>> = {
  defaultClassName: string
  variantClassNames: {
    [P in keyof Variants]: { [P in keyof Variants[keyof Variants]]: string }
  }
  defaultVariants: Partial<VariantSelection<T, Variants>>
  compoundVariants: Array<[Partial<VariantSelection<T, Variants>>, string]>
}

export interface CompoundVariant<T, Variants extends VariantGroups<T>> {
  variants: Partial<VariantSelection<T, Variants>>
  style: T
}

export type PatternOptions<StyleRule, Variants extends VariantGroups<StyleRule>, DefaultProps> = {
  base?: StyleRule
  variants?: Variants
  defaultVariants?: DefaultProps
  compoundVariants?: Array<CompoundVariant<StyleRule, Variants>>
}

export type RuntimeFn<T, Variants extends VariantGroups<T>, DefaultProps> = (
  options: VariantSelection<T, Variants, DefaultProps>
) => string
