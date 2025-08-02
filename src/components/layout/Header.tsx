import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChangeLocationModal } from "@/components/modals/ChangeLocationModal";
import { Moon, Sun, MapPin, Lock, Phone, Palette, LogOut } from "lucide-react";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  photo?: string;
}

interface HeaderProps {
  user: User;
  currentCity: string;
  onCityChange: (city: string) => void;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header = ({ 
  user, 
  currentCity, 
  onCityChange, 
  onLogout, 
  darkMode, 
  onToggleDarkMode 
}: HeaderProps) => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const userInitials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <>
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50 h-[10vh]">
        <div className="container mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                SmartPark
              </h1>
            </div>

            {/* About Us */}
            <div className="flex items-center">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                About Us
              </Button>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      {user.photo ? (
                        <AvatarImage src={user.photo} alt={user.firstName} />
                      ) : null}
                      <AvatarFallback className="bg-gradient-primary text-white font-medium">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Lock className="mr-2 h-4 w-4" />
                    <span>Change Password</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowLocationModal(true)}>
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>Change Location</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Phone className="mr-2 h-4 w-4" />
                    <span>Change Phone Number</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onToggleDarkMode}>
                    <Palette className="mr-2 h-4 w-4" />
                    <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <ChangeLocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        currentLocation={currentCity}
        onLocationChange={onCityChange}
      />
    </>
  );
};