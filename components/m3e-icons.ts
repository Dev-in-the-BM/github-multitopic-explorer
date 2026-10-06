/**
 * Registers the Material Symbols glyphs used by the explorer.
 *
 * `@m3e/icons` ships each glyph's SVG path data, and `registerIcon` hands
 * it to `<m3e-icon>`, which then renders inline `<svg fill="currentColor">`.
 * That is the whole point of importing them here: the alternative is the
 * Google Fonts stylesheet, which needs a network round trip and falls back
 * to showing the raw ligature word ("search") if the font never arrives.
 *
 * Rounded is the M3 Expressive-leaning Material Symbols variant.
 *
 * `registerIcon` no-ops when `window` is undefined, so importing this from
 * a server-rendered pass is safe.
 */
import '@m3e/icons/rounded/hub'
import '@m3e/icons/rounded/search'
import '@m3e/icons/rounded/add'
import '@m3e/icons/rounded/check'
import '@m3e/icons/rounded/dark_mode'
import '@m3e/icons/rounded/light_mode'
import '@m3e/icons/rounded/star'
import '@m3e/icons/rounded/call_split'
import '@m3e/icons/rounded/bug_report'
import '@m3e/icons/rounded/schedule'
import '@m3e/icons/rounded/code'
import '@m3e/icons/rounded/arrow_upward'
import '@m3e/icons/rounded/arrow_downward'
import '@m3e/icons/rounded/filter_alt'
import '@m3e/icons/rounded/inbox'
import '@m3e/icons/rounded/tune'