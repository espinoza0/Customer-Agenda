import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@uidotdev/usehooks";
// import { DrawerClose, DrawerDescription, DrawerFooter } from "./ui/drawer";
import { useRef, useState } from "react";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { Camera, RotateCcw, Upload } from "lucide-react";
import { DialogFooter } from "./ui/dialog";
import { toast } from "../hooks/use-toast";
import { DrawerFooter } from "./ui/drawer";
import { format } from "date-fns";

// const BACKEND_URL = "http://localhost:3000"; //desarrollo
const BACKEND_URL = "http://192.168.1.128:3000"; //desarrollo

export default function UploadImageNotice({ visit }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false)

  const fileInputRef = useRef(null);

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

    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
    setSelectedFile(file);
  };

  const uploadToCloudinary = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Services"); //  preset de subida

    try {
      const cloud = import.meta.env.VITE_CLOUD_NAME
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error al subir la imagen a Cloudinary");
      }

      const data = await response.json();
      // setCloudinaryUrl(data?.secure_url); // URL de la imagen subida a Cloudinary.   
      return data.secure_url; // URL de la imagen subida

    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };


  const handleUploadConfirm = async () => {
    setIsLoading(true)
    try {
      const url = await uploadToCloudinary(selectedFile); 

      const response = await fetch(`${BACKEND_URL}/photos/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visit_id: visit?.id,
          client_id: visit?.client_id,
          url: url,
        }),
      });

      if (response.ok) {
        setIsLoading(false)
        const result = await response.json();
        console.log("Archivo subido exitosamente:", result);

        // Reset state
        setIsUploadDialogOpen(false);
        setPreviewImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        return toast({
          variant: "success",
          title: "Éxito",
          description: "Imagen subida correctamente.",
          duration: 3000,
        });
      }
    } catch (error) {
      setIsLoading(false)
      console.error("Error:", error);
      return toast({
        variant: "destructive",
        title: "Advertencia",
        description: "No se pudo subir la imagen.",
        duration: 3000,
      });
    }
  };

  const handleRetakePhoto = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  return (
    <>
      {isDesktop ? (
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger>
            <Camera className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center">Subir Imagen</DialogTitle>
            </DialogHeader>
            <div className="rounded-lg bg-slate-100 p-4">
              <p className="font-semibold text-gray-900">
                Detalles del servicio: #{visit?.id}
              </p>
              <p className="text-gray-700 mt-2">
                <span className="font-semibold">Cliente</span>:{" "}
                {visit?.client_name}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Fecha</span>:{" "}
                {format(visit?.date, "dd/MM/yyyy HH:mm:ss")}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Observaciones</span>:{" "}
                {visit?.observations}
              </p>
            </div>

            <div className="rounded-lg border-2 border-dashed cursor-pointer border-gray-300 bg-slate-100 text-gray-600 h-64 w-full relative overflow-hidden">
              {previewImage ? (
                <div className="absolute inset-0">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={handleRetakePhoto}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-200 transition duration-200"
                  >
                    <RotateCcw className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={handleCameraClick}
                  className="flex flex-col justify-center items-center h-full"
                >
                  <Upload size={35} />
                  <p>Haz click para escoger o subir una imagen</p>
                </div>
              )}

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

            <DialogFooter className={"flex items-center"}>
              <Button
                className="flex-1"
                onClick={() => setIsUploadDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleUploadConfirm}
                className="flex-1 disabled:opacity-35"
                disabled={!selectedFile || isLoading}
              >
                Guardar Imagen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DrawerTrigger>
            <Camera className="cursor-pointer" />
          </DrawerTrigger>
          <DrawerContent className="p-3">
            <DrawerHeader>
              <DrawerTitle className="text-center">Subir Imagen</DrawerTitle>
            </DrawerHeader>
            <div className="rounded-lg bg-slate-100 p-4">
              <p className="font-semibold text-gray-900">
                Detalles del servicio: #{visit?.id}
              </p>
              <p className="text-gray-700 mt-2">
                <span className="font-semibold">Cliente</span>:{" "}
                {visit?.client_name}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Fecha</span>:{" "}
                {format(visit?.date, "dd/MM/yyyy HH:mm:ss")}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Observaciones</span>:{" "}
                {visit?.observations}
              </p>
            </div>

            <div className="rounded-lg border-2 border-dashed cursor-pointer border-gray-300 bg-slate-100 text-gray-600 h-64 w-full relative overflow-hidden">
              {previewImage ? (
                <div className="absolute inset-0">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={handleRetakePhoto}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-200 transition duration-200"
                  >
                    <RotateCcw className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={handleCameraClick}
                  className="flex flex-col justify-center items-center h-full"
                >
                  <Upload size={35} />
                  <p>Haz click para escoger o subir una imagen</p>
                </div>
              )}

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

            <DrawerFooter className="grid grid-cols-2 items-center">
              <Button onClick={() => setIsUploadDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleUploadConfirm}
                className="disabled:opacity-35"
                disabled={!selectedFile || isLoading}
              >
                Guardar Imagen
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
