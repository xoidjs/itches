import { useEffect, useState } from 'react'
import { glob, darkTheme } from 'theme'
import Button from './Button'

glob((theme) => ({ body: { background: theme.body } }))

const ThemeSwitcher = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  useEffect(() => {
    if (isDarkTheme) document.body.classList.add(darkTheme)
    else document.body.classList.remove(darkTheme)
  }, [isDarkTheme])

  return <Button variant="danger" onClick={() => setIsDarkTheme((s) => !s)} />
}

export default ThemeSwitcher
