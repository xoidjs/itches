import { css, box, darkTheme } from 'theme'

const classes = {
  root: css((theme) => ({
    appearance: 'none',
    backgroundColor: 'transparent',
    border: `2px solid ${theme.primary.main}`,
    borderRadius: theme.radii[0],
    padding: theme.space[1],
    transition: 'background 200ms',
    cursor: 'pointer',
    ['.' + darkTheme]: {
      color: 'white',
    },
    '&:hover': {
      background: theme.primary.light,
    },
  })),
}

export const ButtonBase = box((props) => ({
  as: 'button',
  cx: classes.root,
}))

const classesExtended = {
  variant: {
    default: {},
    danger: css((theme) => ({ borderColor: theme.danger.main })),
  },
  disabled: css({ opacity: 0.5 }),
}

export const Button = box((props: { variant: 'default' | 'danger'; disabled?: boolean }) => ({
  as: ButtonBase,
  cx: [
    classesExtended.variant[props.variant || 'default'],
    { [classesExtended.disabled]: props.disabled },
  ],
  children: 'Switch theme!!!',
}))

export default Button
