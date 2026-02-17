import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { officialStats } from '@/lib/data';
import { LineChart } from 'lucide-react';

export default function OfficialOverviewPage() {
  return (
    <div>
      <PageHeader
        title="City Waste Management Overview"
        description="Real-time data on litter reports and cleanup operations."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {officialStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
      <div className="flex">
        <Button asChild size="lg" className="transition-transform hover:scale-105">
          <Link href="/official/analytics">
            <LineChart />
            View Analytics
          </Link>
        </Button>
      </div>
    </div>
  );
}
