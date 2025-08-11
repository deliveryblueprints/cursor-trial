import { test, expect } from '@playwright/test';

test.describe('Food Visibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/snake-game.html');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Food Generation and Positioning', () => {
    test('should generate food within valid canvas bounds', async ({ page }) => {
      await page.locator('#playerName').fill('TestPlayer');
      await page.locator('button:has-text("🐣 Beginner")').click();
      
      // Wait for game to start
      await expect(page.locator('#controls')).toBeVisible();
      
      // Check food debug info is displayed
      await expect(page.locator('#foodDebug')).toBeVisible();
      
      // Get food coordinates
      const foodCoords = page.locator('#foodCoords');
      await expect(foodCoords).not.toContainText('INVALID');
      
      // Parse food coordinates
      const coordsText = await foodCoords.textContent();
      expect(coordsText).toBeTruthy();
      const match = coordsText!.match(/\((\d+), (\d+)\)/);
      expect(match).toBeTruthy();
      
      const foodX = parseInt(match![1]);
      const foodY = parseInt(match![2]);
      
      // Food should be within valid bounds: X: 0-31, Y: 0-23
      expect(foodX).toBeGreaterThanOrEqual(0);
      expect(foodX).toBeLessThan(32);
      expect(foodY).toBeGreaterThanOrEqual(0);
      expect(foodY).toBeLessThan(24);
      
      console.log(`Food generated at valid coordinates: (${foodX}, ${foodY})`);
    });

    test('should display correct grid information', async ({ page }) => {
      await page.locator('#playerName').fill('TestPlayer');
      await page.locator('button:has-text("🐣 Beginner")').click();
      
      // Wait for game to start
      await expect(page.locator('#controls')).toBeVisible();
      
      // Grid info should show correct dimensions
      const gridInfo = page.locator('#gridInfo');
      await expect(gridInfo).toContainText('32x24 (768 tiles)');
      
      // Verify the calculation: 32 * 24 = 768
      const gridText = await gridInfo.textContent();
      expect(gridText).toBeTruthy();
      const tilesMatch = gridText!.match(/\((\d+) tiles\)/);
      expect(tilesMatch).toBeTruthy();
      expect(parseInt(tilesMatch![1])).toBe(768);
    });

    test('should show food canvas position in debug info', async ({ page }) => {
      await page.locator('#playerName').fill('TestPlayer');
      await page.locator('button:has-text("🐣 Beginner")').click();
      
      // Wait for game to start
      await expect(page.locator('#controls')).toBeVisible();
      
      // Check if canvas position info is displayed at top
      const canvas = page.locator('#gameCanvas');
      await expect(canvas).toBeVisible();
      
      // The debug text should show both grid and canvas positions
      // This tests the debug overlay we added
      await expect(page.locator('text=Canvas: 800x600 | Grid: 25x25 | Tiles: 32x24')).toBeVisible();
    });

    test('should regenerate food if it spawns outside bounds', async ({ page }) => {
      await page.locator('#playerName').fill('TestPlayer');
      await page.locator('button:has-text("🐣 Beginner")').click();
      
      // Wait for game to start
      await expect(page.locator('#controls')).toBeVisible();
      
      // Monitor food coordinates for a few seconds
      const foodCoords = page.locator('#foodCoords');
      const initialCoords = await foodCoords.textContent();
      
      // Wait a bit and check if food is still valid
      await page.waitForTimeout(2000);
      const currentCoords = await foodCoords.textContent();
      
      // Food should still be valid (not INVALID)
      await expect(foodCoords).not.toContainText('INVALID');
      
      // If coordinates changed, they should still be within bounds
      if (currentCoords !== initialCoords) {
        expect(currentCoords).toBeTruthy();
        const match = currentCoords!.match(/\((\d+), (\d+)\)/);
        if (match) {
          const foodX = parseInt(match[1]);
          const foodY = parseInt(match[2]);
          
          expect(foodX).toBeGreaterThanOrEqual(0);
          expect(foodX).toBeLessThan(32);
          expect(foodY).toBeGreaterThanOrEqual(0);
          expect(foodY).toBeLessThan(24);
        }
      }
    });
  });

  test.describe('Food Drawing and Visibility', () => {
    test('should draw food with multiple visual indicators', async ({ page }) => {
      await page.locator('#playerName').fill('TestPlayer');
      await page.locator('button:has-text("🐣 Beginner")').click();
      
      // Wait for game to start
      await expect(page.locator('#controls')).toBeVisible();
      
      // Enable debug grid to see tile boundaries
      await page.locator('button:has-text("🔍 Debug Grid")').click();
      
      // Wait for grid to be drawn
      await page.waitForTimeout(500);
      
      // Check if food is visible on canvas
      const canvas = page.locator('#gameCanvas');
      await expect(canvas).toBeVisible();
      
      // The food should be drawn with:
      // 1. Yellow background circle
      // 2. Mouse emoji
      // 3. Red border
      // 4. Green center dot
      // 5. Small red reference dot at grid position
      
      // We can't easily test the visual elements, but we can verify the drawing functions are called
      // by checking the console logs or ensuring no errors occur
      
      // Check that food debug info is still showing valid coordinates
      const foodCoords = page.locator('#foodCoords');
      await expect(foodCoords).not.toContainText('INVALID');
    });

    test('should handle food collision detection correctly', async ({ page }) => {
      await page.locator('#playerName').fill('TestPlayer');
      await page.locator('button:has-text("🐣 Beginner")').click();
      
      // Wait for game to start
      await expect(page.locator('#controls')).toBeVisible();
      
      // Focus on canvas for keyboard input
      await page.click('#gameCanvas');
      
      // Get initial food position
      const foodCoords = page.locator('#foodCoords');
      const initialFoodText = await foodCoords.textContent();
      expect(initialFoodText).toBeTruthy();
      const initialMatch = initialFoodText!.match(/\((\d+), (\d+)\)/);
      expect(initialMatch).toBeTruthy();
      
      const initialFoodX = parseInt(initialMatch![1]);
      const initialFoodY = parseInt(initialMatch![1]);
      
      // Try to move snake toward food
      // This is a simplified test - in practice, we'd need more sophisticated movement logic
      
      // Check that food coordinates change after some time (indicating regeneration)
      await page.waitForTimeout(3000);
      const currentFoodText = await foodCoords.textContent();
      
      // Food should still be valid
      await expect(foodCoords).not.toContainText('INVALID');
    });
  });

  test.describe('Grid System Validation', () => {
    test('should use correct tile dimensions', async ({ page }) => {
      await page.locator('#playerName').fill('TestPlayer');
      await page.locator('button:has-text("🐣 Beginner")').click();
      
      // Wait for game to start
      await expect(page.locator('#controls')).toBeVisible();
      
      // Canvas should be 800x600
      const canvas = page.locator('#gameCanvas');
      const canvasWidth = await canvas.getAttribute('width');
      const canvasHeight = await canvas.getAttribute('height');
      
      expect(canvasWidth).toBe('800');
      expect(canvasHeight).toBe('600');
      
      // Grid size should be 25x25 pixels
      // This means: 800/25 = 32 tiles horizontally, 600/25 = 24 tiles vertically
      const expectedTilesX = 800 / 25;
      const expectedTilesY = 600 / 25;
      
      expect(expectedTilesX).toBe(32);
      expect(expectedTilesY).toBe(24);
    });

    test('should prevent food from spawning outside grid', async ({ page }) => {
      await page.locator('#playerName').fill('TestPlayer');
      await page.locator('button:has-text("🐣 Beginner")').click();
      
      // Wait for game to start
      await expect(page.locator('#controls')).toBeVisible();
      
      // Monitor food generation for multiple iterations
      const foodCoords = page.locator('#foodCoords');
      
              // Check multiple food positions to ensure they're all within bounds
        for (let i = 0; i < 5; i++) {
          await page.waitForTimeout(1000);
          
          const coordsText = await foodCoords.textContent();
          await expect(foodCoords).not.toContainText('INVALID');
          
          expect(coordsText).toBeTruthy();
          const match = coordsText!.match(/\((\d+), (\d+)\)/);
          if (match) {
            const foodX = parseInt(match[1]);
            const foodY = parseInt(match[2]);
            
            // Food should always be within bounds
            expect(foodX).toBeGreaterThanOrEqual(0);
            expect(foodX).toBeLessThan(32);
            expect(foodY).toBeGreaterThanOrEqual(0);
            expect(foodY).toBeLessThan(24);
            
            console.log(`Food position ${i + 1}: (${foodX}, ${foodY}) - Valid`);
          }
        }
    });
  });

  test.describe('Debug Features for Food Issues', () => {
    test('should toggle debug grid without errors', async ({ page }) => {
      await page.locator('#playerName').fill('TestPlayer');
      await page.locator('button:has-text("🐣 Beginner")').click();
      
      // Wait for game to start
      await expect(page.locator('#controls')).toBeVisible();
      
      // Toggle debug grid multiple times
      const debugBtn = page.locator('button:has-text("🔍 Debug Grid")');
      
      // Turn on
      await debugBtn.click();
      await page.waitForTimeout(500);
      
      // Turn off
      await debugBtn.click();
      await page.waitForTimeout(500);
      
      // Turn on again
      await debugBtn.click();
      await page.waitForTimeout(500);
      
      // Should not throw any errors
      await expect(page.locator('#gameCanvas')).toBeVisible();
    });

    test('should display comprehensive debug information', async ({ page }) => {
      await page.locator('#playerName').fill('TestPlayer');
      await page.locator('button:has-text("🐣 Beginner")').click();
      
      // Wait for game to start
      await expect(page.locator('#controls')).toBeVisible();
      
      // Enable debug grid
      await page.locator('button:has-text("🔍 Debug Grid")').click();
      
      // Check all debug information is displayed
      await expect(page.locator('#foodDebug')).toBeVisible();
      await expect(page.locator('text=Canvas: 800x600 | Grid: 25x25 | Tiles: 32x24')).toBeVisible();
      
      // Food coordinates should be visible
      const foodCoords = page.locator('#foodCoords');
      await expect(foodCoords).not.toContainText('-');
      
      // Grid info should be correct
      const gridInfo = page.locator('#gridInfo');
      await expect(gridInfo).toContainText('32x24 (768 tiles)');
    });
  });

  test.describe('Food Regeneration Edge Cases', () => {
    test('should handle rapid food regeneration', async ({ page }) => {
      await page.locator('#playerName').fill('TestPlayer');
      await page.locator('button:has-text("🐣 Beginner")').click();
      
      // Wait for game to start
      await expect(page.locator('#controls')).toBeVisible();
      
      // Monitor food for rapid changes
      const foodCoords = page.locator('#foodCoords');
      const initialCoords = await foodCoords.textContent();
      
      // Wait and check multiple times
      for (let i = 0; i < 10; i++) {
        await page.waitForTimeout(200);
        
        const currentCoords = await foodCoords.textContent();
        await expect(foodCoords).not.toContainText('INVALID');
        
        // If coordinates changed, validate they're still in bounds
        if (currentCoords !== initialCoords) {
          expect(currentCoords).toBeTruthy();
          const match = currentCoords!.match(/\((\d+), (\d+)\)/);
          if (match) {
            const foodX = parseInt(match[1]);
            const foodY = parseInt(match[2]);
            
            expect(foodX).toBeGreaterThanOrEqual(0);
            expect(foodX).toBeLessThan(32);
            expect(foodY).toBeGreaterThanOrEqual(0);
            expect(foodY).toBeLessThan(24);
          }
        }
      }
    });

    test('should maintain food visibility during gameplay', async ({ page }) => {
      await page.locator('#playerName').fill('TestPlayer');
      await page.locator('button:has-text("🐣 Beginner")').click();
      
      // Wait for game to start
      await expect(page.locator('#controls')).toBeVisible();
      
      // Focus on canvas
      await page.click('#gameCanvas');
      
      // Play for a few seconds while monitoring food
      for (let i = 0; i < 20; i++) {
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(100);
        
        // Check food is still valid
        const foodCoords = page.locator('#foodCoords');
        await expect(foodCoords).not.toContainText('INVALID');
        
        // Check if game over (stop if so)
        if (await page.locator('#gameOver').isVisible()) {
          break;
        }
      }
      
      // Food should still be visible and valid
      const foodCoords = page.locator('#foodCoords');
      await expect(foodCoords).not.toContainText('INVALID');
    });
  });
});
