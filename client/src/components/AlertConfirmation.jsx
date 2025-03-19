import { Trash2Icon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { toast } from "../hooks/use-toast";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function AlertConfirmation({client_id, visit_id =  null , type}) {
  const { fetchCustomers, removeClient, fetchVisits, removeVisit} = useContext(AppContext);

  const handleRemoveClient = async () => {
    try {
      const success = await removeClient(client_id);
      
      if (success) {
        await fetchCustomers();
        toast({
          variant: "success",
          title: "Éxito",
          description: "Cliente eliminado correctamente.",
          duration: 3000,
        });
      } else {
        throw new Error("No se pudo eliminar el cliente");
      }
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
      toast({
        variant: "error",
        title: "Error",
        description: error.message || "No se pudo eliminar el cliente.",
        duration: 3000,
      });
    }
  };
  

  const handleRemoveVisit = async () => {
    try {
      const success = await removeVisit(visit_id);
      if (success) {
        await fetchVisits(client_id)
        toast({
          variant: "success",
          title: "Éxito",
          description: "Visita eliminada correctamente.",
          duration: 3000,
        });
      }else{
        throw new Error("No se pudo eliminar el cliente");
      }

    } catch (error) {
      console.error("Error al eliminar la visita", error);
      toast({
        variant: "error",
        title: "Error",
        description: error.message || "No se pudo eliminar la visita.",
        duration: 3000,
      });
    }
  }

  const message = type === "client" ? "Esta acción no se puede deshacer. Esto eliminará los datos del usuario y todo lo que tenga que ver con este, documentos, facturas, etc. Estás seguro?" : "Esta acción eliminará la visita agendada."

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {type === "client" ? (
          <Button>
            <Trash2Icon />
          </Button>
        ): (
          <Trash2Icon className="text-red-600 cursor-pointer"/>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => type === "client" ? handleRemoveClient() : handleRemoveVisit()} className="!bg-red-600 hover:opacity-80 transition-opacity">
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
