"use client";

import { useActionState, useState, useTransition } from "react";
import type { Category } from "@/lib/types";
import { addCategory, deleteCategory, renameCategory } from "../../actions";
import { dangerButton, inputClass, primaryButton, secondaryButton } from "../../ui";

export function CategoryManager({ categories, counts }: { categories: Category[]; counts: Record<number, number> }) {
  const [state, action, adding] = useActionState(addCategory, undefined);

  return (
    <>
      <form action={action} className="mb-6 grid gap-2 rounded-2xl border border-line bg-white p-3 sm:grid-cols-[1fr_1fr_auto]">
        <input name="name" required placeholder="English name, e.g. Eye Health" aria-label="English name" className={inputClass} />
        <input name="name_sw" placeholder="Jina la Kiswahili, mf. Afya ya Macho" aria-label="Swahili name" className={inputClass} />
        <button type="submit" disabled={adding} className={primaryButton}>Add</button>
      </form>
      {state?.error && <p role="alert" className="-mt-3 mb-4 text-sm font-medium text-red-700">{state.error}</p>}
      {state?.ok && <p role="status" className="-mt-3 mb-4 text-sm font-medium text-leaf-700">{state.ok}</p>}

      <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
        {categories.map((c) => <Row key={c.id} category={c} count={counts[c.id] ?? 0} />)}
      </ul>
    </>
  );
}

function Row({ category, count }: { category: Category; count: number }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [nameSw, setNameSw] = useState(category.name_sw ?? "");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const cancel = () => {
    setEditing(false);
    setName(category.name);
    setNameSw(category.name_sw ?? "");
    setError("");
  };

  const save = () =>
    startTransition(async () => {
      const result = await renameCategory(category.id, name, nameSw);
      if (result?.error) setError(result.error);
      else {
        setError("");
        setEditing(false);
      }
    });

  const remove = () => {
    const note = count ? `\n\nIts ${count} product(s) will stay on the website without a category.` : "";
    if (confirm(`Delete the category "${category.name}"?${note}`)) startTransition(() => deleteCategory(category.id));
  };

  return (
    <li className={`flex flex-wrap items-center gap-2 p-3 ${pending ? "opacity-50" : ""}`}>
      {editing ? (
        <>
          <input value={name} onChange={(e) => setName(e.target.value)} aria-label="English name" className={`${inputClass} h-10 min-w-40 flex-1`} autoFocus />
          <input value={nameSw} onChange={(e) => setNameSw(e.target.value)} aria-label="Swahili name" placeholder="Kiswahili" className={`${inputClass} h-10 min-w-40 flex-1`} />
          <button type="button" onClick={save} disabled={pending} className={secondaryButton}>Save</button>
          <button type="button" onClick={cancel} className={secondaryButton}>Cancel</button>
          {error && <p className="w-full text-sm text-red-700">{error}</p>}
        </>
      ) : (
        <>
          <span className="min-w-0 flex-1">
            <span className="block font-medium text-ink">
              {category.name} <span className="text-sm font-normal text-muted">· {count} product{count === 1 ? "" : "s"}</span>
            </span>
            <span className="block text-sm text-muted">
              {category.name_sw || <em className="text-red-700">No Swahili name yet (English is shown)</em>}
            </span>
          </span>
          <button type="button" onClick={() => setEditing(true)} className={secondaryButton}>Edit</button>
          <button type="button" onClick={remove} disabled={pending} className={dangerButton}>Delete</button>
        </>
      )}
    </li>
  );
}
