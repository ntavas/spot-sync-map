import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";

interface ChangeLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: string;
  onLocationChange: (location: string) => void;
}

const locations = ["Larissa", "Athens"];

export const ChangeLocationModal = ({ 
  isOpen, 
  onClose, 
  currentLocation, 
  onLocationChange 
}: ChangeLocationModalProps) => {
  const [selectedLocation, setSelectedLocation] = useState(currentLocation);

  const handleSave = () => {
    onLocationChange(selectedLocation);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Location</DialogTitle>
          <DialogDescription>
            Select your new city to update your parking preferences and see relevant parking spots.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="location">Choose your city</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
              <Select
                value={selectedLocation}
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Select a city" />
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

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="gradient">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};