import { notFound } from "next/navigation";

// Any unknown address under /sw or /en shows the translated "page not found".
export default function CatchAll() {
  notFound();
}
