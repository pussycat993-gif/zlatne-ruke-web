import { test, expect } from "@playwright/test";
import { ROLES } from "./roles";

// ── PRIORITET 3: Happy-path smoke (jedan po ulozi) ──

test.describe("P3 · Kupac", () => {
  test.use({ storageState: ROLES.buyer.storage });

  test("katalog → kategorija → proizvod → upit", async ({ page }) => {
    await page.goto("/");
    // Otvori kategoriju sa naslovne (grid „Pretraži po vrsti").
    await page.getByTestId("category-card").first().click();
    await expect(page).toHaveURL(/\/katalog/);

    // Otvori prvi proizvod.
    const card = page.getByTestId("product-card").first();
    await expect(card).toBeVisible();
    await card.click();
    await expect(page).toHaveURL(/\/proizvod\//);

    // Kontakt/upit akcija je dostupna (v1: bez korpe).
    await expect(
      page.getByRole("button", { name: /pošalji upit/i }),
    ).toBeVisible();
  });
});

test.describe("P3 · Prodavac", () => {
  test.use({ storageState: ROLES.sellerA.storage });

  test("dodaj proizvod → vidi na listi → otvori izmenu", async ({ page }) => {
    const name = `E2E proizvod ${Date.now()}`;
    await page.goto("/prodavac/dodaj");
    await page.locator('input[name="name"]').fill(name);
    await page.locator('input[name="price"]').fill("1990");
    await page.locator('select[name="category"]').selectOption({ index: 1 });
    await page.getByTestId("product-submit").click();

    // createProduct radi redirect na listu proizvoda.
    await page.waitForURL(/\/prodavac\/proizvodi/);
    await expect(page.getByText(name)).toBeVisible();

    // Otvori izmenu (forma je dostupna).
    await page.getByRole("link", { name: /uredi/i }).first().click();
    await expect(page).toHaveURL(/\/prodavac\/proizvodi\/.+\/uredi/);
    await expect(page.getByTestId("product-submit")).toBeVisible();
  });
});

test.describe("P3 · Admin", () => {
  test.use({ storageState: ROLES.admin.storage });

  test("admin panel → red za odobravanje tagova", async ({ page }) => {
    await page.goto("/admin/tagovi");
    await expect(page).toHaveURL(/\/admin\/tagovi/);
    await expect(page.getByTestId("tag-queue")).toBeVisible();
  });
});
