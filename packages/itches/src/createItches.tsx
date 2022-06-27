import React, { createElement, forwardRef, ComponentProps } from 'react'
import { setup, styled, css, keyframes } from 'goober'
import { prefix } from 'goober/prefixer'
import clsx, { ClassValue } from 'clsx'
import type { Properties as CSSProperties } from 'csstype'
import { varify } from './varify'
import { glob } from 'goober'

type DefaultTheme = {}

type Initialize<T, U> = U | ((theme: T) => U)

export type ComponentType = keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>

export interface CSSAttribute extends CSSProperties {
  [key: string]: CSSAttribute | string | number | undefined | null
}

export type SXProp<Theme extends DefaultTheme> = Initialize<Theme, CSSAttribute>
export type CXProp<T = undefined> = ClassValue

export type BoxProps<Theme extends DefaultTheme, Component extends ComponentType = 'div'> = {
  as?: Component
  sx?: SXProp<Theme>
  cx?: CXProp<Theme>
} & Omit<React.ComponentProps<Component>, 'as' | 'sx' | 'cx'>

export type AttrsProps<T extends Record<string, any>, U extends keyof T> = Omit<
  Omit<T, U> & Partial<Pick<T, U>>,
  'as'
>

const run = (fn: any, arg: any) => (typeof fn === 'function' ? fn(arg) : fn)

const proxy = <T extends object>(item: T) => {
  const set = new Set<string>()
  const proxy = new Proxy(item, {
    get(target, key) {
      set.add(key as string)
      return Reflect.get(target, key)
    },
  })
  return [proxy, set] as const
}

const omit = (object: object, set: Set<string>) => {
  // @ts-ignore
  set.forEach((value) => delete object[value])
  return object
}

const createItches = <Theme extends DefaultTheme>(config: { theme: Theme }) => {
  // TODO:
  const classes = {}
  const [variables, theme] = varify(config.theme)
  // @ts-ignore
  glob({ ':root': variables })

  setup(createElement, prefix)

  const BoxRoot = forwardRef(
    (props: { as?: ComponentType; sx?: SXProp<Theme>; cx?: CXProp<Theme> }, ref) => {
      // @ts-ignore
      const { as = 'div', sx: _sx, cx, className, ...rest } = props
      const cn = clsx(run(cx, classes), className)

      return createElement(as, { ...rest, ref, className: cn })
    }
  )

  const Box = styled(BoxRoot)((props: { sx: SXProp<Theme> }) => {
    return run(props.sx, theme) || {}
  }) as <T extends ComponentType = 'div'>(props: BoxProps<Theme, T>) => JSX.Element

  const box = <U, V extends keyof BoxProps<Theme, T>, T extends ComponentType = 'div'>(
    options: Initialize<
      U,
      {
        as?: T
        sx?: SXProp<Theme>
        cx?: CXProp<Theme>
      } & {
        [K in V]: ComponentProps<T>[K]
      }
    >
  ) => {
    const preserveSpecificity =
      typeof options === 'object' && options.sx && css(run(options.sx, theme))
    return forwardRef((props: U & AttrsProps<BoxProps<Theme, T>, V>, ref) => {
      const [proxyProps, shouldNotForwardProps] = proxy(props)
      const result = run(options, proxyProps)

      const { as, sx: sx1, cx: cx1, ...o } = result
      // @ts-ignore
      const { as: _as, sx: sx2, cx: cx2, ...p } = props
      return (
        // @ts-ignore
        <Box
          {...{
            ...o,
            ...omit(p, shouldNotForwardProps),
            as,
            cx: clsx(run(cx1, classes), preserveSpecificity, run(cx2, classes)),
            sx: { ...(!preserveSpecificity && run(sx1, theme)), ...run(sx2, theme) },
            ref,
          }}
        />
      )
    })
  }

  const createTheme = (theme: Theme) => {
    const [variables] = varify(theme)
    // @ts-ignore
    return css(variables)
  }

  return {
    Box,
    box,
    theme: theme as Theme,
    createTheme,
    glob: (init: Initialize<Theme, CSSAttribute | TemplateStringsArray | string>) =>
      glob(run(init, theme)),
    css: (init: Initialize<Theme, CSSAttribute | TemplateStringsArray | string>) =>
      css(run(init, theme)),
    keyframes: (init: Initialize<Theme, CSSAttribute | TemplateStringsArray | string>) =>
      keyframes(run(init, theme)),
  }
}

export default createItches
