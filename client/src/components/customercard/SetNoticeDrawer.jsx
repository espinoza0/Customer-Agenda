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

import { useContext, useEffect, useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import { Calendar1, Edit } from "lucide-react";
import { es } from "date-fns/locale";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useMediaQuery } from "@uidotdev/usehooks";

import { TimePicker } from "../time-picker/time-picker";
import { toast } from "../../hooks/use-toast";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { AppContext } from "../../context/AppContext";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AutocompleteWidget from "../AutocompleteWidget";

const formSchema = z.object({
  date: z.date({
    required_error: "La fecha es requerida",
  }),
  address: z.string().min(1, "El lugar es requerido"),
  observations: z
    .string()
    .min(5, "Las observaciones deben tener al menos 5 caracteres"),
});

export default function SetNoticeDrawer({ customer, visit = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { addVisit, editVisit, fetchVisits, selectedState } =
    useContext(AppContext);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: visit?.date ? new Date(visit.date) : new Date(),
      address: visit?.address || customer?.address || "",
      observations: visit?.observations || "",
    },
  });

  const { handleSubmit, control } = form;

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        date: format(data?.date, "yyyy-MM-dd HH:mm:ss"),
        observations: data?.observations,
        address: data?.address,
        client_id: customer?.id,
        visit_id: visit?.id,
      };

      let success;

      if (visit) {
        // Editar
        console.log(formattedData);
        success = await editVisit(formattedData);
      } else {
        // Crear Aviso
        success = await addVisit(formattedData);
      }

      if (success) {
        form.reset();
        setIsOpen(false);

        await fetchVisits(visit?.client_id || customer?.id, selectedState);
        return toast({
          variant: "success",
          title: "Éxito",
          description: `Aviso ${visit ? "editado" : "creado"} correctamente`,
          duration: 3000,
        });
      }

      return toast({
        variant: "destructive",
        title: "Advertencia",
        description: `No se pudo ${
          visit ? "editar" : "crear"
        } el aviso para este cliente.`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error al crear/editar aviso:", error);
      return toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error inesperado. Inténtalo de nuevo.",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    if (visit) {
      form.reset({
        date: visit.date ? new Date(visit.date) : new Date(),
        address: visit.address || customer?.address || "",
        observations: visit.observations || "",
      });
    }
  }, [visit]);

  return (
    <>
      {isDesktop ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            {visit ? (
              <Edit className="text-blue-600 cursor-pointer" />
            ) : (
              <Button className="rounded-full bg-green-800 w-full">
                Agendar
                <Calendar1 />
              </Button>
            )}
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-[425px]"
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              const hasPacItem = e.composedPath().some((el) => {
                if ("classList" in el) {
                  return Array.from(el.classList).includes("pac-item");
                }
                return false;
              });

              if (hasPacItem) {
                e.preventDefault();
              }
            }}
          >
            <DialogHeader>
              <DialogTitle>
                {visit ? "Editar Visita" : "Agendar Visita"} -{" "}
                {!visit
                  ? customer?.name + " " + customer?.surname
                  : visit?.client_name}
              </DialogTitle>
              <DialogDescription>
                Selecciona fecha, hora y lugar para la visita
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-2">
                <FormField
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormControl>
                        <div className="space-y-2 flex items-center justify-center flex-col">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            locale={es}
                            className="rounded-md border"
                          />
                          <TimePicker
                            date={field.value}
                            setDate={field.onChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="address">Lugar</FormLabel>
                      <FormControl>
                        <AutocompleteWidget field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="observations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="observations">
                        Observaciones
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Añade cualquier observación o detalle adicional aquí"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  {visit ? "Actualizar Visita" : "Crear Visita"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            {visit ? (
              <Edit className="text-blue-600" />
            ) : (
              <Button className="rounded-full bg-green-800 w-full">
                Agendar
                <Calendar1 />
              </Button>
            )}
          </DrawerTrigger>
          <DrawerContent
            className="h-[85vh] flex flex-col sm:max-w-[425px]"
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              const hasPacItem = e.composedPath().some((el) => {
                if ("classList" in el) {
                  return Array.from(el.classList).includes("pac-item");
                }
                return false;
              });

              if (hasPacItem) {
                e.preventDefault();
              }
            }}
          >
            <DrawerHeader className="flex-shrink-0">
              <DrawerTitle>
                {visit ? "Editar Visita" : "Agendar Visita"} -{" "}
                {!visit
                  ? customer?.name + " " + customer?.surname
                  : visit?.client_name}
              </DrawerTitle>
            </DrawerHeader>
            <div className="flex-grow overflow-y-auto">
              <Form {...form}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 p-4"
                >
                  <FormField
                    control={control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormControl>
                          <div className="space-y-2 flex items-center justify-center flex-col">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              locale={es}
                              className="rounded-md border p-3"
                            />
                            <TimePicker
                              date={field.value}
                              setDate={field.onChange}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="address">Lugar</FormLabel>
                        <FormControl>
                          <AutocompleteWidget field={field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="observations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="observations">
                          Observaciones
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Añade cualquier observación o detalle adicional aquí"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    {visit ? "Actualizar Visita" : "Crear Visita"}
                  </Button>
                </form>
              </Form>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
