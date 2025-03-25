import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PollForm } from "@/components/poll-form";

export default function CreatePoll() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Create New Poll
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Create a secure blockchain-verified poll. All votes will be recorded on the blockchain for maximum transparency and security.
            </p>
          </div>
          
          <PollForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
