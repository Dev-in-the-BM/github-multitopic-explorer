'use client'

import * as React from 'react'
import { M3eIcon } from '@m3e/react/icon'

type M3eIconProps = React.ComponentProps<typeof M3eIcon>

/**
 * `<m3e-icon>` resolves glyphs from a per-variant registry, and only
 * *outlined* is the built-in default. `components/m3e-icons.ts` registers the
 * **rounded** Material Symbols paths, so without an explicit
 * `variant="rounded"` every lookup misses and the component falls back to
 * rendering the raw ligature word ("star") as text.
 *
 * Routing all icons through this wrapper keeps that contract in one place
 * instead of repeating `variant` on all 40-odd call sites.
 */
export function Icon({ variant, ...props }: M3eIconProps) {
  return <M3eIcon variant={variant ?? 'rounded'} {...props} />
}