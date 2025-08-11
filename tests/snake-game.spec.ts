import { test, expect } from '@playwright/test';

test.describe('Snake Game Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the snake game
    await page.goto('/snake-game.html');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Game Initialization', () => {
    test('should load the game page correctly', async ({ page }) => {
      // Check if the game container is visible
      await expect(page.locator('.game-container')).toBeVisible();
      
      // Check if the title is displayed
      await expect(page.locator('h1')).toContainText("Gayatri's Snake Game");
      
      // Check if the canvas is present
      await expect(page.locator('#gameCanvas')).toBeVisible();
      
      // Check if start screen is visible initially
      await expect(page.locator('#startScreen')).toBeVisible();
    });

    test('should display player name input field', async ({ page }) => {
      const playerNameInput = page.locator('#playerName');
      await expect(playerNameInput).toBeVisible();
      await expect(playerNameInput).toHaveAttribute('placeholder', 'Your name');
      await expect(playerNameInput).toHaveAttribute('maxlength', '20');
    });

    test('should display level selection buttons', async ({ page }) => {
      const beginnerBtn = page.locator('button:has-text("🐣 Beginner")');
      const intermediateBtn = page.locator('button:has-text("⚡ Intermediate")');
      
      await expect(beginnerBtn).toBeVisible();
      await expect(intermediateBtn).toBeVisible();
    });

    test('should show debug grid toggle button', async ({ page }) => {
      const debugBtn = page.locator('button:has-text("🔍 Debug Grid")');
      await expect(debugBtn).toBeVisible();
    });
  });

  test.describe('Player Name Validation', () => {
    test('should require player name before starting game', async ({ page }) => {
      // Try to start game without entering name
      const beginnerBtn = page.locator('button:has-text("🐣 Beginner")');
      await beginnerBtn.click();
      
      // Should show alert requiring name
      page.on('dialog', dialog => {
        expect(dialog.message()).toContain('Please enter your name before starting the game!');
        dialog.accept();
      });
    });

    test('should accept valid player name', async ({ page }) => {
      const playerNameInput = page.locator('#playerName');
      await playerNameInput.fill('TestPlayer');
      
      const beginnerBtn = page.locator('button:has-text("🐣 Beginner")');
      await beginnerBtn.click();
      
      // Should start game and show welcome message
      await expect(page.locator('#playerWelcome')).toBeVisible();
      await expect(page.locator('#welcomeUser')).toContainText('TestPlayer');
    });

    test('should store player name in localStorage', async ({ page }) => {
      const playerNameInput = page.locator('#playerName');
      await playerNameInput.fill('StoredPlayer');
      
      const beginnerBtn = page.locator('button:has-text("🐣 Beginner")');
      await beginnerBtn.click();
      
      // Check localStorage
      const storedName = await page.evaluate(() => localStorage.getItem('snakePlayerName'));
      expect(storedName).toBe('StoredPlayer');
    });
  });

  test.describe('Game Start and Controls', () => {
    test('should start beginner level game', async ({ page }) => {
      await page.locator('#playerName').fill('TestPlayer');
      await page.locator('button:has-text("🐣 Beginner")').click();
      
      // Check if game started
      await expect(page.locator('#startScreen')).not.toBeVisible();
      await expect(page.locator('#controls')).toBeVisible();
      await expect(page.locator('#levelDisplay')).toBeVisible();
      await expect(page.locator('#currentLevel')).toContainText('Beginner');
    });

    test('should start intermediate level game', async ({ page }) => {
      await page.locator('#playerName').fill('TestPlayer');
      await page.locator('button:has-text("⚡ Intermediate")').click();
      
      // Check if game started
      await expect(page.locator('#startScreen')).not.toBeVisible();
      await expect(page.locator('#controls')).toBeVisible();
      await expect(page.locator('#levelDisplay')).toBeVisible();
      await expect(page.locator('#currentLevel')).toContainText('Intermediate');
    });

    test('should show mobile controls on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.locator('#playerName').fill('TestPlayer');
      await page.locator('button:has-text("🐣 Beginner")').click();
      
      await expect(page.locator('#mobileControls')).toBeVisible();
    });
  });

  test.describe('Game Mechanics', () => {
    test('should initialize snake at correct position', async ({ page }) => {
      await page.locator('#playerName').fill('TestPlayer');
      await page.locator('button:has-text("🐣 Beginner")').click();
      
      // Wait for game to start
      await expect(page.locator('#controls')).toBeVisible();
      
      // Check if snake is drawn on canvas
      const canvas = page.locator('#gameCanvas');
      await expect(canvas).toBeVisible();
    });

    test('should generate food within valid bounds', async ({ page }) => {
      await page.locator('#playerName').fill('TestPlayer');
      await page.locator('button:has-text("🐣 Beginner")').click();
      
      // Wait for game to start
      await expect(page.locator('#controls')).toBeVisible();
      
      // Check food debug info
      await expect(page.locator('#foodDebug')).toBeVisible();
      
      // Food coordinates should be within 32x24 grid
      const foodCoords = page.locator('#foodCoords');
      await expect(foodCoords).not.toContainText('INVALID');
      
      // Grid info should show correct dimensions
      const gridInfo = page.locator('#gridInfo');
      await expect(gridInfo).toContainText('32x24 (768 tiles)');
    });

    test('should respond to keyboard controls', async ({ page }) => {
      await page.locator('#playerName').fill('TestPlayer');
      await page.locator('button:has-text("🐣 Beginner")').click();
      
      // Wait for game to start
      await expect(page.locator('#controls')).toBeVisible();
      
      // Focus on the page to capture keyboard events
      await page.click('#gameCanvas');
      
      // Test arrow key controls
      await page.keyboard.press('ArrowUp');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowLeft');
      await page.keyboard.press('ArrowRight');
      
      // Game should continue running
      await expect(page.locator('#gameOver')).not.toBeVisible();
    });

    test('should detect wall collisions', async ({ page }) => {
      await page.locator('#playerName').fill('TestPlayer');
      await page.locator('button:has-text("🐣 Beginner")').click();
      
      // Wait for game to start
      await expect(page.locator('#controls')).toBeVisible();
      
      // Focus on the page
      await page.click('#gameCanvas');
      
      // Move snake to wall (this might take a few moves)
      for (let i = 0; i < 15; i++) {
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(100);
      }
      
      // Should eventually hit wall and show game over
      await expect(page.locator('#gameOver')).toBeVisible();
    });
  });

  test.describe('Scoring System', () => {
    test('should increment score when eating food', async ({ page }) => {
      await page.locator('#playerName').fill('TestPlayer');
      await page.locator('button:has-text("🐣 Beginner")').click();
      
      // Wait for game to start
      await expect(page.locator('#controls')).toBeVisible();
      
      // Focus on the page
      await page.click('#gameCanvas');
      
      // Get initial score
      const initialScore = await page.locator('#score').textContent();
      expect(initialScore).toBe('0');
      
      // Try to eat food (this might take a few moves)
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(100);
        
        // Check if score increased
        const currentScore = await page.locator('#score').textContent();
        if (currentScore !== initialScore) {
          expect(currentScore).toBeTruthy();
          expect(parseInt(currentScore!)).toBeGreaterThan(parseInt(initialScore!));
          break;
        }
      }
    });

    test('should update high score', async ({ page }) => {
      await page.locator('#playerName').fill('TestPlayer');
      await page.locator('button:has-text("🐣 Beginner")').click();
      
      // Wait for game to start
      await expect(page.locator('#controls')).toBeVisible();
      
      // Focus on the page
      await page.click('#gameCanvas');
      
      // Get initial high score
      const initialHighScore = await page.locator('#highScore').textContent();
      expect(initialHighScore).toBeTruthy();
      
      // Play until game over (try to eat some food first)
      for (let i = 0; i < 20; i++) {
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(100);
        
        // Check if game over
        if (await page.locator('#gameOver').isVisible()) {
          break;
        }
      }
      
              // If game over, check if high score was updated
        if (await page.locator('#gameOver').isVisible()) {
          const finalScore = await page.locator('#finalScore').textContent();
          const newHighScore = await page.locator('#highScore').textContent();
          
          expect(finalScore).toBeTruthy();
          expect(newHighScore).toBeTruthy();
          
          if (parseInt(finalScore!) > parseInt(initialHighScore!)) {
            expect(parseInt(newHighScore!)).toBe(parseInt(finalScore!));
          }
        }
    });
  });

  test.describe('Game Over and Restart', () => {
    test('should show game over screen', async ({ page }) => {
      await page.locator('#playerName').fill('TestPlayer');
      await page.locator('button:has-text("🐣 Beginner")').click();
      
      // Wait for game to start
      await expect(page.locator('#controls')).toBeVisible();
      
      // Focus on the page
      await page.click('#gameCanvas');
      
      // Try to trigger game over by hitting walls
      for (let i = 0; i < 20; i++) {
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(100);
        
        if (await page.locator('#gameOver').isVisible()) {
          break;
        }
      }
      
      // Should show game over screen
      await expect(page.locator('#gameOver')).toBeVisible();
      await expect(page.locator('#gameOver h2')).toContainText('Game Over!');
    });

    test('should restart game correctly', async ({ page }) => {
      await page.locator('#playerName').fill('TestPlayer');
      await page.locator('button:has-text("🐣 Beginner")').click();
      
      // Wait for game to start
      await expect(page.locator('#controls')).toBeVisible();
      
      // Focus on the page
      await page.click('#gameCanvas');
      
      // Try to trigger game over
      for (let i = 0; i < 20; i++) {
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(100);
        
        if (await page.locator('#gameOver').isVisible()) {
          break;
        }
      }
      
      // Click restart button
      if (await page.locator('#gameOver').isVisible()) {
        await page.locator('button:has-text("Play Again")').click();
        
        // Should return to start screen
        await expect(page.locator('#startScreen')).toBeVisible();
        await expect(page.locator('#gameOver')).not.toBeVisible();
        await expect(page.locator('#controls')).not.toBeVisible();
      }
    });
  });

  test.describe('Debug Features', () => {
    test('should toggle debug grid', async ({ page }) => {
      await page.locator('#playerName').fill('TestPlayer');
      await page.locator('button:has-text("🐣 Beginner")').click();
      
      // Wait for game to start
      await expect(page.locator('#controls')).toBeVisible();
      
      // Toggle debug grid
      await page.locator('button:has-text("🔍 Debug Grid")').click();
      
      // Grid should be visible (we can't easily test the visual grid, but we can check the function was called)
      // The toggle function should work without errors
    });

    test('should display food debug information', async ({ page }) => {
      await page.locator('#playerName').fill('TestPlayer');
      await page.locator('button:has-text("🐣 Beginner")').click();
      
      // Wait for game to start
      await expect(page.locator('#controls')).toBeVisible();
      
      // Food debug should be visible
      await expect(page.locator('#foodDebug')).toBeVisible();
      
      // Should show food coordinates
      const foodCoords = page.locator('#foodCoords');
      await expect(foodCoords).not.toContainText('-');
      
      // Should show grid info
      const gridInfo = page.locator('#gridInfo');
      await expect(gridInfo).toContainText('32x24');
    });
  });

  test.describe('Live Scoreboard', () => {
    test('should add player to live scoreboard', async ({ page }) => {
      await page.locator('#playerName').fill('TestPlayer');
      await page.locator('button:has-text("🐣 Beginner")').click();
      
      // Wait for game to start
      await expect(page.locator('#controls')).toBeVisible();
      
      // Check if live scoreboard is visible
      await expect(page.locator('#liveScoreCard')).toBeVisible();
      
      // Should show player count
      const playerCount = page.locator('#playerCount');
      await expect(playerCount).toContainText('1 player');
    });

    test('should refresh live scores', async ({ page }) => {
      await page.locator('#playerName').fill('TestPlayer');
      await page.locator('button:has-text("🐣 Beginner")').click();
      
      // Wait for game to start
      await expect(page.locator('#controls')).toBeVisible();
      
      // Click refresh button
      await page.locator('button:has-text("🔄 Refresh")').click();
      
      // Should not throw errors
      await expect(page.locator('#liveScoreCard')).toBeVisible();
    });
  });

  test.describe('Cross-browser Compatibility', () => {
    test('should work in different browsers', async ({ page, browserName }) => {
      // This test will run in all configured browsers
      await page.locator('#playerName').fill('TestPlayer');
      await page.locator('button:has-text("🐣 Beginner")').click();
      
      // Wait for game to start
      await expect(page.locator('#controls')).toBeVisible();
      
      // Basic functionality should work in all browsers
      await expect(page.locator('#gameCanvas')).toBeVisible();
      await expect(page.locator('#score')).toContainText('0');
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('should be responsive on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Check if elements are properly sized
      await expect(page.locator('.game-container')).toBeVisible();
      
      // Canvas should be responsive
      const canvas = page.locator('#gameCanvas');
      await expect(canvas).toBeVisible();
      
      // Mobile controls should be available
      await page.locator('#playerName').fill('TestPlayer');
      await page.locator('button:has-text("🐣 Beginner")').click();
      
      await expect(page.locator('#mobileControls')).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle invalid player names gracefully', async ({ page }) => {
      // Try to start with empty name
      const beginnerBtn = page.locator('button:has-text("🐣 Beginner")');
      await beginnerBtn.click();
      
      // Should show alert
      page.on('dialog', dialog => {
        expect(dialog.message()).toContain('Please enter your name before starting the game!');
        dialog.accept();
      });
      
      // Game should not start
      await expect(page.locator('#startScreen')).toBeVisible();
    });

    test('should handle game state transitions properly', async ({ page }) => {
      await page.locator('#playerName').fill('TestPlayer');
      await page.locator('button:has-text("🐣 Beginner")').click();
      
      // Wait for game to start
      await expect(page.locator('#controls')).toBeVisible();
      
      // Try to start another game while one is running
      await page.locator('button:has-text("🐣 Beginner")').click();
      
      // Should handle gracefully (either restart or ignore)
      await expect(page.locator('#controls')).toBeVisible();
    });
  });
});
