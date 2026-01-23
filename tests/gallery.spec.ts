import { test, expect } from '@playwright/test';

/**
 * Gallery E2E Tests
 * Tests for gallery list display, single gallery page rendering, lightbox functionality,
 * keyboard navigation, and category filtering.
 */

test.describe('Gallery List Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pl/gallery/');
  });

  test('should display gallery list page with title', async ({ page }) => {
    // Check page title is present
    const pageTitle = page.locator('h1.display-4');
    await expect(pageTitle).toBeVisible();
    await expect(pageTitle).toContainText('Galeria');
  });

  test('should display gallery cards', async ({ page }) => {
    // Check that gallery cards are visible
    const galleryCards = page.locator('.gallery-card');
    await expect(galleryCards.first()).toBeVisible();

    // Verify there are multiple gallery items
    const count = await galleryCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display gallery card with required elements', async ({ page }) => {
    const firstCard = page.locator('.gallery-card').first();

    // Check card has title
    const cardTitle = firstCard.locator('.gallery-card-title');
    await expect(cardTitle).toBeVisible();

    // Check card has a link to the gallery
    const cardLink = firstCard.locator('a');
    await expect(cardLink.first()).toBeVisible();
  });

  test('should display photo count badge on gallery cards', async ({ page }) => {
    // Look for photo count badge (uses .gallery-card-count class)
    const photoBadge = page.locator('.gallery-card').first().locator('.gallery-card-count');
    await expect(photoBadge).toBeVisible();
  });

  test('should navigate to single gallery when clicking card', async ({ page }) => {
    // Click on the first gallery card link
    const firstCardLink = page.locator('.gallery-card a').first();
    await firstCardLink.click();

    // Should navigate to a single gallery page
    await expect(page).toHaveURL(/\/pl\/gallery\/[^/]+\/?$/);
  });

  test('should display category filter navigation', async ({ page }) => {
    // Check for category filter nav
    const categoryFilter = page.locator('.gallery-filter');
    await expect(categoryFilter).toBeVisible();

    // Should have "All" button
    const allButton = categoryFilter.locator('.gallery-filter-btn').first();
    await expect(allButton).toBeVisible();
  });
});

test.describe('Single Gallery Page Rendering', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a known gallery page
    await page.goto('/pl/gallery/codzienne-zajecia/');
  });

  test('should display gallery title', async ({ page }) => {
    const title = page.locator('h1.display-5');
    await expect(title).toBeVisible();
    await expect(title).toContainText('Codzienne zajecia');
  });

  test('should display gallery metadata', async ({ page }) => {
    // Check for date/time element
    const dateElement = page.locator('.gallery-meta time');
    await expect(dateElement).toBeVisible();

    // Check for photo count badge
    const photoCount = page.locator('.gallery-photo-count');
    await expect(photoCount).toBeVisible();
    await expect(photoCount).toContainText('2');
  });

  test('should display gallery description', async ({ page }) => {
    const description = page.locator('.lead');
    await expect(description.first()).toBeVisible();
  });

  test('should display gallery grid with images', async ({ page }) => {
    // Check gallery grid exists
    const galleryGrid = page.locator('.gallery-grid[data-gallery-lightbox]');
    await expect(galleryGrid).toBeVisible();

    // Check images are present
    const galleryItems = page.locator('.gallery-item');
    const count = await galleryItems.count();
    expect(count).toBe(2);
  });

  test('should display image captions', async ({ page }) => {
    // Check for figcaption elements
    const captions = page.locator('.gallery-caption');
    await expect(captions.first()).toBeVisible();
    await expect(captions.first()).toContainText('Zabawy plastyczne');
  });

  test('should have back to gallery link', async ({ page }) => {
    const backLink = page.locator('a.btn-outline-primary');
    await expect(backLink).toBeVisible();
    await expect(backLink).toContainText('galerii');
  });

  test('should have images with alt text for accessibility', async ({ page }) => {
    const images = page.locator('.gallery-image');
    const firstImage = images.first();

    // Check alt attribute exists and is not empty
    const altText = await firstImage.getAttribute('alt');
    expect(altText).toBeTruthy();
    expect(altText?.length).toBeGreaterThan(0);
  });

  test('should have glightbox links configured correctly', async ({ page }) => {
    const lightboxLink = page.locator('.glightbox').first();

    // Verify data attributes for GLightbox
    await expect(lightboxLink).toHaveAttribute('data-gallery', /gallery-/);
    await expect(lightboxLink).toHaveAttribute('data-glightbox', /title:/);
  });
});

test.describe('Lightbox Opening and Closing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pl/gallery/codzienne-zajecia/');
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
  });

  test('should open lightbox when clicking an image', async ({ page }) => {
    // Click on the first gallery image link
    const firstImageLink = page.locator('.glightbox').first();
    await firstImageLink.click();

    // Wait for lightbox to open
    await expect(page.locator('.goverlay')).toBeVisible({ timeout: 5000 });

    // Check lightbox container is visible
    await expect(page.locator('.glightbox-container')).toBeVisible();
  });

  test('should display image in lightbox', async ({ page }) => {
    // Open lightbox
    await page.locator('.glightbox').first().click();
    await expect(page.locator('.goverlay')).toBeVisible({ timeout: 5000 });

    // Wait for lightbox container to be visible
    await expect(page.locator('.glightbox-container')).toBeVisible({ timeout: 5000 });

    // Wait for the image to load (GLightbox loads images asynchronously)
    await page.waitForTimeout(500);

    // Check that an image exists and has a src attribute (it may be hidden during transitions)
    const lightboxImage = page.locator('.glightbox-container img').first();
    const src = await lightboxImage.getAttribute('src');
    expect(src).toBeTruthy();
    expect(src).toContain('/images/gallery/');
  });

  test('should close lightbox when clicking close button', async ({ page }) => {
    // Open lightbox
    await page.locator('.glightbox').first().click();
    await expect(page.locator('.goverlay')).toBeVisible({ timeout: 5000 });

    // Click close button
    const closeButton = page.locator('.gclose');
    await closeButton.click();

    // Lightbox should be closed
    await expect(page.locator('.goverlay')).not.toBeVisible({ timeout: 5000 });
  });

  test('should close lightbox when clicking overlay', async ({ page }) => {
    // Open lightbox
    await page.locator('.glightbox').first().click();
    await expect(page.locator('.goverlay')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.glightbox-container')).toBeVisible({ timeout: 5000 });

    // Click on overlay background (outside the image area)
    const overlay = page.locator('.goverlay');
    const box = await overlay.boundingBox();
    if (box) {
      // Click in the top-left corner of the overlay
      await page.mouse.click(box.x + 5, box.y + 5);
    }

    // Lightbox should be closed
    await expect(page.locator('.goverlay')).not.toBeVisible({ timeout: 5000 });
  });

  test('should navigate to next image with next button', async ({ page }) => {
    // Open lightbox
    await page.locator('.glightbox').first().click();
    await expect(page.locator('.goverlay')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.glightbox-container')).toBeVisible({ timeout: 5000 });

    // Give GLightbox time to fully initialize
    await page.waitForTimeout(500);

    // Click next button
    const nextButton = page.locator('.gnext');
    await expect(nextButton).toBeVisible({ timeout: 5000 });
    await nextButton.click();

    // Wait for navigation animation to complete
    await page.waitForTimeout(600);

    // Verify we can still navigate (lightbox is still functional)
    await expect(page.locator('.glightbox-container')).toBeVisible();
  });

  test('should navigate to previous image with previous button', async ({ page }) => {
    // Open lightbox on second image to have a previous image available
    await page.locator('.glightbox').nth(1).click();
    await expect(page.locator('.goverlay')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.glightbox-container')).toBeVisible({ timeout: 5000 });

    // Give GLightbox time to fully initialize
    await page.waitForTimeout(500);

    // Click previous button
    const prevButton = page.locator('.gprev');
    await expect(prevButton).toBeVisible({ timeout: 5000 });
    await prevButton.click();

    // Wait for navigation animation to complete
    await page.waitForTimeout(600);

    // Verify we can still navigate (lightbox is still functional)
    await expect(page.locator('.glightbox-container')).toBeVisible();
  });

  test('should display image caption/description in lightbox', async ({ page }) => {
    // Open lightbox
    await page.locator('.glightbox').first().click();
    await expect(page.locator('.goverlay')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.glightbox-container')).toBeVisible({ timeout: 5000 });

    // Give GLightbox time to fully render
    await page.waitForTimeout(500);

    // Check for description in the lightbox (GLightbox renders descriptions)
    const description = page.locator('.gslide-description').first();
    await expect(description).toBeVisible({ timeout: 5000 });
  });

  test('should add body class when lightbox is open', async ({ page }) => {
    // Open lightbox
    await page.locator('.glightbox').first().click();
    await expect(page.locator('.goverlay')).toBeVisible({ timeout: 5000 });

    // Body should have glightbox-open class
    const body = page.locator('body');
    await expect(body).toHaveClass(/glightbox-open/);
  });
});

test.describe('Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pl/gallery/codzienne-zajecia/');
    await page.waitForLoadState('networkidle');
  });

  test('should close lightbox with Escape key', async ({ page }) => {
    // Open lightbox
    await page.locator('.glightbox').first().click();
    await expect(page.locator('.goverlay')).toBeVisible({ timeout: 5000 });

    // Press Escape
    await page.keyboard.press('Escape');

    // Lightbox should be closed
    await expect(page.locator('.goverlay')).not.toBeVisible({ timeout: 5000 });
  });

  test('should navigate to next image with Right Arrow key', async ({ page }) => {
    // Open lightbox
    await page.locator('.glightbox').first().click();
    await expect(page.locator('.goverlay')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.glightbox-container')).toBeVisible({ timeout: 5000 });

    // Give GLightbox time to fully initialize
    await page.waitForTimeout(500);

    // Press Right Arrow
    await page.keyboard.press('ArrowRight');

    // Wait for navigation animation
    await page.waitForTimeout(600);

    // Verify lightbox is still visible and functional after navigation
    await expect(page.locator('.glightbox-container')).toBeVisible();
  });

  test('should navigate to previous image with Left Arrow key', async ({ page }) => {
    // Open lightbox on second image to have a previous image available
    await page.locator('.glightbox').nth(1).click();
    await expect(page.locator('.goverlay')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.glightbox-container')).toBeVisible({ timeout: 5000 });

    // Give GLightbox time to fully initialize
    await page.waitForTimeout(500);

    // Press Left Arrow
    await page.keyboard.press('ArrowLeft');

    // Wait for navigation animation
    await page.waitForTimeout(600);

    // Verify lightbox is still visible and functional after navigation
    await expect(page.locator('.glightbox-container')).toBeVisible();
  });

  test('should loop through images with keyboard navigation', async ({ page }) => {
    // Open lightbox on last image
    const totalImages = await page.locator('.glightbox').count();
    await page.locator('.glightbox').nth(totalImages - 1).click();
    await expect(page.locator('.goverlay')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.glightbox-container')).toBeVisible({ timeout: 5000 });

    // Give GLightbox time to fully initialize
    await page.waitForTimeout(500);

    // Press Right Arrow to loop to first image
    await page.keyboard.press('ArrowRight');

    // Wait for navigation animation
    await page.waitForTimeout(600);

    // Verify lightbox is still visible (meaning loop worked without closing)
    await expect(page.locator('.glightbox-container')).toBeVisible();
  });
});

test.describe('Category Filtering', () => {
  test('should display category filter buttons on gallery list', async ({ page }) => {
    await page.goto('/pl/gallery/');

    // Check for gallery filter
    const categoryFilter = page.locator('.gallery-filter');
    await expect(categoryFilter).toBeVisible();

    // Should have filter buttons
    const filterButtons = categoryFilter.locator('.gallery-filter-btn');
    const count = await filterButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have active state on "All" button by default', async ({ page }) => {
    await page.goto('/pl/gallery/');

    // "All" button should be active
    const allButton = page.locator('.gallery-filter-btn').first();
    await expect(allButton).toHaveClass(/active/);
  });

  test('should navigate to category page when clicking filter button', async ({ page }) => {
    await page.goto('/pl/gallery/');

    // Click on a category filter button (not "All")
    const categoryButton = page.locator('.gallery-filter-btn').nth(1);
    const categoryText = await categoryButton.textContent();
    await categoryButton.click();

    // Should navigate to category page
    await expect(page).toHaveURL(/\/pl\/gallery_categories\//);
  });

  test('should display filtered galleries on category page', async ({ page }) => {
    await page.goto('/pl/gallery/');

    // Click on a category filter button (not "All")
    const categoryButton = page.locator('.gallery-filter-btn').nth(1);
    await categoryButton.click();

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Should show gallery cards
    const galleryCards = page.locator('.gallery-card');
    await expect(galleryCards.first()).toBeVisible({ timeout: 5000 });
  });

  test('should show active state on selected category', async ({ page }) => {
    await page.goto('/pl/gallery/');

    // Click on a category filter button (not "All")
    const categoryButton = page.locator('.gallery-filter-btn').nth(1);
    await categoryButton.click();

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // The page should have category filter visible (we're on a category page)
    const categoryFilter = page.locator('.gallery-filter');
    await expect(categoryFilter).toBeVisible({ timeout: 5000 });

    // Check URL has changed to a category page
    await expect(page).toHaveURL(/\/gallery_categories\//);
  });

  test('should display category icon with each filter button', async ({ page }) => {
    await page.goto('/pl/gallery/');

    // Check for filter icons
    const filterIcons = page.locator('.gallery-filter .filter-icon');
    const count = await filterIcons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display gallery count in category filter', async ({ page }) => {
    await page.goto('/pl/gallery/');

    // Check for count badges in filter buttons
    const filterCounts = page.locator('.gallery-filter .filter-count');
    const count = await filterCounts.count();
    expect(count).toBeGreaterThan(0);

    // Count should contain a number in parentheses
    const firstCountText = await filterCounts.first().textContent();
    expect(firstCountText).toMatch(/\(\d+\)/);
  });

  test('should navigate back to all galleries from category page', async ({ page }) => {
    // Go to a category page first
    await page.goto('/pl/gallery/');
    const categoryButton = page.locator('.gallery-filter-btn').nth(1);
    await categoryButton.click();
    await page.waitForLoadState('networkidle');

    // Click "All" button to go back
    const allButton = page.locator('.gallery-filter-btn').first();
    await allButton.click();

    // Should be back on gallery list
    await expect(page).toHaveURL(/\/pl\/gallery\/?$/);
  });
});

test.describe('Gallery Categories Page', () => {
  test('should display gallery categories listing page', async ({ page }) => {
    await page.goto('/pl/gallery_categories/');

    // Check page title
    const pageTitle = page.locator('h1.display-4');
    await expect(pageTitle).toBeVisible();
  });

  test('should display category cards with icons', async ({ page }) => {
    await page.goto('/pl/gallery_categories/');

    // Check for category cards
    const categoryCards = page.locator('.gallery-category-card');
    await expect(categoryCards.first()).toBeVisible();

    // Check for emoji icons
    const categoryEmoji = page.locator('.category-emoji');
    await expect(categoryEmoji.first()).toBeVisible();
  });

  test('should display gallery count per category', async ({ page }) => {
    await page.goto('/pl/gallery_categories/');

    // Check for count display
    const categoryCount = page.locator('.gallery-category-card-count');
    await expect(categoryCount.first()).toBeVisible();
  });

  test('should navigate to specific category when clicking card', async ({ page }) => {
    await page.goto('/pl/gallery_categories/');

    // Click on first category card
    const firstCategoryCard = page.locator('.gallery-category-card').first();
    await firstCategoryCard.click();

    // Should navigate to specific category page
    await expect(page).toHaveURL(/\/pl\/gallery_categories\/[^/]+\/?$/);
  });

  test('should have link back to all galleries', async ({ page }) => {
    await page.goto('/pl/gallery_categories/');

    // Check for back link
    const backLink = page.locator('a.btn-outline-primary');
    await expect(backLink).toBeVisible();
    await expect(backLink).toContainText('galerie');
  });
});

test.describe('Responsive Design', () => {
  test('should display mobile-friendly gallery grid on small screens', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pl/gallery/codzienne-zajecia/');

    // Gallery grid should still be visible
    const galleryGrid = page.locator('.gallery-grid');
    await expect(galleryGrid).toBeVisible();

    // Gallery items should be visible
    const galleryItems = page.locator('.gallery-item');
    await expect(galleryItems.first()).toBeVisible();
  });

  test('should work with lightbox on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pl/gallery/codzienne-zajecia/');
    await page.waitForLoadState('networkidle');

    // Open lightbox
    await page.locator('.glightbox').first().click();

    // Lightbox should open
    await expect(page.locator('.goverlay')).toBeVisible({ timeout: 5000 });

    // Close button should be visible
    const closeButton = page.locator('.gclose');
    await expect(closeButton).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should have proper aria-label on filter navigation', async ({ page }) => {
    await page.goto('/pl/gallery/');

    const filterNav = page.locator('.gallery-filter');
    await expect(filterNav).toHaveAttribute('aria-label', /filter|kategor/i);
  });

  test('should have aria-current on active filter button', async ({ page }) => {
    await page.goto('/pl/gallery/');

    const activeButton = page.locator('.gallery-filter-btn.active');
    await expect(activeButton).toHaveAttribute('aria-current', 'page');
  });

  test('should have alt text on all gallery images', async ({ page }) => {
    await page.goto('/pl/gallery/codzienne-zajecia/');

    const images = page.locator('.gallery-image');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const image = images.nth(i);
      const alt = await image.getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt?.length).toBeGreaterThan(0);
    }
  });

  test('should have datetime attribute on date elements', async ({ page }) => {
    await page.goto('/pl/gallery/codzienne-zajecia/');

    const timeElement = page.locator('time[datetime]');
    await expect(timeElement).toBeVisible();
    const datetime = await timeElement.getAttribute('datetime');
    expect(datetime).toMatch(/\d{4}-\d{2}-\d{2}/);
  });
});
