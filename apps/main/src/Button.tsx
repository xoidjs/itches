import { css, box } from 'theme'

const classes2 = {
  root: css((theme) => ({
    appearance: 'none',
    backgroundColor: 'transparent',
    border: `2px solid ${theme.primary.main}`,
    borderRadius: theme.radii[0],
    padding: theme.space[1],
    transition: 'background 200ms',
    cursor: 'pointer',
    '&:hover': {
      background: theme.primary.light,
    },
  })),
}

export const ButtonBase = box((props) => ({
  as: 'button',
  cx: [classes2.root],
}))

const classes = {
  variant: {
    default: {},
    danger: css((theme) => ({ borderColor: theme.danger.main })),
  },
  disabled: css({ opacity: 0.5 }),
}

export const Button = box((props: { variant: 'default' | 'danger'; disabled?: boolean }) => ({
  as: ButtonBase,
  cx: [classes.variant[props.variant || 'default'], { [classes.disabled]: props.disabled }],
  children: 'Switch theme!!!',
}))

export default Button
