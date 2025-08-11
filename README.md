# Snake Game Playwright Tests

This repository contains comprehensive Playwright test cases for the Snake Game, designed to test all aspects of the game including the recent food visibility fixes.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Python 3 (for local web server)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npm run install-browsers
   ```

3. **Start the local web server:**
   ```bash
   python3 -m http.server 8000
   ```

4. **Run tests:**
   ```bash
   npm test
   ```

## 🧪 Test Structure

### Main Test Files

- **`tests/snake-game.spec.ts`** - Comprehensive tests covering all game functionality
- **`tests/food-visibility.spec.ts`** - Specialized tests for food positioning and visibility issues

### Test Categories

#### Game Initialization
- Page loading and UI elements
- Player name input validation
- Level selection buttons
- Debug features

#### Player Name Validation
- Required name before game start
- Name storage in localStorage
- Input field attributes

#### Game Start and Controls
- Beginner and intermediate level start
- Mobile controls display
- Game state transitions

#### Game Mechanics
- Snake initialization and positioning
- Food generation within bounds
- Keyboard controls responsiveness
- Collision detection

#### Food Visibility (Special Focus)
- Food coordinates validation (X: 0-31, Y: 0-23)
- Grid system validation (32x24 = 768 tiles)
- Canvas positioning (800x600 pixels)
- Debug grid overlay functionality

#### Scoring System
- Score increment on food consumption
- High score updates
- Live scoreboard integration

#### Game Over and Restart
- Game over screen display
- Restart functionality
- State reset

#### Cross-browser Compatibility
- Chrome, Firefox, Safari
- Mobile Chrome and Safari
- Responsive design testing

## 🔧 Configuration

### Playwright Config (`playwright.config.ts`)

- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Web Server**: Python HTTP server on port 8000
- **Reporting**: HTML, JSON, and JUnit reports
- **Screenshots**: On failure
- **Videos**: Retained on failure

### Test Environment

- **Base URL**: `file://` (for local HTML files)
- **Viewport**: Responsive testing with mobile breakpoints
- **Timeouts**: 120 seconds for web server startup

## 📊 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run with UI mode (interactive)
npm run test:ui

# Run in headed mode (see browser)
npm run test:headed

# Debug mode
npm run test:debug

# Show test report
npm run test:report
```

### Running Specific Tests

```bash
# Run only food visibility tests
npx playwright test food-visibility.spec.ts

# Run specific test file
npx playwright test snake-game.spec.ts

# Run tests matching a pattern
npx playwright test --grep "food visibility"

# Run tests in specific browser
npx playwright test --project=chromium
```

### Parallel Execution

```bash
# Run tests in parallel (default)
npx playwright test

# Run tests sequentially
npx playwright test --workers=1
```

## 🐛 Debugging Tests

### Debug Mode
```bash
npm run test:debug
```
This opens Playwright Inspector for step-by-step debugging.

### UI Mode
```bash
npm run test:ui
```
Interactive test runner with real-time results and debugging tools.

### Console Logs
Tests include extensive console logging for debugging:
- Food generation coordinates
- Grid calculations
- Canvas positioning
- Error conditions

## 📱 Mobile Testing

### Mobile Viewports
- **Pixel 5**: 393x851
- **iPhone 12**: 390x844

### Mobile-specific Tests
- Touch controls
- Responsive layout
- Mobile control buttons
- Viewport scaling

## 🔍 Food Visibility Testing

### What We Test
1. **Coordinate Validation**: Food never spawns outside 32x24 grid
2. **Canvas Positioning**: Food is drawn within 800x600 canvas bounds
3. **Grid System**: Correct tile dimensions (25x25 pixels)
4. **Debug Features**: Visual grid overlay and coordinate display
5. **Regeneration**: Food respawns correctly after eating

### Key Assertions
```typescript
// Food coordinates must be within bounds
expect(foodX).toBeGreaterThanOrEqual(0);
expect(foodX).toBeLessThan(32);
expect(foodY).toBeGreaterThanOrEqual(0);
expect(foodY).toBeLessThan(24);

// Grid must show correct dimensions
expect(gridInfo).toContainText('32x24 (768 tiles)');
```

## 📈 Test Reports

### HTML Report
```bash
npm run test:report
```
Opens detailed HTML report with:
- Test results and failures
- Screenshots on failure
- Video recordings
- Performance metrics

### JSON Report
```bash
# Results saved to test-results/results.json
```

### JUnit Report
```bash
# Results saved to test-results/results.xml
```

## 🚨 Common Issues

### Web Server Not Starting
```bash
# Check if port 8000 is available
lsof -i :8000

# Use different port
python3 -m http.server 8001
# Update playwright.config.ts accordingly
```

### Browser Installation Issues
```bash
# Reinstall browsers
npx playwright install

# Install specific browser
npx playwright install chromium
```

### Test Failures
1. **Check web server**: Ensure it's running on correct port
2. **Browser compatibility**: Some tests may fail in certain browsers
3. **Timing issues**: Increase timeouts for slower systems
4. **Viewport issues**: Ensure responsive design works correctly

## 🔄 Continuous Integration

### GitHub Actions Example
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Test API](https://playwright.dev/docs/api/class-test)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

## 🤝 Contributing

When adding new tests:
1. Follow existing test structure
2. Add appropriate assertions
3. Include console logging for debugging
4. Test across multiple browsers
5. Update this README if needed

## 📄 License

This testing suite is part of the Snake Game project and follows the same license terms.
