from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    # Navigate to the app
    page.goto('http://localhost:3001/')
    page.wait_for_load_state('networkidle')

    # Take a screenshot of the home page
    page.screenshot(path='/tmp/home.png', full_page=True)
    print("✓ Home page screenshot saved")

    # Click on "开始学习" (Start Learning) for characters
    page.click('a:has-text("开始学习"):first-of-type')
    page.wait_for_load_state('networkidle')

    # Take a screenshot of the study page
    page.screenshot(path='/tmp/study.png', full_page=True)
    print("✓ Study page screenshot saved")

    # Find and click on the word card to flip it
    card = page.locator('.card-flip-container').first
    card.click()

    # Wait a bit for the flip animation
    time.sleep(1)

    # Take a screenshot of the flipped card
    page.screenshot(path='/tmp/flipped_card.png', full_page=True)
    print("✓ Flipped card screenshot saved")

    # Check if card back content is visible
    card_back = page.locator('.card-back')
    is_visible = card_back.is_visible()

    # Try to find specific elements on the back
    pinyin_box = page.locator('.card-back >> text=📖 拼音')
    meaning_box = page.locator('.card-back >> text=📝 意思')

    pinyin_visible = pinyin_box.is_visible() if pinyin_box.count() > 0 else False
    meaning_visible = meaning_box.is_visible() if meaning_box.count() > 0 else False

    print(f"\n=== Card Flip Test Results ===")
    print(f"Card back container visible: {is_visible}")
    print(f"Pinyin section visible: {pinyin_visible}")
    print(f"Meaning section visible: {meaning_visible}")

    if is_visible:
        print("\n✓ SUCCESS: Card flip is working correctly!")
        print("  Trd back information is displaying after flip.")
    else:
        print("\n✗ ISSUE: Card back not visible after flip")
        print("  Need to debug CSS positioning further.")

    browser.close()
