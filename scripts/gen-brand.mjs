import sharp from "sharp";

const CREAM = "#FDF6F0";
const SQUARE = "public/zlatne-ruke-logo.png";
const CROP = "public/zlatne-ruke-logo-crop.png";

// ── Favicon / app ikonice (krem tile + logo) ──
async function iconTile(size, out) {
  const inner = Math.round(size * 0.92);
  const logo = await sharp(SQUARE)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background: CREAM },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(out);
  console.log("✓", out);
}

// ── OG slika 1200×630 (krem + logo + slogan) ──
async function og(out) {
  const W = 1200,
    H = 630;
  const logoW = 720;
  const logoH = Math.round((logoW * 320) / 800); // razmera crop logoa = 800×320
  const logo = await sharp(CROP)
    .resize(logoW, logoH, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <text x="600" y="470" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="44" fill="#A0445A">Kad žena stvara srcem, nastaje magija.</text>
    <text x="600" y="530" text-anchor="middle" font-family="Arial, sans-serif" font-size="27" letter-spacing="1" fill="#7A6068">Katalog rukotvorina žena iz Srbije</text>
  </svg>`;

  await sharp({
    create: { width: W, height: H, channels: 4, background: CREAM },
  })
    .composite([
      { input: logo, top: 90, left: Math.round((W - logoW) / 2) },
      { input: Buffer.from(svg), top: 0, left: 0 },
    ])
    .png()
    .toFile(out);
  console.log("✓", out);
}

await iconTile(512, "src/app/icon.png");
await iconTile(180, "src/app/apple-icon.png");
await og("src/app/opengraph-image.png");
await og("src/app/twitter-image.png");
console.log("Gotovo.");
