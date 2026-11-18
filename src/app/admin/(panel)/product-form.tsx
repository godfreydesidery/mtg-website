"use client";

import Image from "next/image";
import Link from "@/components/app-link";
import { useActionState, useRef, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { PHOTO_BUCKET, photoUrl } from "@/lib/supabase/env";
import { splitBySection, type Category, type Product } from "@/lib/types";
import { saveProduct } from "../actions";
import { inputClass, primaryButton, secondaryButton } from "../ui";
import { Spinner } from "@/components/spinner";

const MAX_PHOTOS = 6;
const MAX_SIDE = 1200; // px; keeps photos around 150–300 KB

/** Shrinks a phone photo before upload, so it is quick on mobile data. */
async function resize(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff"; // transparent PNGs get a white background
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not read photo"))), "image/jpeg", 0.82),
  );
}

export function ProductForm({ product, categories }: { product?: Product; categories: Category[] }) {
  const [state, action, saving] = useActionState(saveProduct, undefined);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [uploading, setUploading] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const original = useRef(new Set(product?.images ?? []));
  const fileInput = useRef<HTMLInputElement>(null);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploadError("");
    const supabase = createBrowserSupabase();
    const room = MAX_PHOTOS - images.length;
    const picked = Array.from(files).slice(0, room);
    if (files.length > room) setUploadError(`You can add up to ${MAX_PHOTOS} photos.`);

    setUploading((n) => n + picked.length);
    await Promise.all(
      picked.map(async (file) => {
        try {
          const blob = await resize(file);
          const path = `products/${crypto.randomUUID()}.jpg`;
          const { error } = await supabase.storage
            .from(PHOTO_BUCKET)
            .upload(path, blob, { contentType: "image/jpeg", cacheControl: "31536000" });
          if (error) throw error;
          setImages((list) => [...list, path]);
        } catch (e) {
          setUploadError(`Upload failed: ${e instanceof Error ? e.message : "please try again"}`);
        } finally {
          setUploading((n) => n - 1);
        }
      }),
    );
    if (fileInput.current) fileInput.current.value = "";
  }

  function removeImage(path: string) {
    setImages((list) => list.filter((p) => p !== path));
    // New, unsaved uploads are deleted straight away; saved photos are deleted when you save.
    if (!original.current.has(path)) createBrowserSupabase().storage.from(PHOTO_BUCKET).remove([path]);
  }

  function makeMain(path: string) {
    setImages((list) => [path, ...list.filter((p) => p !== path)]);
  }

  return (
    <form action={action} className="space-y-6">
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      <section className="rounded-2xl border border-line bg-white p-4 sm:p-6">
        <h2 className="font-bold text-ink">Photos</h2>
        <p className="mb-4 text-sm text-muted">The first photo is the main one. Take a photo or choose from your gallery.</p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {images.map((path, i) => (
            <div key={path} className="relative">
              <div className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-white ${i === 0 ? "border-leaf-500" : "border-line"}`}>
                <Image src={photoUrl(path)} alt={`Photo ${i + 1}`} fill sizes="160px" className="object-contain p-1" />
              </div>
              <div className="mt-1 flex justify-between gap-1 text-xs font-semibold">
                {i === 0 ? (
                  <span className="text-leaf-700">Main</span>
                ) : (
                  <button type="button" onClick={() => makeMain(path)} className="text-navy-600 hover:underline">Make main</button>
                )}
                <button type="button" onClick={() => removeImage(path)} className="text-red-700 hover:underline">Remove</button>
              </div>
            </div>
          ))}
          {Array.from({ length: uploading }, (_, i) => (
            <div key={`up-${i}`} className="grid aspect-square animate-pulse place-items-center rounded-xl bg-navy-50 text-xs font-semibold text-navy-700">
              Uploading…
            </div>
          ))}
          {images.length + uploading < MAX_PHOTOS && (
            <label className="grid aspect-square cursor-pointer place-items-center rounded-xl border-2 border-dashed border-line text-center text-sm font-semibold text-navy-700 hover:border-navy-600">
              <span>+ Add<br />photo</span>
              <input ref={fileInput} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => onFiles(e.target.files)} />
            </label>
          )}
        </div>
        {uploadError && <p role="alert" className="mt-3 text-sm font-medium text-red-700">{uploadError}</p>}
      </section>

      <section className="space-y-4 rounded-2xl border border-line bg-white p-4 sm:p-6">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">Product name *</span>
          <input name="name" required defaultValue={product?.name} className={inputClass} placeholder="e.g. Vitamin C 1000mg, 60 tablets" />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-ink">Price (TSh)</span>
            <input
              name="price"
              inputMode="numeric"
              defaultValue={product?.price ?? ""}
              className={inputClass}
              placeholder="Empty = “Call for price”"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-ink">Old price (TSh), optional</span>
            <input
              name="old_price"
              inputMode="numeric"
              defaultValue={product?.old_price ?? ""}
              className={inputClass}
              placeholder="Higher = shows “Sale!”"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-ink">Category</span>
            <select name="category_id" defaultValue={product?.category_id ?? ""} className={inputClass}>
              <option value="">No category</option>
              {Object.entries(splitBySection(categories)).map(([section, list]) =>
                list.length ? (
                  <optgroup key={section} label={section === "logistics" ? "Logistics" : "Shop"}>
                    {list.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </optgroup>
                ) : null,
              )}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">Description (English)</span>
          <textarea
            name="description"
            rows={5}
            defaultValue={product?.description}
            className={`${inputClass} h-auto py-3`}
            placeholder="What it is, size or quantity, how to use it…"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">Maelezo (Kiswahili), optional</span>
          <textarea
            name="description_sw"
            rows={5}
            defaultValue={product?.description_sw ?? ""}
            className={`${inputClass} h-auto py-3`}
            placeholder="Ni nini, ukubwa au idadi, jinsi ya kutumia… If empty, the English description is shown."
          />
        </label>
      </section>

      <section className="space-y-3 rounded-2xl border border-line bg-white p-4 sm:p-6">
        {[
          ["is_visible", "Show on the website", product?.is_visible ?? true],
          ["in_stock", "In stock", product?.in_stock ?? true],
          ["is_featured", "Feature on the home page", product?.is_featured ?? false],
        ].map(([name, label, checked]) => (
          <label key={name as string} className="flex items-center gap-3 text-[15px] font-medium text-ink">
            <input type="checkbox" name={name as string} defaultChecked={checked as boolean} className="size-5 accent-leaf-600" />
            {label}
          </label>
        ))}
      </section>

      {state?.error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-800">{state.error}</p>}

      <div className="sticky bottom-0 -mx-4 flex gap-3 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <button type="submit" disabled={saving || uploading > 0} className={`${primaryButton} flex-1 sm:flex-none`}>
          {saving ? <><Spinner /> Saving…</> : uploading > 0 ? <><Spinner /> Wait for photos…</> : "Save product"}
        </button>
        <Link href="/admin" className={`${secondaryButton} h-12 px-5`}>Cancel</Link>
      </div>
    </form>
  );
}
