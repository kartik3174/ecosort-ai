
import { PageHeader } from "@/components/shared/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cleanupTasksData } from "@/lib/data";
import { Truck, CheckCircle, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function CleanupManagementPage() {

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" => {
    switch (status) {
      case "Completed":
        return "default";
      case "In Progress":
        return "secondary";
      case "Pending Assignment":
        return "destructive";
      default:
        return "default";
    }
  }

  const getPriorityClass = (p: string) => {
    if (p === 'High') return 'bg-red-500 text-white border-transparent';
    if (p === 'Medium') return 'bg-yellow-500 text-black border-transparent';
    return 'bg-gray-400 text-white border-transparent';
  };

  return (
    <div>
      <PageHeader
        title="Cleanup Management"
        description="Assign, track, and manage all cleanup operations."
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task ID</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Date Assigned</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cleanupTasksData.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.id}</TableCell>
                  <TableCell>{task.location}</TableCell>
                   <TableCell>{task.assignedTo}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(task.status)}>{task.status}</Badge>
                  </TableCell>
                  <TableCell>
                     <Badge className={cn(getPriorityClass(task.priority))}>{task.priority}</Badge>
                  </TableCell>
                  <TableCell>{task.dateAssigned}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem disabled>
                          <Truck className="mr-2 h-4 w-4" />
                          Assign Team
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Complete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
