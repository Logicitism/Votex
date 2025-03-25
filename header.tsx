import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Bell, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", path: "/" },
  { name: "My Polls", path: "/my-polls" },
  { name: "Vote", path: "/vote" },
  { name: "Results", path: "/results" }
];

export function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <div className="h-8 w-8 bg-primary rounded flex items-center justify-center mr-2 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </Link>
              <Link href="/">
                <span className="text-primary-800 font-bold text-xl cursor-pointer">Votex</span>
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <a className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location === item.path ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}>
                    {item.name}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
          
          {user ? (
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Button variant="ghost" size="icon" className="mr-2">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary-200 text-primary-800">
                        {user?.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="font-medium">
                    {user?.username}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/my-polls">My Polls</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/create-poll">Create Poll</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden sm:flex sm:items-center">
              <Link href="/auth">
                <Button>Sign In</Button>
              </Link>
            </div>
          )}
          
          <div className="-mr-2 flex items-center sm:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="space-y-4 py-4">
                  <div className="px-4 space-y-1">
                    {navItems.map((item) => (
                      <Link key={item.path} href={item.path}>
                        <Button
                          variant={location === item.path ? "default" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.name}
                        </Button>
                      </Link>
                    ))}
                  </div>
                  {user && (
                    <>
                      <div className="px-4 pt-2">
                        <div className="flex items-center gap-2 py-2">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary-200 text-primary-800">
                              {user?.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{user.username}</p>
                          </div>
                        </div>
                        <div className="space-y-1 pt-2">
                          <Link href="/create-poll">
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => setMobileOpen(false)}
                            >
                              Create Poll
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                              handleLogout();
                              setMobileOpen(false);
                            }}
                          >
                            Logout
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
