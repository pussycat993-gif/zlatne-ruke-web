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
  imagePublicId?: string | null;
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
  const [imgPreview, setImgPreview] = useState<string | null>(null);

  const existingImage = initial?.imagePublicId
    ? cloudinaryUrl(initial.imagePublicId, { width: 600 })
    : null;
  const previewSrc = imgPreview ?? existingImage;

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
              Slika proizvoda
            </h2>
            <label className="flex cursor-pointer items-center gap-4">
              <span className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-line text-ink-soft">
                {previewSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewSrc}
                    alt="Pregled"
                    className="absolute inset-0 size-full object-cover"
                  />
                ) : (
                  <Icon name="image" size={22} />
                )}
              </span>
              <span>
                <span className="inline-flex rounded-full bg-pink-light px-4 py-2 text-sm font-semibold text-pink-dark">
                  {existingImage ? "Promeni sliku" : "Izaberi sliku"}
                </span>
                <span className="mt-1 block text-xs text-ink">
                  JPG ili PNG, do ~8MB.
                </span>
              </span>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setImgPreview(file ? URL.createObjectURL(file) : null);
                }}
              />
            </label>
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

          <Button
            type="submit"
            size="lg"
            disabled={pending}
            className="h-11 rounded-full px-7 text-sm"
          >
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
