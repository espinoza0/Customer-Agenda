import {
  Search,
  // ChevronDown,
  // ChevronUp,
  Calendar1Icon,
  List,
  FilterX,
  ChevronLeftSquareIcon,
  ChevronRightSquare,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useContext, useEffect, useState } from "react";
import { ComboboxDemo } from "./combo/CustomerCombo";
import {
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subMonths,
  addMonths,
  addWeeks,
  subWeeks,
  isWithinInterval,
} from "date-fns";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { TabsContent } from "@/components/ui/tabs";
import { AppContext } from "../context/AppContext";
import { es } from "date-fns/locale";
import NoticeCard from "./NoticeCard";

export default function Agenda() {
  // const [visits, setVisits] = useState([]);
  const { visits, fetchVisits } = useContext(AppContext);
  const [calendarSelected, setCalendarSelected] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState(null);

  const [activeTab, setActiveTab] = useState("week");
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  const [currentDate, setCurrentDate] = useState(new Date()); // Estado para la fecha actual

  const [periodoActual, setPeriodoActual] = useState({
    periodoTipo: null,
    fecha: null,
  });

  const navigatePeriod = (direction) => {
    let newDate = new Date(currentDate);

    if (activeTab === "week") {
      newDate =
        direction === "next" ? addWeeks(newDate, 1) : subWeeks(newDate, 1);
    } else if (activeTab === "month") {
      newDate =
        direction === "next" ? addMonths(newDate, 1) : subMonths(newDate, 1);
    }
    setCurrentDate(newDate);
  };

  useEffect(() => {
    let startDate;
    let endDate;

    if (activeTab === "week") {
      startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
      endDate = endOfWeek(currentDate, { weekStartsOn: 1 });

      const hoy = new Date();
      const rango = {
        start: startDate,
        end: endDate,
      };
      if (isWithinInterval(hoy, rango)) {
        setPeriodoActual({
          periodoTipo: "Esta semana",
          fecha: null,
        });
      } else {
        const formattedStart = format(startDate, "dd MMM  yyyy", {
          locale: es,
        });
        const formattedEnd = format(endDate, "dd MMM yyyy", { locale: es });

        setPeriodoActual({
          periodoTipo: "Semana",
          fecha: `${formattedStart} - ${formattedEnd}`,
        });
      }
    } else if (activeTab === "month") {
      startDate = startOfMonth(currentDate);
      endDate = endOfMonth(currentDate);

      const nombreMes = format(startDate, "MMMM", { locale: es });
      setPeriodoActual({
        periodoTipo: nombreMes,
        fecha: format(startDate, "yyyy"),
      });
    } else {
      startDate = null;
      endDate = null;

      setPeriodoActual({
        periodoTipo: null,
        fecha: null,
      });
    }

    setDateRange({ startDate, endDate });
  }, [activeTab, currentDate]);

  useEffect(() => {
    let pendingValue = null;
    if (selectedState === "pendiente") {
      pendingValue = "pendiente";
    } else if (selectedState === "realizado") {
      pendingValue = "realizado";
    }

    fetchVisits(
      selectedCustomer,
      pendingValue,
      dateRange.startDate,
      dateRange.endDate
    );
  }, [selectedCustomer, selectedState, dateRange]);

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
        <div className="my-3 text-center">
          <h1 className="font-semibold text-2xl capitalize">
            {periodoActual.periodoTipo || ""}
          </h1>
          <span>{periodoActual.fecha || ""}</span>
        </div>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full my-2 flex items-center justify-between border"
        >
          <Button onClick={() => navigatePeriod("prev")}>
            <ChevronLeftSquareIcon />
          </Button>
          <div className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="week">Semana</TabsTrigger>
              <TabsTrigger value="month">Mes</TabsTrigger>
              <TabsTrigger value="all">Todo</TabsTrigger>
            </TabsList>
          </div>
          <Button onClick={() => navigatePeriod("next")}>
            <ChevronRightSquare />
          </Button>
        </Tabs>
        {visits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {visits.map((visit) => (
              <NoticeCard
                key={visit.id}
                visit={visit}
                selectedState={selectedState}
              />
            ))}
          </div>
        ) : (
          <p className="text-center py-4 font-semibold">
            No hay servicios agendados.
          </p>
        )}
      </div>
    </>
  );
}
