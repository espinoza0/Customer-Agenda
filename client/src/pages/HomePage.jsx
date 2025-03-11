import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircleIcon, Search } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  Drawer,
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
import { useMediaQuery } from "@uidotdev/usehooks";

import CustomerCard from "@/components/CustomerCard";
import CustomerForm from "@/components/CustomerForm";
import { toast } from "../hooks/use-toast";
import { AppContext } from "../context/AppContext";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const CommonComponent = ({ setIsOpen, customers }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState(customers);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    setFilteredCustomers(
      customers.filter((customer) => {
        if (searchQuery.trim() === "") {
          return customer;
        }
        const fullName = `${customer.name} ${customer.surname}`;

        return (
          customer.name
            .toLowerCase()
            .trim()
            .includes(searchQuery.toLowerCase().trim()) ||
          customer.surname
            .toLowerCase()
            .trim()
            .includes(searchQuery.toLowerCase().trim()) ||
          fullName
            .toLowerCase()
            .trim()
            .includes(searchQuery.toLowerCase().trim()) ||
          customer.address
            .toLowerCase()
            .trim()
            .includes(searchQuery.toLowerCase().trim()) ||
          customer.phone
            .toLowerCase()
            .trim()
            .includes(searchQuery.toLowerCase().trim()) ||
          customer.email
            .toLowerCase()
            .trim()
            .includes(searchQuery.toLowerCase().trim())
        );
      })
    );
  }, [customers, searchQuery]);

  return (
    <>
      <Navbar />
      <section className="">
        <div className="flex items-center justify-center max-w-[45rem] mx-auto p-3 gap-2 mb-10 flex-wrap">
          <div className="relative flex items-center w-full rounded-lg">
            <Input
              type="search"
              placeholder="Search"
              className="w-full pl-10 font-semibold"
              value={searchQuery}
              onChange={handleSearch}
            />
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          <Button onClick={() => setIsOpen(true)} className="flex-1">
            <PlusCircleIcon />
            <p>Añadir Cliente</p>
          </Button>
        </div>

        {/* clientes */}
        {filteredCustomers.length > 0 && (
          <div className="flex flex-col gap-5  max-w-[45rem] w-full mx-auto p-3">
            {filteredCustomers.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

// schema
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

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { customers, fetchCustomers, addCustomer } = useContext(AppContext);

  const form = useForm({
    resolver: zodResolver(customerSchema),
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await addCustomer(data);
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

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <>
      <CommonComponent setIsOpen={setIsOpen} customers={customers} />

      {isDesktop ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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

              // if we click an autocomplete item, prevent the default onInteractOutside action, to close
              if (hasPacItem) {
                e.preventDefault();
              }
            }}
          >
            <DialogHeader>
              <DialogTitle>Introduce los datos del Cliente</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <CustomerForm handleSubmit={handleSubmit} form={form} />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Introduce los datos del Cliente</DrawerTitle>
            </DrawerHeader>
            <CustomerForm handleSubmit={handleSubmit} form={form} />
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
