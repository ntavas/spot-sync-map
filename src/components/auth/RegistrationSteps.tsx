import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff, Camera, Upload } from "lucide-react";

interface RegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  phoneNumber: string;
  location: string;
  photo?: string;
}

interface RegistrationStepsProps {
  onRegister: (data: RegistrationData) => void;
  onSwitchToLogin: () => void;
}

const countries = [
  { code: "+30", name: "Greece", flag: "🇬🇷" },
  { code: "+1", name: "United States", flag: "🇺🇸" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+33", name: "France", flag: "🇫🇷" },
];

const locations = ["Larissa", "Athens"];

export const RegistrationSteps = ({ onRegister, onSwitchToLogin }: RegistrationStepsProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<RegistrationData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    countryCode: "+30",
    phoneNumber: "",
    location: "",
    photo: undefined,
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onRegister(formData);
  };

  const updateFormData = (field: keyof RegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const stepTitles = [
    "Account Setup",
    "Personal Information", 
    "Contact Details",
    "Location Preference",
    "Profile Picture"
  ];

  const stepDescriptions = [
    "Create your account credentials",
    "Tell us about yourself",
    "How can we reach you?",
    "Choose your city",
    "Add your profile picture"
  ];

  return (
    <Card className="w-full max-w-md shadow-elegant">
      <CardHeader className="space-y-4">
        <div className="text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>{stepDescriptions[currentStep - 1]}</CardDescription>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

      </CardHeader>

      <CardContent className="space-y-4">
        {/* Step 1: Email & Password */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Names */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Your first name"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Your last name"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Phone */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country & Code</Label>
              <Select
                value={formData.countryCode}
                onValueChange={(value) => updateFormData('countryCode', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      <span className="flex items-center space-x-2">
                        <span>{country.flag}</span>
                        <span>{country.name} {country.code}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex space-x-2">
                <div className="flex items-center px-3 py-2 border border-input rounded-md bg-muted text-sm">
                  {formData.countryCode}
                </div>
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="123 456 7890"
                    value={formData.phoneNumber}
                    onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Location */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">Your City</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                <Select
                  value={formData.location}
                  onValueChange={(value) => updateFormData('location', value)}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Choose your city" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Photo */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="photo">Profile Picture</Label>
              <div className="flex flex-col items-center space-y-4">
                {formData.photo ? (
                  <img 
                    src={formData.photo} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover border-2 border-primary/20"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-muted/50 border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            updateFormData('photo', e.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      };
                      input.click();
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateFormData('photo', '')}
                  >
                    Skip for now
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg bg-muted/50 p-4">
              <h4 className="font-medium text-sm mb-2">Registration Summary</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Email: {formData.email}</p>
                <p>Name: {formData.firstName} {formData.lastName}</p>
                <p>Phone: {formData.countryCode} {formData.phoneNumber}</p>
                <p>Location: {formData.location}</p>
                <p>Photo: {formData.photo ? 'Added' : 'Not provided'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          {currentStep > 1 ? (
            <Button variant="outline" onClick={prevStep}>
              Previous
            </Button>
          ) : (
            <Button variant="ghost" onClick={onSwitchToLogin}>
              Back to Login
            </Button>
          )}

          {currentStep < totalSteps ? (
            <Button onClick={nextStep} variant="gradient">
              Next Step
            </Button>
          ) : (
            <Button onClick={handleSubmit} variant="gradient">
              Create Account
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};