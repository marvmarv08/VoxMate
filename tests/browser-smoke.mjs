import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'

import { chromium } from 'playwright'

const baseUrl = process.env.JR_BASE_URL ?? 'http://127.0.0.1:5173'
const artifactDirectory = new URL('../artifacts/qa/', import.meta.url)

await mkdir(artifactDirectory, { recursive: true })

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await context.newPage()
const browserErrors = []

page.on('console', (message) => {
  if (message.type() === 'error') browserErrors.push(`console: ${message.text()}`)
})
page.on('pageerror', (error) => browserErrors.push(`page: ${error.message}`))

try {
  await page.goto(baseUrl, { waitUntil: 'networkidle' })
  await page.evaluate(() => localStorage.clear())
  await page.reload({ waitUntil: 'networkidle' })

  await assertVisible(page.getByRole('heading', { name: /Meet JR/i }))
  const avatarLoaded = await page.locator('img[alt="JR assistant"]').evaluate(
    (image) => image.complete && image.naturalWidth > 0,
  )
  assert.equal(avatarLoaded, true, 'JR portrait should load')

  await page.getByLabel('Schedule title').fill('Thesis consultation')
  await page.getByLabel('Date').fill('2026-09-28')
  await page.getByLabel('Time').fill('13:30')
  await page.getByLabel(/Notes/).fill('Bring the revised chapter')
  await page.getByRole('button', { name: 'Save to JR' }).click()
  await assertVisible(page.getByText('Thesis consultation'))

  await page.reload({ waitUntil: 'networkidle' })
  await assertVisible(page.getByText('Thesis consultation'))

  await page.getByLabel('Import schedule file').setInputFiles({
    name: 'schedule.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify([
      { title: 'Defense practice', date: '2026-10-02', time: '10:00' },
    ])),
  })
  await assertVisible(page.getByText('Defense practice'))

  await page.getByLabel('Import schedule file').setInputFiles({
    name: 'broken.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{not valid json'),
  })
  await assertVisible(page.getByRole('alert'))
  await assertVisible(page.getByText('Thesis consultation'))

  await page.getByRole('button', { name: 'Talk to JR' }).click()
  await assertVisible(page.getByRole('dialog', { name: 'JR voice assistant' }))
  await page.screenshot({ path: new URL('desktop-popup.png', artifactDirectory).pathname, fullPage: true })
  await page.getByRole('button', { name: 'Close JR' }).click()

  await page.getByRole('button', { name: 'Delete Defense practice' }).click()
  assert.equal(await page.getByText('Defense practice').count(), 0, 'deleted schedule should disappear')
  assert.equal(await page.getByRole('alert').count(), 0, 'completed actions should clear stale errors')
  await page.screenshot({ path: new URL('desktop.png', artifactDirectory).pathname, fullPage: true })

  await page.setViewportSize({ width: 390, height: 844 })
  await page.reload({ waitUntil: 'networkidle' })
  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  )
  assert.equal(hasHorizontalOverflow, false, 'mobile layout should not scroll horizontally')
  await assertVisible(page.getByText('Thesis consultation'))
  await page.screenshot({ path: new URL('mobile.png', artifactDirectory).pathname, fullPage: true })

  assert.deepEqual(browserErrors, [], `browser emitted errors:\n${browserErrors.join('\n')}`)
  console.log('Browser smoke passed: desktop popup, persistence, imports, deletion, and mobile layout.')
} finally {
  await browser.close()
}

async function assertVisible(locator) {
  await locator.waitFor({ state: 'visible' })
  assert.equal(await locator.isVisible(), true)
}
