import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircleIcon, Search } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
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
import { useMediaQuery } from "@uidotdev/usehooks";

import CustomerCard from "@/components/CustomerCard";
import CustomerForm from "@/components/CustomerForm";




const CommonComponent = ({ setIsOpen, customers}) => {
  return (
    <>
      <Navbar />
      <section className="">
        <div className="flex items-center justify-center max-w-[45rem] mx-auto p-3 gap-2 mb-10 flex-wrap">
          <div className="flex items-center w-full rounded-lg gap-5">
            <Search size={20} />
            <Input type="search" placeholder="Search" className="w-full font-semibold" />
          </div>
          <Button onClick={() => setIsOpen(true)} className='flex-1'>
            <PlusCircleIcon />
            <p>Añadir Cliente</p>
          </Button>
        </div>

      {/* clientes */}
      {
        customers.length > 0 && (
          <div className="flex flex-col gap-5  max-w-[45rem] w-full mx-auto p-3">
            {customers.map((customer, index) => (
              <CustomerCard 
                key={index}
                customer={customer}
              />
            ))}
          </div>
        )
      }
      </section>
    </>
  );
};

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "María",
      surname: "García",
      address: "Calle Principal 123, 28001 Madrid",
      phone: "+34 612 345 678", 
      email: "maria.garcia@email.com"
    },
    {
      id: 2,
      name: "Juan",
      surname: "Martínez",
      address: "Avenida de la Paz 45, 08001 Barcelona", 
      phone: "+34 623 456 789",
      email: "juan.martinez@email.com"
    },
    {
      id: 3,
      name: "Ana",
      surname: "Rodríguez",
      address: "Plaza Mayor 7, 46001 Valencia",
      phone: "+34 634 567 890",
      email: "ana.rodriguez@email.com"
    },
    {
      id: 4,
      name: "Carlos",
      surname: "López",
      address: "Calle Sierpes 22, 41001 Sevilla",
      phone: "+34 645 678 901",
      email: "carlos.lopez@email.com"
    },
    {
      id: 5,
      name: "Elena",
      surname: "Sánchez",
      address: "Gran Vía 56, 50001 Zaragoza",
      phone: "+34 656 789 012",
      email: "elena.sanchez@email.com"
    }
  ]);
  
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const form = useForm({})

  const handleSubmit = form.handleSubmit((data) => {
    setCustomers([...customers, data])
    setIsOpen(false)
    form.reset()
  })

  console.log(customers)

  return (
    <>
      <CommonComponent setIsOpen={setIsOpen} customers={customers}/>

      {isDesktop ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Introduce los datos del Cliente</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <CustomerForm handleSubmit={handleSubmit} form={form}/>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Introduce los datos del Cliente</DrawerTitle>
            </DrawerHeader>
            <CustomerForm handleSubmit={handleSubmit} form={form}/>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Cerrar</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  )
}
