import { useLocation } from "wouter";
import { useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { VotingForm } from "@/components/voting-form";
import { PollList } from "@/components/poll-list";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Vote() {
  const [location, navigate] = useLocation();
  
  // Extract pollId from query params
  const params = new URLSearchParams(location.split('?')[1]);
  const pollId = params.get('pollId') ? parseInt(params.get('pollId')!) : undefined;
  
  // If no specific poll ID, show all active polls
  if (!pollId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Available Polls
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Select a poll to cast your vote
              </p>
            </div>
            
            <PollList
              title="Active Polls"
              description="All polls currently open for voting"
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // If we have a specific poll ID, show the voting form
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Cast Your Vote
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Your vote will be securely recorded on the blockchain
            </p>
          </div>
          
          {isNaN(pollId) ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Invalid Poll ID</AlertTitle>
              <AlertDescription>
                The poll ID provided is invalid. Please check the URL and try again.
              </AlertDescription>
            </Alert>
          ) : (
            <VotingForm pollId={pollId} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
