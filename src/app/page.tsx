import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col gap-16 items-center justify-center bg-background">
      <div className="flex flex-col gap-2 items-center justify-center">
        <h1 className="text-6xl font-bold text-center">
          Water Quality Monitoring
        </h1>
        <p className="text-xl text-center text-green-500">
          Monitor water quality in real-time using IoT devices
        </p>
      </div>
      <Button>
        <Link href="/dashboard/24hours">Go to Dashboard</Link>
      </Button>
    </main>
  );
}
