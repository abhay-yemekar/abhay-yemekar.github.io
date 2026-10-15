/**
 * Behaviour for the HireLens explainer (src/components/HireLensExplainer.tsx).
 * The markup already holds every criterion, rationale and both resume texts.
 * This only switches which one is showing. Loaded on demand by main.ts, so
 * pages without the explainer never download it.
 */
export function initExplainer(root: HTMLElement) {
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-criterion]')]
  const details = [...root.querySelectorAll<HTMLElement>('[data-detail]')]
  const marks = [...root.querySelectorAll<HTMLElement>('mark[data-keys]')]
  const box = root.querySelector<HTMLElement>('[data-resume-box]')
  const blindToggle = root.querySelector<HTMLButtonElement>('[data-blind-toggle]')
  const texts = {
    clear: root.querySelector<HTMLElement>('[data-resume="clear"]'),
    blind: root.querySelector<HTMLElement>('[data-resume="blind"]'),
  }

  const select = (key: string) => {
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.criterion === key)))
    details.forEach((d) => (d.hidden = d.dataset.detail !== key))
    marks.forEach((m) => m.toggleAttribute('data-active', (m.dataset.keys ?? '').split(' ').includes(key)))

    // Bring the first highlighted span into view inside the resume box,
    // without scrolling the page itself.
    const visible = blindToggle?.getAttribute('aria-pressed') === 'true' ? texts.blind : texts.clear
    const target = visible?.querySelector<HTMLElement>('mark[data-active]')
    if (box && target) {
      box.scrollTop += target.getBoundingClientRect().top - box.getBoundingClientRect().top - box.clientHeight / 3
    }
  }

  buttons.forEach((b) => b.addEventListener('click', () => select(b.dataset.criterion ?? '')))

  blindToggle?.addEventListener('click', () => {
    const blind = blindToggle.getAttribute('aria-pressed') !== 'true'
    blindToggle.setAttribute('aria-pressed', String(blind))
    if (texts.clear) texts.clear.hidden = blind
    if (texts.blind) texts.blind.hidden = !blind
  })
}
