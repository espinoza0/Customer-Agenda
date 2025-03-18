import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, History, Home, Mail, MoreHorizontal, Phone, UserCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import SetNoticeDrawer from "./customercard/SetNoticeDrawer";
import AlertConfirmation from "./AlertConfirmation";
import { useNavigate } from "react-router-dom";
import EditCustomerModal from "./EditCustomerModal";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "../hooks/use-toast";
import { AppContext } from "../context/AppContext";

const customerSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),

  surname: z
    .string()
    .min(2, "Los apellidos deben tener al menos 2 caracteres")
    .max(50, "Los apellidos no pueden exceder 50 caracteres"),

  address: z
    .string()
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .max(100, "La dirección no puede exceder 100 caracteres"),

  email: z
    .string()
    .email("Por favor, introduce un email válido")
    .min(5, "El email debe tener al menos 5 caracteres")
    .max(50, "El email no puede exceder 50 caracteres"),

  phone: z
    .string()
    .min(9, "El número de teléfono debe tener al menos 9 dígitos")
    .max(15, "El número de teléfono no puede exceder 15 dígitos")
    .regex(
      /^\+?[0-9]+$/,
      "El número de teléfono solo debe contener dígitos y opcionalmente un signo '+' al inicio"
    ),
});

export default function CustomerCard({ customer }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false)
  const {editClient, fetchCustomers} = useContext(AppContext)

  const id = customer?.id

  const goToCustomerHistory = (id) => {
    navigate(`/history/${id}`);
  };

  const form = useForm({
    resolver: zodResolver(customerSchema),
  });


  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await editClient(id, data);
      await fetchCustomers();

      setIsOpen(false);
      form.reset();

      return toast({
        variant: "success",
        title: "Éxito",
        description: "Cliente añadido correctamente.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error al añadir cliente: ", error);
      return toast({
        variant: "error",
        title: "Error",
        description: "No se pudo añadir el cliente.",
        duration: 3000,
      });
    }
  });

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold w-fit flex items-center gap-3">
            <UserCircle/>
            {customer?.name + " " + customer?.surname}
          </CardTitle>
          <Popover>
            <PopoverTrigger>
              <MoreHorizontal />
            </PopoverTrigger>
            <PopoverContent className="max-w-[5rem]">
              <div className="flex flex-col justify-center items-center gap-3 w-full">
                <AlertConfirmation client_id={customer.id} type={"client"}/>
                <Button onClick={() => setIsOpen(true)}>
                  <Edit />
                </Button>
                <EditCustomerModal isOpen={isOpen} setIsOpen={setIsOpen} customer={customer} handleSubmit={handleSubmit} form={form}/>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-4">
          <Home className="h-5 w-5 text-gray-500" />
          <span>{customer?.address}</span>
        </div>
        <div className="flex items-center space-x-4">
          <Phone className="h-5 w-5 text-gray-500" />
          <span>{customer?.phone}</span>
        </div>
        <div className="flex items-center space-x-4">
          <Mail className="h-5 w-5 text-gray-500" />
          <span>{customer?.email}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
          <Button
            className="rounded-full w-full"
            onClick={() => goToCustomerHistory(customer?.id)}
          >
            Historial
            <History />
          </Button>

          <SetNoticeDrawer customer={customer} />
        </div>
      </CardContent>
    </Card>
  );
}
