import { CitizenHeader } from "@/components/citizen/citizen-header";

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <CitizenHeader />
      <main className="flex-1 container py-8">
        {children}
      </main>
    </div>
  );
}
