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

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  // const [customers, setCustomers] = useState([
  //   // {
  //   //   id: 1,
  //   //   name: "María",
  //   //   surname: "García",
  //   //   address: "Calle Principal 123, 28001 Madrid",
  //   //   phone: "+34 612 345 678",
  //   //   email: "maria.garcia@email.com"
  //   // },
  //   // {
  //   //   id: 2,
  //   //   name: "Juan",
  //   //   surname: "Martínez",
  //   //   address: "Avenida de la Paz 45, 08001 Barcelona",
  //   //   phone: "+34 623 456 789",
  //   //   email: "juan.martinez@email.com"
  //   // },
  //   // {
  //   //   id: 3,
  //   //   name: "Ana",
  //   //   surname: "Rodríguez",
  //   //   address: "Plaza Mayor 7, 46001 Valencia",
  //   //   phone: "+34 634 567 890",
  //   //   email: "ana.rodriguez@email.com"
  //   // },
  //   // {
  //   //   id: 4,
  //   //   name: "Carlos",
  //   //   surname: "López",
  //   //   address: "Calle Sierpes 22, 41001 Sevilla",
  //   //   phone: "+34 645 678 901",
  //   //   email: "carlos.lopez@email.com"
  //   // },
  //   // {
  //   //   id: 5,
  //   //   name: "Elena",
  //   //   surname: "Sánchez",
  //   //   address: "Gran Vía 56, 50001 Zaragoza",
  //   //   phone: "+34 656 789 012",
  //   //   email: "elena.sanchez@email.com"
  //   // }
  // ]);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { customers, fetchCustomers, addCustomer } = useContext(AppContext);

  const form = useForm({});

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await addCustomer(data);
      await fetchCustomers();

      setIsOpen(false);
      form.reset();
      // retornar toast
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
          <DialogContent className="sm:max-w-[425px]">
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
