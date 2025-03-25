import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import CreatePoll from "@/pages/create-poll";
import Vote from "@/pages/vote";
import PollDetails from "@/pages/poll-details";
import MyPolls from "@/pages/my-polls";
import ResultsPage from "@/pages/results-page";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Dashboard} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/create-poll" component={CreatePoll} />
      <ProtectedRoute path="/vote" component={Vote} />
      <ProtectedRoute path="/poll/:id" component={PollDetails} />
      <ProtectedRoute path="/my-polls" component={MyPolls} />
      <ProtectedRoute path="/results" component={ResultsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
