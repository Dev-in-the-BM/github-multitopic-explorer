'use client'

import * as React from 'react'
import { M3eTheme } from '@m3e/react/theme'

export type ColorPreference = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'colorPreference'

interface MaterialThemeContextValue {
  /** What the user picked. */
  preference: ColorPreference
  /** What is actually on screen right now. */
  resolved: 'light' | 'dark'
  setPreference: (next: ColorPreference) => void
  toggle: () => void
}

const MaterialThemeContext = React.createContext<MaterialThemeContextValue | null>(null)

/** Read by both this provider and the pre-hydration script in `app/layout.tsx`. */
export const COLOR_PREFERENCE_STORAGE_KEY = STORAGE_KEY

export function useMaterialTheme() {
  const context = React.useContext(MaterialThemeContext)
  if (!context) {
    throw new Error('useMaterialTheme must be used inside <M3eThemeProvider>')
  }
  return context
}

/**
 * GitHub Primer's product-UI accent blue (`fgColor-accent`), not the
 * marketing palette. `m3e-theme` runs this seed through
 * @material/material-color-utilities to derive the `fidelity` base scheme;
 * `globals.css` then pins the roles it owns to exact Primer values (see the
 * `html[data-scheme]` blocks), so the page reads as GitHub while everything
 * Primer has no opinion on keeps its generated, contrast-checked values.
 */
const SEED_COLOR = '#0969da'

/**
 * Owns the color scheme for the whole app.
 *
 * Must be rendered *directly* inside `<body>`: when its `parentElement`
 * is the body, `m3e-theme` publishes `--md-sys-color-*` onto `html` and
 * also owns the body's background/color/type. Nested anywhere else it
 * would only set the variables on its own host.
 */
export function M3eThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = React.useState<ColorPreference>('system')
  const [systemPrefersDark, setSystemPrefersDark] = React.useState(false)

  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      setPreferenceState(stored)
    }

    const query = window.matchMedia('(prefers-color-scheme: dark)')
    setSystemPrefersDark(query.matches)
    const onChange = (event: MediaQueryListEvent) => setSystemPrefersDark(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const resolved: 'light' | 'dark' =
    preference === 'system' ? (systemPrefersDark ? 'dark' : 'light') : preference

  /*
   * The pinned GitHub palette lives in CSS behind `html[data-scheme]`, so
   * the DOM has to carry the resolved scheme the theme element gets as a
   * property. Set here (and pre-paint in layout.tsx) rather than read from
   * the custom element, whose attribute reflection is its own business.
   */
  React.useEffect(() => {
    document.documentElement.dataset.scheme = resolved
  }, [resolved])

  const setPreference = React.useCallback((next: ColorPreference) => {
    setPreferenceState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const toggle = React.useCallback(() => {
    setPreference(resolved === 'dark' ? 'light' : 'dark')
  }, [resolved, setPreference])

  const value = React.useMemo(
    () => ({ preference, resolved, setPreference, toggle }),
    [preference, resolved, setPreference, toggle]
  )

  return (
    <MaterialThemeContext.Provider value={value}>
      {/*
        React 19 hydrates custom elements by writing the props it was given
        straight onto them. `@m3e/web` elements write their own ARIA state
        (`role`, `aria-selected`) and `selected` onto the same nodes from a Lit
        update, so the two writers can disagree.

        This is a development-only console warning: the production build logs
        no hydration errors. `defer-hydration` was measured here and did not
        suppress it, so it is not set — the elements' own state is authoritative
        and React's are written from the same source of truth anyway.
      */}
      <M3eTheme
        color={SEED_COLOR}
        variant="fidelity"
        scheme={resolved}
        contrast="standard"
        motion="expressive"
        strongFocus
      >
        {children}
      </M3eTheme>
    </MaterialThemeContext.Provider>
  )
}