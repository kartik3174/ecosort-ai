import { OfficialHeader } from "@/components/official/official-header";

export default function OfficialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <OfficialHeader />
      <main className="flex-1 container py-8">
        {children}
      </main>
    </div>
  );
}
