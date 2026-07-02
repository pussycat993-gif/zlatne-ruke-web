import { test, expect } from "@playwright/test";
import { ROLES } from "./roles";

// ── PRIORITET 1: Autorizacija (najvažnije) ──
test.describe("P1 · Autorizacija", () => {
  test("anon → seller akcija (/prodavac/dodaj) preusmerava na prijavu", async ({
    page,
  }) => {
    await page.goto("/prodavac/dodaj");
    await expect(page).toHaveURL(/\/(login|sign-in)/);
    await expect(page.getByTestId("product-submit")).toHaveCount(0);
  });

  test("anon → /prodavac/radnja preusmerava na prijavu", async ({ page }) => {
    await page.goto("/prodavac/radnja");
    await expect(page).toHaveURL(/\/(login|sign-in)/);
  });

  test("anon → /admin preusmerava na prijavu", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/(login|sign-in)/);
  });

  test.describe("ulogovan kupac (non-admin)", () => {
    test.use({ storageState: ROLES.buyer.storage });

    test("kupac NE može u /admin (redirect na početnu)", async ({ page }) => {
      await page.goto("/admin");
      await expect(page).not.toHaveURL(/\/admin/);
    });

    test("kupac NE može u /admin/tagovi", async ({ page }) => {
      await page.goto("/admin/tagovi");
      await expect(page).not.toHaveURL(/\/admin/);
    });
  });

  test.describe("ulogovan prodavac (non-admin)", () => {
    test.use({ storageState: ROLES.sellerA.storage });

    test("prodavac NE može u /admin", async ({ page }) => {
      await page.goto("/admin");
      await expect(page).not.toHaveURL(/\/admin/);
    });
  });

  test("cross-seller izolacija: A ne može da otvori/menja B-ov proizvod", async ({
    browser,
  }) => {
    // 1) Kao prodavac B: pronađi link ka izmeni prvog B-ovog proizvoda.
    const ctxB = await browser.newContext({
      storageState: ROLES.sellerB.storage,
    });
    const pageB = await ctxB.newPage();
    await pageB.goto("/prodavac/proizvodi");
    const editLinkB = pageB.getByRole("link", { name: /uredi/i }).first();
    await expect(
      editLinkB,
      "Prodavac B mora imati bar 1 proizvod (seed test baze)",
    ).toBeVisible();
    const bEditHref = await editLinkB.getAttribute("href"); // /prodavac/proizvodi/<ID>/uredi
    await ctxB.close();
    expect(bEditHref).toBeTruthy();

    // 2) Kao prodavac A: otvori B-ovu edit stranicu → mora 404 (notFound), bez forme.
    const ctxA = await browser.newContext({
      storageState: ROLES.sellerA.storage,
    });
    const pageA = await ctxA.newPage();
    const resp = await pageA.goto(bEditHref!);
    expect(resp?.status(), "Edit tuđeg proizvoda mora vratiti 404").toBe(404);
    // Ne sme da procuri B-ova forma za izmenu.
    await expect(pageA.getByTestId("product-submit")).toHaveCount(0);
    await ctxA.close();
  });
});
