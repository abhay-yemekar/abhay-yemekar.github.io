/**
 * The only JavaScript the browser runs. Every page arrives as complete HTML
 * from the prerender, so this script only adds behaviour: the theme toggle,
 * the nav's current-section marker, and the HireLens explainer where one
 * exists. The site works fully without it.
 */
import '../styles/globals.css'
import { initActiveSection } from './active-section'
import { initThemeToggle } from './theme'

initThemeToggle()
initActiveSection()

// A separate chunk, fetched only on pages that carry the explainer.
const explainer = document.querySelector<HTMLElement>('[data-explainer]')
if (explainer) void import('./explainer').then(({ initExplainer }) => initExplainer(explainer))
