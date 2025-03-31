import { Input } from "@/components/ui/input";
import { usePlacesWidget } from "react-google-autocomplete";
import { useEffect, useRef } from "react";

const AutocompleteWidget = ({ field }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    setTimeout(() => (document.body.style.pointerEvents = ""), 0);
  }, []);

  const { ref: placesRef } = usePlacesWidget({
    apiKey: import.meta.env.VITE_API_KEY,
    onPlaceSelected: (place) => {
      console.log(place)
      field.onChange(place?.formatted_address);

      // const lat = place?.geometry?.location?.lat();
      // const lng = place?.geometry?.location?.lng();

      // console.log(lat, lng)
    },
    options: {
      types: ["address"],
      componentRestrictions: { country: "es" },
      fields: ["address_components", "formatted_address", "geometry"],
    },
  });

  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target;
      if (target.matches(".pac-item") || target.closest(".pac-item")) {
        setTimeout(() => {
          const input = placesRef.current;
          field.onChange(input.value);
        }, 100);
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [field]);



  return (
    <div ref={containerRef} className="relative">
      <style>{`
        .pac-container {
          z-index: 9999 !important;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          margin-top: 4px;
          background-color: white;
        }
        .pac-item {
          padding: 0.5rem 1rem;
          cursor: pointer;
        }
        .pac-item:hover {
          background-color: #f7fafc;
        }
        .pac-item-selected {
          background-color: #f7fafc;
        }
      `}</style>
      <Input
        ref={placesRef}
        onChange={(e) => field.onChange(e.target.value)}
        value={field.value || ""}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        className="w-full"
      />
    </div>
  );
};

export default AutocompleteWidget;
