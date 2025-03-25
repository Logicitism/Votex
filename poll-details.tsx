import { useLocation, useParams } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PollResults } from "@/components/poll-results";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Poll } from "@shared/schema";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PollDetails() {
  const params = useParams();
  const [, navigate] = useLocation();
  const pollId = parseInt(params.id);

  const { data: poll, isLoading, error } = useQuery<Poll>({
    queryKey: [`/api/polls/${pollId}`],
    enabled: !isNaN(pollId),
  });

  if (isNaN(pollId)) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Invalid Poll ID</AlertTitle>
              <AlertDescription>
                The poll ID provided is invalid. Please check the URL and try again.
              </AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => navigate("/vote")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Polls
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-6">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(-1)}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              Poll Results
            </h1>
          </div>
          
          <PollResults pollId={pollId} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
