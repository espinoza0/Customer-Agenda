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


import '../App.css';


export default function NoticeCard({ visit, selectedState }) {
  const fileInputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    // Maneja el evento de cambio del archivo seleccionado
    console.log("Archivo seleccionado:", event.target.files);
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
                <DropdownMenuItem>Editar servicio</DropdownMenuItem>
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
            <Dialog className="">
              <DialogTrigger>
                <Images className="text-green-600 cursor-pointer" />
              </DialogTrigger>
              <DialogContent className="p-0 max-w-[40rem] overflow-hidden bg-black border-0 text-white min-h-[20rem]">
                <DialogHeader>
                  <DialogTitle className="text-center pt-4 opacity-75">
                    Aviso #{visit?.id} Galeria
                  </DialogTitle>
                </DialogHeader>

                {/* <GalleryNotice/> */}
                <Swiper
                  spaceBetween={10}
                  slidesPerView={1}
                  loop={true}
                  navigation
                  pagination={{ clickable: true }}
                  modules={[Navigation, Pagination]}
                  className="w-full h-full !text-center"
                >
                  {[...Array(3)].map((_, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src="https://sefhor.com/wp-content/uploads/diferencia-entre-encargado-obra-y-jefe-obra.jpg"
                        alt={`Imagen no disponible`}
                        className="w-full h-full object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </DialogContent>
            </Dialog>

            <input
              type="file"
              name=""
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
