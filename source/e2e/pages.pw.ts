import { expect, test } from '@playwright/test'

test.afterEach(async ({ page }) => {
  expect(await page.pageErrors()).toEqual([])
})

test('cold home stays under 200 KiB of JS and opens the networking guide on demand', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText("Hi! I'm Spencer Le Bleu")
  const bytes = await page.evaluate(() => (performance.getEntriesByType('resource') as PerformanceResourceTiming[])
    .filter(r => new URL(r.name).pathname.endsWith('.js')).reduce((sum, r) => sum + r.decodedBodySize, 0))
  expect(bytes).toBeGreaterThan(0)
  expect(bytes).toBeLessThan(200 * 1024)
  await page.getByRole('link', { name: 'Student desk', exact: true }).click()
  const courses = page.getByRole('region', { name: 'Available courses' })
  await expect(courses.getByText('Coming Soon')).toHaveCount(2)
  await expect(courses.getByRole('link')).toHaveCount(1)
  await courses.getByRole('link').click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('An Introduction to Computer Networking')
  await page.goBack()
  await expect(courses).toBeVisible()
})

test('legacy networking bookmark preserves chapter context and a completed worksheet', async ({ page }) => {
  await page.goto('/csc138/?from=bookmark#/practice/chapter5')
  await expect(page).toHaveURL('/?from=bookmark#/student/csc138/practice/chapter5')
  const lab = page.getByRole('region', { name: 'Compare paths by total cost' })
  await lab.getByRole('button', { name: 'Check answers' }).click()
  const complete = lab.getByRole('button', { name: 'Mark activity complete' })
  await expect(complete).toBeDisabled()
  await lab.getByLabel('Cost of direct u → w').fill('5')
  await lab.getByLabel('Cost of u → x → y → w').fill('3')
  await lab.getByLabel('Least-cost path').fill('u x y w')
  await lab.getByRole('button', { name: 'Check answers' }).click()
  await complete.click()
  await page.reload()
  await expect(lab.getByRole('button', { name: 'Activity complete', exact: true })).toBeVisible()
  await page.getByRole('tab', { name: 'Chapter quiz' }).click()
  const submit = page.getByRole('button', { name: 'Submit answers' })
  await expect(submit).toBeDisabled()
  for (const question of await page.locator('.question-card').all()) await question.locator('label').first().click()
  await submit.click()
  await expect(page.locator('.quiz-result')).toContainText('/18')
  await page.getByRole('button', { name: 'Try again' }).click()
  await expect(submit).toBeDisabled()
  await page.goto('/#/student/csc139/chapter2')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Follow the service boundary.')
  await page.getByRole('button', { name: 'Mark lesson complete' }).click()
  const progress = await page.evaluate(() => ['csc138', 'csc139'].map(course => JSON.parse(localStorage.getItem(`${course}-progress-v1`)!)))
  expect(progress[0].chapterQuizzes.chapter5.attempts).toBe(1)
  expect(progress[0].completedLessons).toHaveLength(0)
  expect(progress[1].completedLessons).toHaveLength(1)
})

test('a missing course chunk offers a way back and can recover on reload', async ({ page }) => {
  const chunk = '**/assets/OsApp-*.js'
  await page.route(chunk, route => route.fulfill({ status: 404, body: '' }))
  await page.goto('/#/student/csc139/dashboard')
  await expect(page.getByRole('alert')).toContainText('Could not load')
  await expect(page.getByRole('link', { name: 'Return to the student desk' })).toHaveAttribute('href', '#/student')
  await page.unroute(chunk)
  await page.getByRole('button', { name: 'Reload the page' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Trust the kernel.')
})

test('CSC 173 landing page opens the standalone exam at its existing URL', async ({ page }) => {
  await page.goto('/csc173/')
  await page.getByRole('link', { name: /Final Exam Practice/ }).click()
  await expect(page).toHaveURL('/csc173_final_practice.html')
  await page.getByRole('button', { name: 'Start attempt' }).click()
  await expect(page.getByRole('button', { name: 'Finish attempt' })).toBeVisible()
})

for (const width of [320, 390, 768, 1440]) {
  test(`portfolio, course, and midterm routes fit a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    const routes = [
      ['/', "Hi! I'm Spencer"], ['/hiring', 'recent projects.'], ['/teacher', 'rebuilt to study from.'], ['/student', 'field guide.'],
      ['/student/csc138/chapter3', 'The Transport Layer'], ['/student/csc138/chapter4', 'The Network Layer: Data Plane'],
      ['/student/csc138/chapter5', 'The Network Layer: Control Plane'], ['/student/csc138/practice/chapter5', 'Learn by computing routes.'],
      ['/student/csc138/reference/chapter5', 'source notes.'], ['/student/csc138/midterm', 'Practice the whole path.'],
      ['/student/csc139/dashboard', 'Trust the kernel.'], ['/student/csc139/practice/chapter2', 'Think like the kernel.'],
    ]
    for (const [path, title] of routes) await test.step(path, async () => {
      await page.goto(`/#${path}`)
      await expect(page.getByRole('heading', { level: 1 })).toContainText(title)
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
    })
  })
}
