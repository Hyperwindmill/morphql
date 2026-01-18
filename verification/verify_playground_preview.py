from playwright.sync_api import sync_playwright
import os

def verify_playground():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:4173")
            page.wait_for_selector("text=Query Morph Playground")
            page.wait_for_selector("select")
            page.select_option("select", "Simple Math (JSON to JSON)")
            page.wait_for_timeout(1000)

            # Ensure absolute path
            path = os.path.abspath("verification/playground.png")
            page.screenshot(path=path)
            print(f"Screenshot taken at {path}")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_playground()
