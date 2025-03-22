import { Camera, Images, MoreVertical, UserCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { cn } from "../lib/utils";
import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "../App.css";
import SetNoticeDrawer from "./customercard/SetNoticeDrawer";
import AlertConfirmation from "./AlertConfirmation";
import { toast } from "../hooks/use-toast";

// const BACKEND_URL = "http://localhost:3000"; //desarrollo
const BACKEND_URL = "http://192.168.1.128:3000"; //desarrollo

export default function NoticeCard({ visit, selectedState }) {
  const fileInputRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    // Maneja el evento de cambio del archivo seleccionado
    const file = event.target.files[0];
    console.log("Archivo seleccionado:", file);

    const allowedExtensions = /(.jpg|.jpeg|.png|.heic)$/i;

    if (!allowedExtensions.exec(file.name)) {
      alert(
        "Por favor, selecciona un archivo con extensión .jpg, .jpeg, .png o .heic."
      );
      event.target.value = ""; // Limpia el input
      return false;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("visit_id", visit?.id);
    formData.append("client_id", visit?.client_id);

    try {
      const response = await fetch(`${BACKEND_URL}/photos/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Archivo subido exitosamente:", result);

        return toast({
          variant: "success",
          title: "Éxito",
          description: "Imagen subida correctamente.",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      return toast({
        variant: "destructive",
        title: "Advertencia",
        description: "No se pudo subir la imagen.",
        duration: 3000,
      });
    }
  };

  const getVisitPhotos = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${BACKEND_URL}/photos/getImages/${visit?.id}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setPhotos(data);
    } catch (error) {
      console.error("Error: ", error);
      setError("Failed to load images");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card
        key={visit.id}
        className={cn(
          "hover:shadow-lg transition-shadow",
          !visit.pending && !selectedState && "opacity-50"
        )}
      >
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <UserCircle />
              <span>{visit.client_name}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menú</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(visit.id)}
                >
                  Copiar ID del servicio
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Ver detalles</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            {format(visit?.date, "dd/MM/yyyy HH:mm:ss")}
          </p>
          <p className="mt-2">{visit.observations}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <span
            className={cn(
              "text-sm font-semibold rounded-full shadow-md px-3 py-1",
              !visit.pending
                ? "bg-green-600 text-white"
                : "bg-yellow-600 text-white"
            )}
          >
            {visit.pending ? "Pendiente" : "Realizada"}
          </span>

          <div className="flex gap-5">
            <Camera onClick={handleCameraClick} className="cursor-pointer" />
            <Dialog
              className=""
              onOpenChange={(open) => {
                if (open) {
                  getVisitPhotos();
                }
              }}
            >
              <DialogTrigger>
                <Images className="text-green-600 cursor-pointer" />
              </DialogTrigger>
              <DialogContent className="p-0 max-w-[40rem] overflow-hidden bg-black border-0 text-white min-h-[20rem]">
                <DialogHeader>
                  <DialogTitle className="text-center pt-4 opacity-75">
                    Aviso #{visit?.id} Galeria
                  </DialogTitle>
                </DialogHeader>
                {isLoading ? (
                  <div>Loading..</div>
                ) : error ? (
                  <div>Error</div>
                ) : (
                  <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    loop={true}
                    navigation
                    pagination={{ clickable: true }}
                    modules={[Navigation, Pagination]}
                    className="w-full h-full !text-center"
                  >
                    {photos?.map((photo) => (
                      <SwiperSlide key={photo?.id}>

                        <img
                          // src={`../../../server${photo?.url}`}
                          src={`${BACKEND_URL}${photo.url}`}
                          // alt={`Imagen no disponible`}
                          alt={`../../../server${photo?.url}`}
                          className="w-full h-full object-cover"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </DialogContent>
            </Dialog>

            <SetNoticeDrawer visit={visit} />

            <AlertConfirmation
              client_id={visit?.client_id}
              visit_id={visit?.id}
              type={"visit"}
            />

            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              id=""
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
            />
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
