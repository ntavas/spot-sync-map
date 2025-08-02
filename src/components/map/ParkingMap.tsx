import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface ParkingSpot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'available' | 'occupied';
  lastUpdated: Date;
}

interface ParkingMapProps {
  city: string;
  darkMode?: boolean;
}

// Mock parking data for demonstration
const mockParkingSpots: { [key: string]: ParkingSpot[] } = {
  Athens: [
    { id: '1', name: 'Syntagma Square Parking', lat: 37.9755, lng: 23.7348, status: 'available', lastUpdated: new Date() },
    { id: '2', name: 'Plaka Area Parking', lat: 37.9721, lng: 23.7279, status: 'occupied', lastUpdated: new Date() },
    { id: '3', name: 'Monastiraki Parking', lat: 37.9759, lng: 23.7258, status: 'available', lastUpdated: new Date() },
    { id: '4', name: 'National Garden Parking', lat: 37.9741, lng: 23.7372, status: 'occupied', lastUpdated: new Date() },
    { id: '5', name: 'Acropolis Museum Parking', lat: 37.9681, lng: 23.7279, status: 'available', lastUpdated: new Date() },
  ],
  Larissa: [
    { id: '6', name: 'Central Square Parking', lat: 39.6390, lng: 22.4194, status: 'available', lastUpdated: new Date() },
    { id: '7', name: 'Railway Station Parking', lat: 39.6367, lng: 22.4198, status: 'occupied', lastUpdated: new Date() },
    { id: '8', name: 'University Parking', lat: 39.6203, lng: 22.4006, status: 'available', lastUpdated: new Date() },
    { id: '9', name: 'Shopping Center Parking', lat: 39.6342, lng: 22.4105, status: 'occupied', lastUpdated: new Date() },
    { id: '10', name: 'Hospital Parking', lat: 39.6298, lng: 22.4234, status: 'available', lastUpdated: new Date() },
  ]
};

// City coordinates for map centering
const cityCoordinates = {
  Athens: { lat: 37.9755, lng: 23.7348, zoom: 13 },
  Larissa: { lat: 39.6390, lng: 22.4194, zoom: 13 }
};

export const ParkingMap = ({ city, darkMode = false }: ParkingMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const cityConfig = cityCoordinates[city as keyof typeof cityCoordinates];
    if (!cityConfig) return;

    // Create map instance
    const map = L.map(mapRef.current).setView([cityConfig.lat, cityConfig.lng], cityConfig.zoom);

    // Add tile layer with dark mode support
    const tileUrl = darkMode 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, {
      attribution: '© OpenStreetMap contributors, © CartoDB',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [city, darkMode]);

  // Load parking spots data
  useEffect(() => {
    const spots = mockParkingSpots[city] || [];
    setParkingSpots(spots);
  }, [city]);

  // Update markers when parking spots change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    parkingSpots.forEach(spot => {
      const isAvailable = spot.status === 'available';
      
      // Create custom icon based on status
      const iconHtml = `
        <div style="
          background-color: ${isAvailable ? '#10b981' : '#ef4444'};
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 8px;
            height: 8px;
            background-color: white;
            border-radius: 50%;
          "></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-parking-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([spot.lat, spot.lng], { icon: customIcon });
      
      // Add popup with spot information
      const statusColor = isAvailable ? '#10b981' : '#ef4444';
      const statusText = isAvailable ? 'Available' : 'Occupied';
      
      marker.bindPopup(`
        <div style="padding: 8px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">
            ${spot.name}
          </h3>
          <div style="
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
          ">
            <div style="
              width: 12px;
              height: 12px;
              background-color: ${statusColor};
              border-radius: 50%;
            "></div>
            <span style="
              font-weight: 500;
              color: ${statusColor};
            ">${statusText}</span>
          </div>
          <div style="
            font-size: 12px;
            color: #666;
          ">
            Last updated: ${spot.lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      `);

      marker.addTo(mapInstanceRef.current!);
      markersRef.current.push(marker);
    });
  }, [parkingSpots]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setParkingSpots(prev => prev.map(spot => {
        // Randomly change status for some spots
        if (Math.random() < 0.1) { // 10% chance to change status
          return {
            ...spot,
            status: spot.status === 'available' ? 'occupied' : 'available',
            lastUpdated: new Date()
          };
        }
        return spot;
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ minHeight: '500px' }}
      />
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm border rounded-lg p-3 shadow-elegant">
        <h4 className="font-medium text-sm mb-2">Parking Status</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-destructive"></div>
            <span>Occupied</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm border rounded-lg p-3 shadow-elegant">
        <div className="flex space-x-4 text-sm">
          <div className="text-center">
            <div className="font-medium text-success">
              {parkingSpots.filter(spot => spot.status === 'available').length}
            </div>
            <div className="text-muted-foreground">Available</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-destructive">
              {parkingSpots.filter(spot => spot.status === 'occupied').length}
            </div>
            <div className="text-muted-foreground">Occupied</div>
          </div>
          <div className="text-center">
            <div className="font-medium">
              {parkingSpots.length}
            </div>
            <div className="text-muted-foreground">Total</div>
          </div>
        </div>
      </div>
    </div>
  );
};