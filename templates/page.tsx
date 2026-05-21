// app/<route>/page.tsx — Server Component (no "use client")
import { list<Entities> } from "@/features/<feature-name>/services/list-<entities>.service";
import { <Entity>List } from "@/features/<feature-name>/components/<entity>-list";
import { <Entity>Form } from "@/features/<feature-name>/components/<entity>-form";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function <Entity>Page({ params }: PageProps) {
  const { id } = await params;
  const items = await list<Entities>(id);

  return (
    <main>
      <<Entity>List items={items} />
      <<Entity>Form parentId={id} />
    </main>
  );
}

// Optional streaming:
// import { Suspense } from "react";
// <Suspense fallback={<Skeleton />}><SlowPanel /></Suspense>
