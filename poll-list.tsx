import { useQuery } from "@tanstack/react-query";
import { Poll } from "@shared/schema";
import { DataTable } from "@/components/ui/data-table";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, ListFilter } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";

interface PollListProps {
  userId?: number;
  title?: string;
  description?: string;
}

export function PollList({ userId, title = "Polls", description }: PollListProps) {
  const [, navigate] = useLocation();
  
  const { data: polls, isLoading } = useQuery<Poll[]>({
    queryKey: userId ? [`/api/users/${userId}/polls`] : ['/api/polls'],
  });

  const columns = [
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Status",
      accessorKey: (row: Poll) => {
        const isActive = new Date(row.endDate) > new Date();
        return isActive ? "Active" : "Ended";
      },
      cell: (row: Poll) => {
        const isActive = new Date(row.endDate) > new Date();
        return (
          <Badge variant={isActive ? "success" : "outline"}>
            {isActive ? "Active" : "Ended"}
          </Badge>
        );
      },
    },
    {
      header: "End Date",
      accessorKey: "endDate",
      cell: (row: Poll) => {
        return format(new Date(row.endDate), "MMM dd, yyyy");
      },
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (row: Poll) => {
        return (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/poll/${row.id}`);
              }}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                // Copy share link to clipboard
                const shareUrl = `${window.location.origin}/vote?pollId=${row.id}`;
                navigator.clipboard.writeText(shareUrl);
                // You would typically show a toast here
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
  
  const handleRowClick = (row: Poll) => {
    navigate(`/poll/${row.id}`);
  };
  
  const emptyState = (
    <div className="text-center py-8">
      <ListFilter className="h-10 w-10 mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium mb-2">No polls found</h3>
      <p className="text-gray-500 mb-4">
        {userId 
          ? "You haven't created any polls yet." 
          : "There are no active polls available."}
      </p>
      {userId && (
        <Button onClick={() => navigate("/create-poll")}>
          Create New Poll
        </Button>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={polls || []}
          isLoading={isLoading}
          onRowClick={handleRowClick}
          emptyState={emptyState}
        />
      </CardContent>
    </Card>
  );
}
