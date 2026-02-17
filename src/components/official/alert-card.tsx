import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Siren, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertCardProps = {
  id: string;
  type: string;
  location: string;
  time: string;
  severity: string;
};

export function AlertCard({ id, type, location, time, severity }: AlertCardProps) {
  const getSeverityClass = (s: string) => {
    if (s === 'Critical') return 'bg-red-700 text-white';
    if (s === 'High') return 'bg-red-500 text-white';
    return 'bg-yellow-500 text-black';
  };

  return (
    <Card className="border-l-4 border-destructive overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{type}</CardTitle>
            <Badge className={cn(getSeverityClass(severity))}>{severity}</Badge>
        </div>
        <p className="text-sm text-muted-foreground flex items-center gap-2 pt-1">
            <MapPin className="h-4 w-4" /> {location}
        </p>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" /> Reported {time}
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-3 gap-2">
        <Button size="sm" variant="destructive" disabled><Siren /> Dispatch</Button>
        <Button size="sm" variant="outline" disabled><Phone /> Contact</Button>
        <Button size="sm" variant="outline" disabled><MapPin /> View</Button>
      </CardFooter>
    </Card>
  );
}
