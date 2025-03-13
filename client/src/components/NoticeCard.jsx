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
import { useRef } from "react";

export default function NoticeCard({ visit, selectedState }) {
  const fileInputRef = useRef(null);

  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    // Maneja el evento de cambio del archivo seleccionado
    console.log("Archivo seleccionado:", event.target.files);
  };

  return (
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
          <Camera onClick={handleCameraClick} />
          <Images className="text-green-600" />

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
  );
}
