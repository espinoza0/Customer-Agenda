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

import { useMediaQuery } from "@uidotdev/usehooks";
import CustomerForm from "@/components/CustomerForm";

export default function EditCustomerModal({ isOpen, setIsOpen, customer, handleSubmit, form }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <>
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
              <DialogTitle className="text-center">Modifica los datos del cliente - {customer?.name}</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <CustomerForm handleSubmit={handleSubmit} form={form} customer={customer} />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Modifica los datos del cliente - {customer?.name}</DrawerTitle>
            </DrawerHeader>
            <CustomerForm handleSubmit={handleSubmit} form={form} customer={customer}/>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
