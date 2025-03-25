import { useQuery } from "@tanstack/react-query";
import { Poll } from "@shared/schema";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PollResults } from "@/components/poll-results";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export default function ResultsPage() {
  const [, navigate] = useLocation();
  
  const { data: polls, isLoading, error } = useQuery<Poll[]>({
    queryKey: ['/api/polls'],
  });

  // Find active and completed polls
  const activePolls = polls?.filter(p => new Date(p.endDate) > new Date()) || [];
  const completedPolls = polls?.filter(p => new Date(p.endDate) <= new Date()) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <Skeleton className="h-10 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-[500px] w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const renderEmptyState = () => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No polls found</h3>
        <p className="text-sm text-muted-foreground mt-2">
          There are no polls in this category.
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Results Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View and analyze results from all polls
            </p>
          </div>
          
          <Tabs defaultValue="active" className="space-y-6">
            <TabsList className="mb-4">
              <TabsTrigger value="active">Active Polls</TabsTrigger>
              <TabsTrigger value="completed">Completed Polls</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              {activePolls.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activePolls.map(poll => (
                    <div key={poll.id} onClick={() => navigate(`/poll/${poll.id}`)} className="cursor-pointer">
                      <PollResults pollId={poll.id} />
                    </div>
                  ))}
                </div>
              ) : renderEmptyState()}
            </TabsContent>
            
            <TabsContent value="completed">
              {completedPolls.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {completedPolls.map(poll => (
                    <div key={poll.id} onClick={() => navigate(`/poll/${poll.id}`)} className="cursor-pointer">
                      <PollResults pollId={poll.id} />
                    </div>
                  ))}
                </div>
              ) : renderEmptyState()}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
