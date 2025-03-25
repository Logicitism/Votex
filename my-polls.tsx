import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PollList } from "@/components/poll-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLocation } from "wouter";

export default function MyPolls() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                My Polls
              </h1>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Button onClick={() => navigate("/create-poll")}>
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                Create New Poll
              </Button>
            </div>
          </div>
          
          {user && (
            <PollList 
              userId={user.id}
              title="All Your Polls"
              description="Manage and view results for all polls you've created"
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
