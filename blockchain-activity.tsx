import { useQuery } from "@tanstack/react-query";
import { Block } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export function BlockchainActivity() {
  const { data: blocks, isLoading } = useQuery<Block[]>({
    queryKey: ['/api/blockchain/recent'],
  });

  const { data: verifyData } = useQuery<{ valid: boolean }>({
    queryKey: ['/api/blockchain/verify'],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blockchain Activity</CardTitle>
        <CardDescription>
          Recent votes confirmed on blockchain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="sm:flex sm:items-start mb-4">
          <div className="sm:flex-1">
            <div className="sm:flex sm:justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Latest Verified Votes</p>
                <div className="mt-1 text-sm text-gray-600">
                  Recent votes confirmed on blockchain
                </div>
              </div>
              <div>
                <Badge variant={verifyData?.valid ? "success" : "destructive"} className="flex gap-1 items-center">
                  <span className="h-2 w-2 bg-current rounded-full"></span>
                  {verifyData?.valid ? "Network Healthy" : "Verification Failed"}
                </Badge>
              </div>
            </div>
            
            <div className="mt-4 overflow-hidden space-y-3">
              {isLoading ? (
                <>
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </>
              ) : blocks && blocks.length > 0 ? (
                blocks.map((block, index) => {
                  const data = block.data as any;
                  return (
                    <div 
                      key={block.id}
                      className={cn(
                        "relative flex items-center rounded-md px-4 py-3 font-mono text-xs",
                        "bg-gradient-to-r from-primary-50/10 to-secondary-50/10 border-l-3 border-primary"
                      )}
                    >
                      <Shield className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-primary-800">
                        Vote ID: <span className="text-gray-700">
                          {block.hash.substring(0, 18)}...
                        </span> 
                        {data?.pollId > 0 && <> • Poll #{data.pollId}</>} • 
                        <span className="text-green-600"> ✓ Verified</span>
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500 py-4 text-center">
                  No blockchain activity yet
                </p>
              )}
            </div>
            
            <div className="mt-5 text-right">
              <a href="#" className="text-sm font-medium text-primary hover:text-primary/80">
                View all blockchain activity →
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
