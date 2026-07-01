"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { TextField, TextArea, SelectField } from "@/components/panel/fields";
import { type FormState } from "@/lib/seller-actions";
import { formatPrice, toneClass } from "@/lib/data";
import { cloudinaryUrl } from "@/lib/cloudinary";

const initialState: FormState = { ok: false };

type ProductInitial = {
  id?: string;
  name?: string;
  price?: number;
  oldPrice?: number | null;
  category?: string;
  inStock?: number;
  description?: string;
  imagePublicIds?: string[];
};

export function ProductForm({
  categories,
  action,
  heading,
  submitLabel,
  initial,
}: {
  categories: { id: string; name: string }[];
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  heading: string;
  submitLabel: string;
  initial?: ProductInitial;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState(
    initial?.price != null ? String(initial.price) : "",
  );
  const [imgPreviews, setImgPreviews] = useState<string[]>([]);

  const existingImages = (initial?.imagePublicIds ?? []).map((id) =>
    cloudinaryUrl(id, { width: 600 }),
  );
  // Nove slike (ako su izabrane) zamenjuju postojeće; inače prikazujemo postojeće.
  const shownImages = imgPreviews.length > 0 ? imgPreviews : existingImages;
  const previewSrc = shownImages[0] ?? null;

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/prodavac/proizvodi"
          className="flex size-9 items-center justify-center rounded-full border border-line text-pink-dark transition-colors hover:bg-pink-light"
          aria-label="Nazad"
        >
          <Icon name="back" size={16} />
        </Link>
        <h1 className="font-heading text-2xl font-semibold text-foreground md:text-3xl">
          {heading}
        </h1>
      </div>

      <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          {initial?.id && <input type="hidden" name="id" value={initial.id} />}

          <section className="space-y-4 rounded-2xl border border-line-soft bg-surface p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Osnovne informacije
            </h2>
            <TextField
              label="Naziv proizvoda"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="npr. Šal od merino vune"
            />
            <SelectField
              label="Kategorija"
              name="category"
              defaultValue={initial?.category ?? ""}
              options={[
                { value: "", label: "Izaberi kategoriju" },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />
            <TextArea
              label="Opis"
              name="description"
              rows={5}
              defaultValue={initial?.description ?? ""}
              placeholder="Opiši proizvod, materijale, dimenzije i priču iza njega…"
            />
          </section>

          <section className="rounded-2xl border border-line-soft bg-surface p-6">
            <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">
              Slike proizvoda
            </h2>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-pink-light px-4 py-2 text-sm font-semibold text-pink-dark">
              <Icon name="image" size={16} />
              {shownImages.length > 0 ? "Promeni slike" : "Izaberi slike"}
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => {
                  const urls = Array.from(e.target.files ?? [])
                    .slice(0, 6)
                    .map((f) => URL.createObjectURL(f));
                  setImgPreviews(urls);
                }}
              />
            </label>
            <p className="mt-2 text-xs text-ink">
              Do 6 slika (JPG/PNG). Prva slika je naslovna.
            </p>

            {shownImages.length > 0 ? (
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {shownImages.map((src, i) => (
                  <div
                    key={i}
                    className="relative aspect-square overflow-hidden rounded-xl border border-line-soft"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      className="absolute inset-0 size-full object-cover"
                    />
                    {i === 0 && (
                      <span className="absolute left-1.5 top-1.5 rounded-full bg-pink px-2 py-0.5 text-[0.6rem] font-bold text-primary-foreground">
                        Naslovna
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 flex aspect-[3/1] items-center justify-center rounded-xl border-2 border-dashed border-line text-ink-soft">
                <Icon name="image" size={24} />
              </div>
            )}
          </section>

          <section className="space-y-4 rounded-2xl border border-line-soft bg-surface p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Cena i zalihe
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Cena (RSD)"
                name="price"
                type="number"
                min={0}
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="4800"
              />
              <TextField
                label="Stara cena (opciono)"
                name="oldPrice"
                type="number"
                min={0}
                defaultValue={initial?.oldPrice ?? ""}
                placeholder="5500"
              />
              <TextField
                label="Količina na stanju"
                name="inStock"
                type="number"
                min={0}
                defaultValue={initial?.inStock ?? 1}
              />
            </div>
            <p className="rounded-xl bg-cream px-4 py-3 text-xs leading-relaxed text-ink">
              Plaćanje i dostavu dogovaraš direktno sa kupcem. Provizija: 0 RSD —
              trenutno besplatno.
            </p>
          </section>

          {state.error && (
            <p className="text-sm font-medium text-destructive">{state.error}</p>
          )}

          <Button type="submit" size="cta" disabled={pending}>
            {pending ? "Čuvam…" : submitLabel}
          </Button>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-ink">
            Pregled kartice
          </div>
          <div className="overflow-hidden rounded-2xl border border-line-soft bg-surface">
            <div
              className={`relative aspect-[5/6] w-full overflow-hidden ${toneClass.v3}`}
            >
              {previewSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewSrc}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                />
              )}
            </div>
            <div className="p-3">
              <div className="mt-1 line-clamp-2 text-sm font-semibold text-pink-dark">
                {name || "Naziv proizvoda"}
              </div>
              <div className="mt-1.5 text-base font-bold text-pink-dark">
                {price ? formatPrice(Number(price)) : "— RSD"}
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-ink">
            Ovako će izgledati u katalogu i pretrazi.
          </p>
        </aside>
      </form>
    </div>
  );
}
