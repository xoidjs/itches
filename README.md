# itches

**itches** is a library inspired by [**Stitches**](https://stitches.dev/). It's not a full-fledged styling solution like Stitches. Instead, it's a tiny synergy util for theming with CSS4 variables. you can use it with any CSS-in-JS library that has a **css** function that takes anything, and returns a classname string. Examples below use `@emotion/css`. 

Among the exports, only `make` and `recipe` is meant for casual use. The rest is for one-off usage inside your **src/theme** module.

**Credit:** The recipe function is a total rip-off from [**vanilla-extract**'s `recipe` function](https://vanilla-extract.style/documentation/packages/recipes/). I only converted it to be CSS-in-JS-library-agnostic.

## Setting up your `src/theme` module

We'll assume the following file structure:
```js
src
└── theme
    ├── tokens.ts
    ├── themes.ts
    ├── themeRecipe.ts
    └── index.ts
```

**src/theme/tokens.ts**
```js
import { createTheme } from 'itches'

export const colors = createTheme({
  common: { white: '#fff', black: '#000' }
  blue: '#060744',
  lighterBlue: '#5355c8',
})
```
> **Hint:** Running `itches.getVars(colors)` (later) would give:
> ```
> {
>    '--common-white': '#fff',
>    '--common-black: '#000',
>    '--blue': '#060744',
>    '--lighter-blue': '#5355c8',
> }
> ```

**src/theme/themes.ts**
```js
import { createTheme } from 'itches'
import { colors } from './tokens'

export const spacingTheme = createTheme({
  space: {
    0: '4px',
    1: '8px',
  },
  radii: {
    0: '12px',
  },
})

export const lightTheme = createTheme({
  primary: { main: colors.blue, lighter: 'aliceblue' },
  foreground: colors.black,
  background: colors.white,
})

// use `lightTheme` as a theme contract
export const darkTheme = createTheme(lightTheme, {
  primary: { main: colors.lighterBlue, lighter: 'cyan' },
  foreground: colors.white,
  background: colors.black,
})
```

**src/theme/themeRecipe.ts**
```js
import { css } from '@emotion/css'
import { make, recipe, getVars } from 'itches'
import { colors } from './tokens'
import { spacing, lightTheme, darkTheme } from './themes'

const classes = make((theme) => css(getVars(theme)), {
  colors,
  spacing,
  light: lightTheme,
  dark: darkTheme,
})

export const themeRecipe = recipe({
  base: classes.colors,
  variants: {
    palette: {
      light: classes.light,
      dark: classes.dark,
    },
    size: {
      // Let's pretend that there are multiple spacing themes
      narrow: classes.spacing,
      wide: classes.spacing,
    },
  },
})
```

**src/theme/index.ts**
```js
import { spacing, lightTheme } from './themes'
// `colors` aren't included on purpose, it'll remain as an implementation detail.
export const theme = { ...spacing, ...lightTheme }
```

## Theme switching

```js
import { themeRecipe } from 'src/theme/themeRecipe'
import { useLayoutEffect } from 'react'

export const useThemeSwitcher = (props: Parameters<typeof themeRecipe>[0]) => {
  const { palette, size } = props
  useLayoutEffect(() => {
    const className = themeRecipe({ palette, size })
    document.body.classList.add(className)
    return () => document.body.classList.remove(className)
  }, [palette, size])
}
```

## Local styling (with variants)

```js
import { css } from '@emotion/css'
import { make } from 'itches'
import { theme } from 'src/theme'
import { box } from 'boxoid'
// alternatively re-export all these from your theme as:
// import { css, make, theme, box } from 'src/theme'

const classes = make(css, {
  root: { 
    borderRadius: theme.radii[0]
  },
  contained: {
    background: theme.primary.main,
    '&:hover': { background: theme.primary.lighter }
  },
  outlined: {
    border: `1px solid ${theme.primary.main}`,
    '&:hover': { border: `1px solid ${theme.primary.lighter}` }
  }
})

const Button = box('button', (props: { variant?: 'outlined' | 'contained' }) => ({
  className: cx(classes.root, classes[props.variant || 'contained'])
}))

export default Button
```
> `boxoid` is another tiny npm package by me. [See it on npm](https://www.npmjs.com/package/boxoid)

Alternatively, using the `recipe` function:

```js
import { css } from '@emotion/css'
import { recipe } from 'itches'
import { theme } from 'src/theme'
import { box } from 'boxoid'

const buttonRecipe = recipe(css, {
  base: { 
    borderRadius: theme.radii[0]
  },
  variants: {
    variant: {
      contained: {
        background: theme.primary.main,
        '&:hover': { background: theme.primary.lighter }
      },
      outlined: {
        border: `1px solid ${theme.primary.main}`,
        '&:hover': { border: `1px solid ${theme.primary.lighter}` }
      },
    },
  },
  defaultVariants: {
    variant: 'contained'
  }
})

const Button = box('button', (props: Parameters<typeof buttonRecipe>[0]) => ({
  className: buttonRecipe(props)
}))

export default Button
```

## What does `make` do exactly?

It just reduces repetition in a typesafe way.
```js
import { css } from '@emotion/css'
import { make } from 'itches'

const classes = make(css, {
  foo: { background: 'red' },
  bar: { background: 'blue' },
  baz: (light: boolean) => ({ color: light ? 'pink': 'brown' })
})
```
same as
```js
import { css } from '@emotion/css'

const classes = {
  foo: css({ background: 'red' }),
  bar: css({ background: 'blue' }),
  baz: (light: boolean) => css({ color: light ? 'pink': 'brown' })
}
```

## Summary

Your CSS in React stack:
```js
export { css, cx, keyframes, injectGlobal } from 'emotion' // or other
export { make, recipe } from 'itches'
export { box } from 'boxoid'
```