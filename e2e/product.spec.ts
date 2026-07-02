import { test, expect } from "@playwright/test";
import { ROLES } from "./roles";

// ── PRIORITET 2 (podskup): validacija + brisanje ──
//
// TODO — NIJE pokriveno (feature ne postoji u UI-ju, dogovoreno da se preskoči):
//  • „Tag limit > 10": u formi proizvoda NEMA tagova; tagovi su admin-moderacija,
//    nema korisničkog dodavanja tagova ni pravila max-10 (ni UI, ni API, ni DB).
//  • „Slika: pogrešan tip / prevelik fajl → jasna poruka": forma ima samo
//    accept="image/*"; nema eksplicitne provere veličine/tipa sa porukom
//    (server vraća generičku grešku). Nema stabilne mete za assertion.
//  Kad se ovi feature-i naprave, dodati testove ovde.

test.describe("P2 · Forma proizvoda i brisanje", () => {
  test.use({ storageState: ROLES.sellerA.storage });

  test("prazna obavezna polja → nema submita (ostaje na formi)", async ({
    page,
  }) => {
    await page.goto("/prodavac/dodaj");
    await page.getByTestId("product-submit").click();
    // Naziv je required → nativna validacija blokira; nema redirekta na listu.
    await expect(page).toHaveURL(/\/prodavac\/dodaj/);
    await expect(page.locator('input[name="name"]:invalid')).toHaveCount(1);
  });

  test("brisanje proizvoda: confirm tok radi (i čisti kreirani red)", async ({
    page,
  }) => {
    // Napravi proizvod (na TEST bazi) pa ga obriši preko confirm toka.
    const name = `E2E brisanje ${Date.now()}`;
    await page.goto("/prodavac/dodaj");
    await page.locator('input[name="name"]').fill(name);
    await page.locator('input[name="price"]').fill("1500");
    await page.locator('select[name="category"]').selectOption({ index: 1 });
    await page.getByTestId("product-submit").click();
    await page.waitForURL(/\/prodavac\/proizvodi/);
    await expect(page.getByText(name)).toBeVisible();

    // Delete dugme koristi window.confirm — prihvati dijalog.
    page.once("dialog", (d) => d.accept());
    // Klikni delete u redu tog proizvoda (prvi red je najskoriji dodat).
    await page.getByTestId("delete-product").first().click();

    // Red nestaje (revalidacija liste).
    await expect(page.getByText(name)).toHaveCount(0);
  });
});
