import { Suspense } from "react";
import EditDeckClient from "./EditDeckClient";

export default function EditDeckPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-pulse rounded-full bg-surface" />
        </div>
      }
    >
      <EditDeckClient />
    </Suspense>
  );
}
