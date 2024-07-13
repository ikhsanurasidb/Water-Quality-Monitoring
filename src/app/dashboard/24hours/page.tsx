import Dashboard from "@/components/dashboard";

export const dynamic = "force-dynamic"

export default async function dashboard() {
  return (
    <main className="flex min-h-screen flex-col gap-16 p-16 items-center justify-center bg-background">
      <Dashboard mode={1}/>
    </main>
  );
}
