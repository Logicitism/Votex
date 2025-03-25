import { useQuery } from "@tanstack/react-query";
import { Poll } from "@shared/schema";
import { BarChart, BarChartData } from "@/components/ui/bar-chart";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Share2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface PollResultsProps {
  pollId: number;
}

export function PollResults({ pollId }: PollResultsProps) {
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/polls/${pollId}/votes`],
  });

  const sharePoll = () => {
    const shareUrl = `${window.location.origin}/vote?pollId=${pollId}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied",
      description: "Poll link has been copied to clipboard.",
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load poll results: {(error as Error).message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data || !data.poll) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Poll not found</AlertTitle>
        <AlertDescription>
          The poll you're looking for doesn't exist or has been removed.
        </AlertDescription>
      </Alert>
    );
  }

  const { poll, results, totalVotes } = data;
  const isEnded = new Date(poll.endDate) < new Date();

  // Transform results to chart data
  const chartData: BarChartData[] = results.map((result: any) => ({
    name: result.text,
    value: result.votes || 0,
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{poll.title}</CardTitle>
          <Badge variant={isEnded ? "outline" : "success"}>
            {isEnded ? "Ended" : "Active"}
          </Badge>
        </div>
        <CardDescription>
          {poll.description}
          <div className="mt-2 text-sm text-muted-foreground">
            Ends: {format(new Date(poll.endDate), "MMMM dd, yyyy")} • 
            Total votes: {totalVotes}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="w-full">
            <BarChart data={chartData} height={300} />
            
            <div className="mt-6 space-y-4">
              {results.map((result: any, index: number) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium text-gray-700">{result.text}</div>
                    <div className="text-sm text-gray-500">
                      {totalVotes > 0 
                        ? `${Math.round((result.votes / totalVotes) * 100)}%` 
                        : '0%'}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ 
                        width: totalVotes > 0 
                          ? `${(result.votes / totalVotes) * 100}%` 
                          : '0%' 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No votes have been cast yet.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={sharePoll}
        >
          <Share2 className="h-4 w-4" />
          Share Poll
        </Button>
      </CardFooter>
    </Card>
  );
}
