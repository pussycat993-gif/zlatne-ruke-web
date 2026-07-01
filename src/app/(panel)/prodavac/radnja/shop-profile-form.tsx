"use client";

import { useActionState, useState } from "react";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { TextField, TextArea, SelectField } from "@/components/panel/fields";
import { updateSellerShop, type FormState } from "@/lib/seller-actions";
import { type Tone, toneClass } from "@/lib/data";
import { cloudinaryUrl } from "@/lib/cloudinary";

const initial: FormState = { ok: false };

type ShopData = {
  name: string;
  city: string;
  owner: string;
  category: string;
  bio: string;
  tone: Tone;
  coverPublicId?: string | null;
};

export function ShopProfileForm({
  shop,
  categories,
}: {
  shop: ShopData;
  categories: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState(updateSellerShop, initial);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const existingCover = shop.coverPublicId
    ? cloudinaryUrl(shop.coverPublicId, { width: 800 })
    : null;
  const coverSrc = coverPreview ?? existingCover;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-semibold text-foreground md:text-3xl">
          Profil radnje
        </h1>
        {state.ok && (
          <span className="inline-flex items-center gap-2 rounded-full bg-pink-light px-4 py-2 text-sm font-semibold text-pink-dark">
            <Icon name="check" size={16} /> Sačuvano
          </span>
        )}
      </div>

      <form
        action={action}
        className="space-y-6 rounded-2xl border border-line-soft bg-surface p-6 md:p-8"
      >
        <div>
          <div className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-pink-dark">
            Naslovna slika
          </div>
          <label
            className={`relative flex h-40 cursor-pointer items-end justify-end overflow-hidden rounded-2xl p-4 ${coverSrc ? "" : toneClass[shop.tone]}`}
          >
            {coverSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverSrc}
                alt="Naslovna slika radnje"
                className="absolute inset-0 size-full object-cover"
              />
            )}
            <span className="relative inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-xs font-semibold text-pink-dark">
              <Icon name="camera" size={14} /> Promeni sliku
            </span>
            <input
              type="file"
              name="cover"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setCoverPreview(file ? URL.createObjectURL(file) : null);
              }}
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Naziv radnje" name="name" defaultValue={shop.name} required />
          <TextField label="Lokacija" name="city" defaultValue={shop.city} />
          <TextField label="Vlasnica" name="owner" defaultValue={shop.owner} />
          <SelectField
            label="Kategorija"
            name="category"
            defaultValue={shop.category}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
          />
        </div>

        <TextArea label="O radnji" name="bio" rows={4} defaultValue={shop.bio} />

        {state.error && (
          <p className="text-sm font-medium text-destructive">{state.error}</p>
        )}

        <Button type="submit" size="cta" disabled={pending}>
          {pending ? "Čuvam…" : "Sačuvaj izmene"}
        </Button>
      </form>
    </div>
  );
}
