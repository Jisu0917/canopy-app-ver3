/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { renderMarkers } from "@/util/mapUtils";

interface MapContainerProps {
  data: any[]; // 실제 데이터 타입에 맞게 수정 필요
}

const MapContainer: React.FC<MapContainerProps> = ({ data }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        version: "weekly",
        libraries: ["marker"],
      });

      try {
        const google = await loader.load();
        if (mapRef.current) {
          const mapInstance = new google.maps.Map(mapRef.current, {
            center: { lat: 36.4, lng: 128.0 },
            zoom: 7,
            mapTypeControl: false,
            zoomControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            scaleControl: false,
            mapId: "f2127624e5047ea",
          });
          setMap(mapInstance);
          setGeocoder(new google.maps.Geocoder());
        }
      } catch (error) {
        console.error("Error loading Google Maps API:", error);
      }
    };

    initMap();
  }, []);

  useEffect(() => {
    if (map && geocoder && data.length > 0) {
      renderMarkers(map, geocoder, data);
    }
  }, [map, geocoder, data]);

  return <div ref={mapRef} className="w-full h-[600px]" />;
};

export default MapContainer;
