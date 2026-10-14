/**
 * The only JavaScript the browser runs. Every page arrives as complete HTML
 * from the prerender, so this script only adds behaviour: the theme toggle and
 * the nav's current-section marker. The site works fully without it.
 */
import '../styles/globals.css'
import { initActiveSection } from './active-section'
import { initThemeToggle } from './theme'

initThemeToggle()
initActiveSection()
