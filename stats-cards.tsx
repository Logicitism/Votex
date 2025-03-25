import { useQuery } from "@tanstack/react-query";
import { BarChart2, Check, Clipboard, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsData {
  activePolls: number;
  totalParticipants: number;
  verifiedVotes: number;
  blockchainConfirmations: number;
}

export function StatsCards() {
  const { data, isLoading } = useQuery<StatsData>({
    queryKey: ['/api/stats'],
  });

  const stats = [
    {
      title: "Active Polls",
      value: data?.activePolls || 0,
      icon: <Clipboard className="h-6 w-6 text-primary" />,
      bgColor: "bg-primary-100",
    },
    {
      title: "Total Participants",
      value: data?.totalParticipants || 0,
      icon: <Users className="h-6 w-6 text-secondary-600" />,
      bgColor: "bg-secondary-100",
    },
    {
      title: "Verified Votes",
      value: data?.verifiedVotes || 0,
      icon: <Check className="h-6 w-6 text-green-600" />,
      bgColor: "bg-green-100",
    },
    {
      title: "Blockchain Confirmations",
      value: data ? `${data.blockchainConfirmations}%` : "0%",
      icon: <BarChart2 className="h-6 w-6 text-indigo-600" />,
      bgColor: "bg-indigo-100",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white overflow-hidden shadow">
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 ${stat.bgColor}`}>
                {stat.icon}
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.title}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
