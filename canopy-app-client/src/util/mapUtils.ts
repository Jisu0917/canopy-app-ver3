/* eslint-disable @typescript-eslint/no-explicit-any */
import ic_canopy_blue from "@/assets/icons/ic_canopy_blue.ico";
import ic_canopy_red from "@/assets/icons/ic_canopy_red.ico";
import { CanopyModel } from "@/types/models";

export async function renderMarkers(
  map: google.maps.Map,
  geocoder: google.maps.Geocoder,
  data: CanopyModel[]
) {
  console.log("Rendering markers with data:", data);

  const { AdvancedMarkerElement } = (await google.maps.importLibrary(
    "marker"
  )) as google.maps.MarkerLibrary;

  data.forEach((item, index) => {
    if (item.data.location && item.data.location.address) {
      console.log(`Processing item ${index}:`, item);

      geocoder.geocode(
        { address: item.data.location.address },
        (results, status) => {
          console.log(
            `Geocoding result for ${item.data.location?.address}:`,
            status,
            results
          );

          if (
            status === google.maps.GeocoderStatus.OK &&
            results &&
            results[0]
          ) {
            const pos = results[0].geometry.location;

            const canopyFlagImg = document.createElement("img");
            canopyFlagImg.style.width = "18px";
            canopyFlagImg.style.height = "18px";
            canopyFlagImg.src = item.data.status_transmit
              ? ic_canopy_blue.src
              : ic_canopy_red.src;

            canopyFlagImg.onload = () => {
              console.log("Image loaded successfully");
              const marker = new AdvancedMarkerElement({
                map,
                position: pos,
                content: canopyFlagImg,
                title: item.data.status_transmit
                  ? "정상 작동 중"
                  : "수신상태 불량",
              });
              console.log("Marker created:", marker);
            };

            canopyFlagImg.onerror = () => {
              console.error("Failed to load image");
            };

            map.addListener("zoom_changed", () => {
              const zoom = map.getZoom();
              if (zoom !== undefined) {
                const size = 18 + (zoom - 7) * 1.5;
                canopyFlagImg.style.width = `${size}px`;
                canopyFlagImg.style.height = `${size}px`;
              }
            });
          } else {
            console.error(
              "주소 변환 실패:",
              item.data.location?.address,
              status
            );
          }
        }
      );
    } else {
      console.warn("Item has no valid location or address:", item);
    }
  });
}
