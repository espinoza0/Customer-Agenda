import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle
} from "@/components/ui/drawer";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useState } from "react";

import { Calendar } from "@/components/ui/calendar"
import { Calendar1 } from "lucide-react";
import { es } from "date-fns/locale"
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { useMediaQuery } from "@uidotdev/usehooks";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

import { TimePicker } from "../time-picker/time-picker";
import { DrawerFooter } from "../ui/drawer";
import { useToast } from "../../hooks/use-toast";
import { DialogFooter } from "../ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";

export default function SetNoticeDrawer({customer}) {
  const {toast} =  useToast()
  
  const [isOpen, setIsOpen] = useState(false)
  const [fecha, setFecha] = useState('')
  const [lugar, setLugar] = useState(customer?.address || '')

  const [observaciones, setObservaciones] = useState('')
  const isDesktop = useMediaQuery("(min-width: 768px)")
  

  
  const handleCrearAviso = () => {
    // console.log(fecha, lugar, observaciones)
    if (!fecha || !lugar) {
        return toast({
          variant: "destructive",
          title: "Completa todos los campos!.",
          duration: 3000
        })
    }

    setFecha('')
    setObservaciones('')
    setIsOpen(false)

    return toast({
        variant: "success",
        title: "Éxito",
        description: "Aviso creado correctamente",
        duration: 3000, // Duración en milisegundos
    })
  }


  return (
    <>
        {isDesktop ? (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button>
                        {/* Agendar */}
                        <Calendar1/>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Agendar Visita - {customer?.name + ' ' + customer?.surname}</DialogTitle>
                        <DialogDescription>Selecciona fecha, hora y lugar para la visita</DialogDescription>
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
                            <TimePicker setDate={setFecha} date={fecha || new Date()}/>
                        </div>
                        <div className="grid gap-2 ">
                            <Label htmlFor="lugar" className="text-sm font-medium">Lugar: </Label>
                            <Select onValueChange={setLugar} defaultValue={customer?.address}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un lugar" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={customer?.address}>{customer?.address}</SelectItem>
                                    <SelectItem value={'custom'}>
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
        ):(
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger>
                <Button>
                    Agendar
                    <Calendar1/>
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                <DrawerTitle>Agendar Visita - {customer?.name + ' ' + customer?.surname}</DrawerTitle>
                </DrawerHeader>
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
                        <TimePicker setDate={setFecha} date={fecha || new Date()}/>
                    </div>
                    <div className="grid gap-2 ">
                        <Label htmlFor="lugar" className="text-sm font-medium">Lugar: </Label>
                        <Select onValueChange={setLugar} defaultValue={customer?.address}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un lugar" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={customer?.address}>{customer?.address}</SelectItem>
                                <SelectItem value={'custom'}>
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
                <DrawerFooter className={"border"}>
                    <Button onClick={() => handleCrearAviso()}>Crear Aviso</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
        )   
    }
    </>
  )
}
