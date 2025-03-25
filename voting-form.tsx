import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Poll } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import { AlertCircle, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface VotingFormProps {
  pollId: number;
}

export function VotingForm({ pollId }: VotingFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const { data: poll, isLoading, error } = useQuery<Poll>({
    queryKey: [`/api/polls/${pollId}`],
  });

  const { data: hasVoted } = useQuery<boolean>({
    queryKey: [`/api/polls/${pollId}/has-voted`],
    queryFn: async () => {
      try {
        // We'll check if the user has voted by looking at the results
        const res = await fetch(`/api/polls/${pollId}/votes`, {
          credentials: 'include',
        });
        if (!res.ok) return false;
        
        const data = await res.json();
        // Check if any vote is from the current user
        const votes = data.votes || [];
        return votes.some((vote: any) => vote.userId === user?.id);
      } catch (error) {
        return false;
      }
    },
    enabled: !!user && !!pollId,
  });

  const voteMutation = useMutation({
    mutationFn: async (optionIndex: number) => {
      if (!user) throw new Error("You must be logged in to vote");
      if (selectedOption === null) throw new Error("Please select an option");
      
      const data = {
        pollId,
        optionIndex,
      };
      
      const res = await apiRequest("POST", "/api/votes", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Vote submitted",
        description: "Your vote has been recorded on the blockchain.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/polls/${pollId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/polls/${pollId}/votes`] });
      queryClient.invalidateQueries({ queryKey: [`/api/polls/${pollId}/has-voted`] });
      navigate(`/poll/${pollId}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit vote",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <Skeleton className="h-6 w-2/3 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load poll: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!poll) {
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

  const isPollEnded = new Date(poll.endDate) < new Date();
  const options = poll.options as any[];

  const handleVote = () => {
    if (selectedOption !== null) {
      voteMutation.mutate(selectedOption);
    } else {
      toast({
        title: "No option selected",
        description: "Please select an option to vote.",
        variant: "destructive",
      });
    }
  };

  if (isPollEnded) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{poll.title}</CardTitle>
          <CardDescription>{poll.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertTitle>Poll has ended</AlertTitle>
            <AlertDescription>
              This poll is no longer accepting votes. Please view the results instead.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => navigate(`/poll/${pollId}`)}
          >
            View Results
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (hasVoted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{poll.title}</CardTitle>
          <CardDescription>{poll.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Already voted</AlertTitle>
            <AlertDescription>
              You have already voted in this poll. You can view the results instead.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => navigate(`/poll/${pollId}`)}
          >
            View Results
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{poll.title}</CardTitle>
        <CardDescription>{poll.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={selectedOption !== null ? selectedOption.toString() : undefined}
          onValueChange={(value) => setSelectedOption(parseInt(value))}
          className="space-y-4"
        >
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option.text}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleVote}
          disabled={voteMutation.isPending}
        >
          {voteMutation.isPending ? "Submitting..." : "Submit Vote"}
        </Button>
      </CardFooter>
    </Card>
  );
}
