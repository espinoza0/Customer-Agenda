"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { AppContext } from "../../context/AppContext";

export function ComboboxDemo({ selectedCustomer, setSelectedCustomer }) {
  const [open, setOpen] = React.useState(false);
  const { customers, fetchCustomers } = React.useContext(AppContext);

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCustomer
            ? customers.find((customer) => customer.id === selectedCustomer)
                ?.name +
              " " +
              customers.find((customer) => customer.id === selectedCustomer)
                ?.surname
            : "Selecciona Cliente..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Buscar Cliente..." className="h-9" />
          <CommandList>
            <CommandEmpty>No se encontró al cliente.</CommandEmpty>
            <CommandGroup>
              {customers?.map((customer) => (
                <CommandItem
                  key={customer.id}
                  value={customer.id}
                  onSelect={(currentValue) => {
                    setSelectedCustomer(
                      currentValue === selectedCustomer ? "" : customer.id
                    );
                    setOpen(false);
                  }}
                  className={"cursor-pointer"}
                >
                  {customer?.name + " " + customer?.surname}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedCustomer === customer.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
