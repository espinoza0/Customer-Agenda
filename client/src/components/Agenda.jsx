// import { useState } from "react"
import {
  Search,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Calendar1Icon,
  List,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { ComboboxDemo } from "./combo/CustomerCombo";
import { format } from "date-fns";
// import { Input } from "./ui/input";

export default function Agenda() {
  const [visits, setVisits] = useState([]);
  const [calendarSelected, setCalendarSelected] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchVisits = async (client_id = null) => {
    try {
      let url = "http://localhost:3000/notices/getNotices";

      if (client_id) {
        url += `?client_id=${client_id}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setVisits(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  useEffect(() => {
    // si se selecciona un cliente, filtrar por el id de este
    fetchVisits(selectedCustomer);
  }, [selectedCustomer]);

  return (
    <div className="max-w-[40rem] mx-auto">
      <div className="flex items-center gap-3 my-4">
        <Button onClick={() => setCalendarSelected(!calendarSelected)}>
          {calendarSelected ? <Calendar1Icon /> : <List />}
        </Button>
        {/* <Input
          placeholder="Buscar servicios..."
          value={''}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full"
          icon={<Search className="h-4 w-4 text-gray-500" />}
        /> */}

        <ComboboxDemo
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
        />

        {/* <Button variant="outline" className="w-full flex justify-between items-center" onClick={toggleSortOrder}>
          Ordenar por fecha
          {sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button> */}
      </div>

      <div className="space-y-4">
        {visits.map((visit) => (
          <Card key={visit.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{visit.client_name}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => navigator.clipboard.writeText(visit.id)}
                    >
                      Copiar ID del servicio
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                    <DropdownMenuItem>Editar servicio</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                {format(visit?.date, "dd/MM/yyyy")}
              </p>
              <p className="mt-2">{visit.observations}</p>
            </CardContent>
            <CardFooter>
              <span
                className={cn(
                  "text-sm font-semibold",
                  !visit.pending ? "text-green-600" : "text-yellow-600"
                )}
              >
                {visit.pending ? "Pendiente" : "Realizada"}
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* {servicios.length === 0 && <p className="text-center text-gray-500">No se encontraron resultados.</p>} */}
    </div>
  );
}
