import { Box, box } from 'theme'
import ThemeSwitcher from './ThemeSwitcher'
import Button, { ButtonBase } from './Button'

const DangerButton = box({
  as: Button,
  variant: 'danger',
  children: 'danger!',
})

function App() {
  return (
    <Box sx={(theme) => ({ display: 'flex', flexDirection: 'column', gap: theme.space[0] })}>
      <ButtonBase>asfafafa</ButtonBase>
      <Box
        as={ButtonBase}
        sx={{ color: 'black', borderColor: 'black', '&:hover': { backgroundColor: 'red' } }}
      >
        Yo!
      </Box>
      <ThemeSwitcher />
      <DangerButton />
    </Box>
  )
}

export default App
