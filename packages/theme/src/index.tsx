import createItches from 'itches'

const common = {
  space: {
    0: '4px',
    1: '8px',
  },
  radii: {
    0: '10px'
  }
}

const { Box, box, css, glob, createTheme, theme } = createItches({
  theme: {
    primary: { main: 'blue', light: 'aliceblue' },
    danger: { main: 'darkred', surprisingly: { DeepAndSnakeCase: 'indigo' } },
    text: 'black',
    body: 'white',
    ...common
  },
})

console.log(theme)

export const darkTheme = createTheme({
  primary: { main: 'darkcyan', light: 'cyan' },
  danger: { main: '#e91e63', surprisingly: { DeepAndSnakeCase: 'cadetblue' } },
  text: 'white',
  body: 'black',
  ...common
})

export { Box, box, css, glob }
