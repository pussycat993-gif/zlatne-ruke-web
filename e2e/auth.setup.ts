import { test as setup, expect } from "@playwright/test";
import {
  clerk,
  clerkSetup,
  setupClerkTestingToken,
} from "@clerk/testing/playwright";
import { ROLES, type RoleKey } from "./roles";

// Prijavi svaku test-ulogu preko Clerk „testing tokena" (zaobilazi bot-zaštitu)
// i sačuvaj sesiju u e2e/.auth/<rola>.json da je testovi ponovo koriste.
setup("prijavi test-uloge", async ({ browser }) => {
  // Uzima testing token iz CLERK_* ključeva (dev instanca).
  await clerkSetup();

  for (const key of Object.keys(ROLES) as RoleKey[]) {
    const { email, password, storage } = ROLES[key];
    if (!email || !password) {
      throw new Error(
        `Nedostaju kredencijali za ulogu "${key}" u .env.test (E2E_*_EMAIL/PASSWORD).`,
      );
    }
    const page = await browser.newPage();
    await setupClerkTestingToken({ page });
    await page.goto("/");
    await clerk.signIn({
      page,
      signInParams: { strategy: "password", identifier: email, password },
    });
    // Potvrdi da je sesija aktivna (profil je zaštićena ruta).
    await page.goto("/profil");
    await expect(page).toHaveURL(/\/profil/);

    // Prodavci: obezbedi bar 1 proizvod (za cross-seller izolaciju).
    // Radnja se lazy-kreira na prvi ulaz u panel; proizvod dodajemo preko UI-ja
    // ako ga nema. (Zahteva seed kategorija u TEST bazi: npm run db:seed.)
    if (key === "sellerA" || key === "sellerB") {
      await page.goto("/prodavac/proizvodi");
      const hasProduct = await page
        .getByRole("link", { name: /uredi/i })
        .count();
      if (hasProduct === 0) {
        await page.goto("/prodavac/dodaj");
        await page.locator('input[name="name"]').fill(`Seed ${key}`);
        await page.locator('input[name="price"]').fill("1000");
        await page
          .locator('select[name="category"]')
          .selectOption({ index: 1 });
        await page.getByTestId("product-submit").click();
        await page.waitForURL(/\/prodavac\/proizvodi/);
      }
    }

    await page.context().storageState({ path: storage });
    await page.close();
  }
});
