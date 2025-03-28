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
      field.onChange(place?.formatted_address);
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
          z-index: 50;
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

// import { useState, useEffect, useRef } from "react";
// import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";

// const API_KEY = import.meta.env.VITE_API_KEY ?? "YOUR_API_KEY";

// const PlaceAutocomplete = ({ field }) => {
//   const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
//   const inputRef = useRef(null);
//   const places = useMapsLibrary("places");

//   useEffect(() => {
//     if (!places || !inputRef.current) return;

//     const options = {
//       fields: ["geometry", "name", "formatted_address"],
//       types: ["address"],
//       componentRestrictions: { country: "es" },
//     };

//     setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
//   }, [places]);

//   useEffect(() => {
//     if (!placeAutocomplete) return;

//     placeAutocomplete.addListener("place_changed", () => {
//       const place = placeAutocomplete.getPlace();
//       field.onChange(place.formatted_address); // Actualiza el valor del formulario
//     });
//   }, [field, placeAutocomplete]);

//   // Permitir clics en las sugerencias
//   useEffect(() => {
//     const handleClick = (e) => {
//       const target = e.target;
//       // Verifica si el clic ocurrió en una sugerencia (pac-item)
//       if (target.matches(".pac-item") || target.closest(".pac-item")) {
//         setTimeout(() => {
//           const input = inputRef.current;
//           field.onChange(input.value); // Actualiza el valor del formulario
//         }, 100);
//       }
//     };

//     document.addEventListener("click", handleClick, true);
//     return () => document.removeEventListener("click", handleClick, true);
//   }, [field]);

//   return (
//     <div className="autocomplete-container z-20">
//       <input
//         ref={inputRef}
//         placeholder="Enter a location"
//         value={field.value || ""}
//         onChange={(e) => field.onChange(e.target.value)} // Sincroniza cambios manuales con el formulario
//         style={{
//           width: "100%",
//           padding: "10px",
//           borderRadius: "4px",
//           border: "1px solid #ccc",
//         }}
//       />
//     </div>
//   );
// };

// const AutocompleteWidget = ({ field }) => {
//   // this is needed to allow pointer events to go through, used to fix the google autocomplete input
//   useEffect(() => {
//     setTimeout(() => (document.body.style.pointerEvents = ''), 0);
//   }, []);

//   return (
//     <APIProvider
//       apiKey={API_KEY}
//       solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
//     >
//       <PlaceAutocomplete field={field} />
//     </APIProvider>
//   );
// };

// export default AutocompleteWidget;
