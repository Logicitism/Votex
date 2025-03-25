import { useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StatsCards } from "@/components/stats-cards";
import { PollList } from "@/components/poll-list";
import { BlockchainActivity } from "@/components/blockchain-activity";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useWebSocket } from "@/hooks/use-websocket";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Plus } from "lucide-react";
import { PollResults } from "@/components/poll-results";
import { useQuery } from "@tanstack/react-query";
import { Poll } from "@shared/schema";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Fetch user's active polls
  const { data: userPolls } = useQuery<Poll[]>({
    queryKey: user ? [`/api/users/${user.id}/polls`] : undefined,
    enabled: !!user,
  });

  // Set up WebSocket connection
  const { isConnected } = useWebSocket({
    onMessage: (message) => {
      if (message.type === 'NEW_VOTE') {
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['/api/polls'] });
        queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
        
        if (message.data.pollId) {
          queryClient.invalidateQueries({ 
            queryKey: [`/api/polls/${message.data.pollId}`] 
          });
          queryClient.invalidateQueries({ 
            queryKey: [`/api/polls/${message.data.pollId}/votes`] 
          });
        }
        
        // Could show a toast for votes on user's polls
        if (userPolls?.some(poll => poll.id === message.data.pollId)) {
          toast({
            title: "New Vote",
            description: "Someone just voted on one of your polls.",
          });
        }
      }
      
      if (message.type === 'NEW_POLL') {
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['/api/polls'] });
        queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      }
      
      if (message.type === 'BLOCKCHAIN_UPDATE') {
        queryClient.invalidateQueries({ queryKey: ['/api/blockchain/recent'] });
        queryClient.invalidateQueries({ queryKey: ['/api/blockchain/verify'] });
      }
    }
  });

  // Find the most voted poll for preview
  const mostVotedPoll = userPolls?.length ? userPolls[0].id : undefined;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Dashboard
              </h1>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Button onClick={() => navigate("/create-poll")}>
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                Create New Poll
              </Button>
            </div>
          </div>

          <StatsCards />

          <div className="mt-8">
            <PollList 
              userId={user?.id}
              title="Your Active Polls"
              description="All polls you have created that are currently open for voting"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <BlockchainActivity />
            
            {mostVotedPoll && (
              <div>
                <h2 className="text-lg font-medium mb-4">Poll Results Preview</h2>
                <PollResults pollId={mostVotedPoll} />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
