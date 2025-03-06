// import { useState } from "react"
import {
  Search,
  // ChevronDown,
  // ChevronUp,
  MoreVertical,
  Calendar1Icon,
  List,
  FilterX,
  ChevronLeftSquareIcon,
  ChevronRightSquare,
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
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
// import { Input } from "./ui/input";

export default function Agenda() {
  const [visits, setVisits] = useState([]);
  const [calendarSelected, setCalendarSelected] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState(null);

  const [currentDate, setCurrentDate] = useState({
    startDate: '',
    endDate: ''
  })

  /*  
    en el fetch visits, pasalre tambien startDate y endDate, como parametro para filtrar por una fecha dependiendo de 
    si el tab esta en week, month o ALL. Si esta en all, entonces excluir filtro por date
  */

  const fetchVisits = async (client_id = null, pending = null, rangeDate = null) => {
    try {
      let url = "http://localhost:3000/notices/getNotices";

      let filtersParams = [];
      if (client_id) {
        filtersParams.push(`client_id=${client_id}`);
      }

      if (pending) {
        let pendingType;

        switch (selectedState) {
          case "pendiente":
            pendingType = 1;
            break;
          case "realizado":
            pendingType = 0;
            break;
        }

        filtersParams.push(`pending=${pendingType}`);
      }

      if (rangeDate) {
        console.log("")
      }


      if (filtersParams.length > 0) {
        url += `?${filtersParams.join("&")}`;
      }

      // console.log(url);

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
    fetchVisits(selectedCustomer, selectedState);
  }, [selectedCustomer, selectedState, currentDate]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="space-y-2 flex flex-col">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  type="search"
                  placeholder="Buscar en citas..."
                  className="pl-8 h-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2 flex flex-col">
              <Label htmlFor="customer-filter">Cliente</Label>
              <ComboboxDemo
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={setSelectedCustomer}
              />
            </div>

            <div className="space-y-2 flex flex-col">
              <Label htmlFor="estado-filter">Estado</Label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger id="estado-filter" className="h-full">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>Todos los estados</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="realizado">Realizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex flex-col">
              <Label className="invisible">Acciones</Label>
              <div className="flex space-x-2 h-full">
                <Button
                  onClick={() => setSelectedCustomer(null)}
                  className="flex-grow h-full"
                >
                  Limpiar Filtros
                  <FilterX className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  onClick={() => setCalendarSelected(!calendarSelected)}
                  className="flex-shrink-0 h-full"
                >
                  {calendarSelected ? (
                    <Calendar1Icon className="h-4 w-4" />
                  ) : (
                    <List className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mx-auto py-5">
        <Tabs defaultValue="week" className="w-full my-2 flex items-center justify-between">
          <Button>
            <ChevronLeftSquareIcon />
          </Button>
          <div className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="week">Semana</TabsTrigger>
              <TabsTrigger value="month">Mes</TabsTrigger>
              <TabsTrigger value="all">Todo</TabsTrigger>
            </TabsList>
            <TabsContent value="week">
              {/* Aqui se muestran las visitas de la semana, ya ordenadas */}
            </TabsContent>
          </div>
          {/* <TabsContent value="month">Aqui se muestran las visitas del mes, ya ordenadas</TabsContent> */}
          <Button>
            <ChevronRightSquare />
          </Button>
        </Tabs>
        {visits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {visits.map((visit) => (
              <Card
                key={visit.id}
                className={cn(
                  "hover:shadow-lg transition-shadow",
                  !visit.pending && !selectedState && "opacity-50"
                )}
              >
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
                          onClick={() =>
                            navigator.clipboard.writeText(visit.id)
                          }
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
                    {format(visit?.date, "dd/MM/yyyy HH:mm:ss")}
                  </p>
                  <p className="mt-2">{visit.observations}</p>
                </CardContent>
                <CardFooter>
                  <span
                    className={cn(
                      "text-sm font-semibold rounded-full shadow-md px-3 py-1",
                      !visit.pending
                        ? "bg-green-600 text-white"
                        : "bg-yellow-600 text-white"
                    )}
                  >
                    {visit.pending ? "Pendiente" : "Realizada"}
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center">
            No hay servicios agendados para este cliente.
          </p>
        )}
      </div>
    </>
  );
}
