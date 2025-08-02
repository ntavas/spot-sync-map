import { useState, useEffect } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegistrationSteps } from "@/components/auth/RegistrationSteps";
import { ParkingMap } from "@/components/map/ParkingMap";
import { Header } from "@/components/layout/Header";
import { toast } from "@/hooks/use-toast";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  phone: string;
}

interface RegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  phoneNumber: string;
  location: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [currentCity, setCurrentCity] = useState<string>("Athens");
  const [darkMode, setDarkMode] = useState(false);

  // Check for system dark mode preference on load
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = (email: string, password: string) => {
    // Mock login - in real app this would call an API
    const mockUser: User = {
      firstName: "Demo",
      lastName: "User", 
      email: email,
      location: "Athens",
      phone: "+30 123 456 7890"
    };
    
    setUser(mockUser);
    setCurrentCity(mockUser.location);
    toast({
      title: "Welcome back!",
      description: "You've successfully signed in to SmartPark.",
    });
  };

  const handleRegister = (data: RegistrationData) => {
    // Mock registration - in real app this would call an API
    const newUser: User = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      location: data.location,
      phone: `${data.countryCode} ${data.phoneNumber}`
    };
    
    setUser(newUser);
    setCurrentCity(newUser.location);
    setShowRegistration(false);
    toast({
      title: "Account created!",
      description: "Welcome to SmartPark. Start finding parking spots now!",
    });
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentCity("Athens");
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
  };

  const handleCityChange = (city: string) => {
    setCurrentCity(city);
    toast({
      title: "City changed",
      description: `Now showing parking spots in ${city}`,
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // If user is logged in, show the main app
  if (user) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          user={user}
          currentCity={currentCity}
          onCityChange={handleCityChange}
          onLogout={handleLogout}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
        <main className="container mx-auto px-4 py-6">
          <div className="h-[calc(100vh-140px)]">
            <ParkingMap city={currentCity} darkMode={darkMode} />
          </div>
        </main>
      </div>
    );
  }

  // If not logged in, show auth interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {showRegistration ? (
          <RegistrationSteps
            onRegister={handleRegister}
            onSwitchToLogin={() => setShowRegistration(false)}
          />
        ) : (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToRegister={() => setShowRegistration(true)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
