/**
 * Fills [data-clock] with the time in Pune ("14:32 IST"). Without JS the
 * markup reads "Pune IST". It ticks once a minute, and only while motion is on;
 * otherwise it shows the time at load, so nothing updates on its own.
 */
export function initClock() {
  const clocks = document.querySelectorAll<HTMLElement>('[data-clock]')
  if (clocks.length === 0) return

  const format = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  const render = () => {
    const text = `${format.format(new Date())} IST`
    clocks.forEach((clock) => (clock.textContent = text))
  }
  const tick = () => {
    if (document.documentElement.dataset.motion === 'on') render()
    window.setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50)
  }

  render()
  tick()
}
