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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useContext, useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import { Calendar1 } from "lucide-react";
import { es } from "date-fns/locale";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { useMediaQuery } from "@uidotdev/usehooks";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { TimePicker } from "../time-picker/time-picker";
import { DrawerFooter } from "../ui/drawer";
import { useToast } from "../../hooks/use-toast";
import { DialogFooter } from "../ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { AppContext } from "../../context/AppContext";
import { format } from "date-fns";

export default function SetNoticeDrawer({ customer }) {
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [fecha, setFecha] = useState("");
  const [lugar, setLugar] = useState(customer?.address || "");

  const [observaciones, setObservaciones] = useState("");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { addVisit } = useContext(AppContext);

  const handleCrearAviso = async () => {
    if (!fecha || !lugar || observaciones.trim().length == 0) {
      return toast({
        variant: "destructive",
        title: "Completa todos los campos para insertar.",
        duration: 3000,
      });
    }
    
    // insertar aviso en base de datos
    const data = {
      date: format(fecha,'yyyy-MM-dd HH:mm:ss'),
      observations: observaciones,
      address: lugar,
      client_id: customer.id
    };

    const success = await addVisit(data);

    if (!success) { 
      return toast({
        variant: "destructive",
        title: "Advertencia",
        description: "No se pudo crear el aviso para este cliente.",
        duration: 3000,
      });
    }
    
    setFecha("");
    setObservaciones("");
    setIsOpen(false);

    return toast({
      variant: "success",
      title: "Éxito",
      description: "Aviso creado correctamente",
      duration: 3000,
    });

  };

  return (
    <>
      {isDesktop ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-green-800 w-full">
              Agendar
              <Calendar1 />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                Agendar Visita - {customer?.name + " " + customer?.surname}
              </DialogTitle>
              <DialogDescription>
                Selecciona fecha, hora y lugar para la visita
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 p-4">
              <div className="flex items-center flex-col">
                <Calendar
                  mode="single"
                  selected={fecha}
                  onSelect={setFecha}
                  locale={es}
                  className="rounded-md border p-3"
                />
              </div>
              <div className="flex justify-center">
                <TimePicker setDate={setFecha} date={fecha || new Date()} />
              </div>
              <div className="grid gap-2 ">
                <Label htmlFor="lugar" className="text-sm font-medium">
                  Lugar:{" "}
                </Label>
                <Select
                  value={lugar}
                  onValueChange={setLugar}
                  defaultValue={customer?.address || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un lugar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={customer?.address}>
                      {customer?.address}
                    </SelectItem>
                    <SelectItem value={"custom"}>
                      Selecciona otro lugar
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="observaciones">Observaciones: </Label>
                <Textarea
                  id="observaciones"
                  placeholder="Añade cualquier observación o detalle adicional aquí"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => handleCrearAviso()}>Crear Aviso</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button className="rounded-full bg-green-800 w-full">
              Agendar
              <Calendar1 />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[85vh] flex flex-col">
            <DrawerHeader className="flex-shrink-0">
              <DrawerTitle>
                Agendar Visita - {customer?.name + " " + customer?.surname}
              </DrawerTitle>
            </DrawerHeader>
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              <div className="flex items-center justify-center">
                <Calendar
                  mode="single"
                  selected={fecha}
                  onSelect={setFecha}
                  locale={es}
                  className="rounded-md border p-3 w-full max-w-[300px]"
                />
              </div>
              <div className="flex justify-center">
                <TimePicker setDate={setFecha} date={fecha || new Date()} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lugar" className="text-sm font-medium">
                  Lugar:{" "}
                </Label>
                <Select
                  value={lugar}
                  onValueChange={setLugar}
                  defaultValue={customer?.address || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un lugar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={customer?.address}>
                      {customer?.address}
                    </SelectItem>
                    <SelectItem value={"custom"}>
                      Selecciona otro lugar
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="observaciones">Observaciones: </Label>
                <Textarea
                  id="observaciones"
                  placeholder="Añade cualquier observación o detalle adicional aquí"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                />
              </div>
            </div>
            <DrawerFooter className="flex-shrink-0 border-t">
              <Button onClick={() => handleCrearAviso()} className="w-full">
                Crear Aviso
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
