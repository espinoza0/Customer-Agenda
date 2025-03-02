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

export default function AlertConfirmation({ client_id }) {
  const { fetchCustomers, removeClient } = useContext(AppContext);

  const handleRemoveClient = async () => {
    try {
      await removeClient(client_id);
      await fetchCustomers();

      return toast({
        variant: "success",
        title: "Éxito",
        description: "Cliente eliminado correctamente.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
      return toast({
        variant: "error",
        title: "Error",
        description: "No se pudo eliminar el cliente.",
        duration: 3000,
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <Trash2Icon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará los datos del usuario y todo lo que tenga que ver con este, documentos, facturas, etc. Estás seguro?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleRemoveClient}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
