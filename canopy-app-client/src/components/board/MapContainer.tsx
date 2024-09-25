/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface MapContainerProps {
  data: any[]; // 실제 데이터 타입에 맞게 수정 필요
}

const MapContainer: React.FC<MapContainerProps> = ({ data }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        version: "weekly",
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
        }
      } catch (error) {
        console.error("Error loading Google Maps API:", error);
      }
    };

    initMap();
  }, []);

  useEffect(() => {
    if (map && data.length > 0) {
      renderMarkers(map, data);
    }
  }, [map, data]);

  const renderMarkers = (map: google.maps.Map, data: any[]) => {
    const geocoder = new google.maps.Geocoder();

    data.forEach((item) => {
      if (item.address) {
        geocoder.geocode({ address: item.address }, (results, status) => {
          if (
            status === google.maps.GeocoderStatus.OK &&
            results &&
            results[0]
          ) {
            const marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location,
              icon: {
                url: item.status.normal
                  ? "/images/ic_canopy_blue.png"
                  : "/images/ic_canopy_red.png",
                scaledSize: new google.maps.Size(18, 18),
              },
              title: item.status.normal ? "정상 작동 중" : "수신상태 불량",
            });
          }
        });
      }
    });
  };

  return <div ref={mapRef} className="w-full h-[600px]" />;
};

export default MapContainer;
