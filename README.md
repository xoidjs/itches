# Itches

Tiny css-in-js library inspired by [Stitches](https://stitches.dev/) built on top of [Goober](https://goober.js.org/)


### Disclaimer

- [Stitches](https://stitches.dev/) (~6 kB) is a HUGE influence to this. However this one is around ~1.2 kB, and the point of making this was proposing a more capable ~"styled" function (named `box`), and a different, more manual way to handle multiple style variants, via the `cx` prop. 

### Usage

1. Run `createItches` in some central `theme` module file, then export utils (and also maybe your `darkTheme` class name for later use).

```js
import createItches from 'itches'

const { Box, box, css, glob, createTheme } = createItches({
  theme: {
    primary: { main: 'blue', light: 'aliceblue' },
    background: 'white,
  },
})

export const darkTheme = createTheme({
  primary: { main: 'darkcyan', light: 'cyan' },
  background: 'black',
})

export { css, Box, box, glob, darkTheme }
```

- No context providers are necessary. Theme switching DOES NOT rely on React context in this library. It relies on CSS4 variables. The theme above is internally represented as the following:
```
:root {
    --primary-main: blue;
    --primary-light: aliceblue;
    --background: white;
}
```
To switch themes, just manually add `darkTheme` class to a HTML element.

### `css` and `glob`

- `css` is the class name generator function, and `glob` adds global styles.
```js
const classes = {
  root: css((theme) => ({
    background: theme.primary.main,
    '&:hover': {
      background: theme.primary.light,
    },
  })),
}

glob((theme) => ({ body: { background: theme.body } }))

```

### `box`

- `box` (lowercase) is the -kinda- "styled" function of this library. It's more capable than usual "styled" functions. (See below)

```js

export const ButtonBase = box((props) => ({
  as: 'button',
  cx: classes.root,
}))

// or more shortly, without the explicit `css` call:
export const ButtonBase = box((props) => ({
  as: 'button',
  sx: (theme) => ({
    background: theme.primary.main,
    '&:hover': {
      background: theme.primary.light,
    },
  },
}))
```

- Up to this point, capabilities are the same with a usual `styled` function, however look at the following: Multiple variants!

```js
export const Button = box((props: { variant: 'default' | 'danger'; disabled?: boolean }) => ({
  as: ButtonBase,
  cx: [
    classes.root,
    classes.variant[props.variant || 'default'],
    { [classes.disabled]: props.disabled },
  ],
  children: 'Switch theme!!!',
}))
```

- No need for manually using some `shouldForwardProp` for `variant` and `disabled`! It's automatic thanks to ES6 Proxy.

- No need for an additional MUI-style `makeStyles` or `withStyles` functions for components receiving multiple classes.

```js
const StyledComponent = box({
  as: MuiComponent,
  classes: {
    root: classes.root,
    paper: classes.paper,
  }
})
```

- An emergent, good feature of this is this. Imagine `Input` expects `type` as a required prop.

```js
const NumberInput = box({
  as: Input,
  type: 'number'
})

const TextInput = box({
  as: Input,
  type: 'text'
})
```

- Uses of `box` is not just styles as you can see.
- `NumberInput` is still able to receive `type` prop, but it's not required anymore. This is typesafe.

- And finally, `Box`. It has the same api with `box`, but it's inline.

```js
<Box as="span" sx={(theme) => ({ background: theme.primary.main })}/>

// or

const styles = css((theme) => ({ background: theme.primary.main }))
<Box as="span" cx={styles} />
```
