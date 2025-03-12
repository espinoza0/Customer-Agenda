import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import {
  Calendar,
  History,
  Mail,
  MapPin,
  MoreVertical,
  Phone,
  Search,
  User,
  UserCircle,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import Navbar from "../components/Navbar";

export default function CustomerHistoryPage() {
  const { id } = useParams();
  const {
    customers: customer,
    visits,
    fetchVisits,
    fetchCustomers,
  } = useContext(AppContext);
  const [selectedState, setSelectedState] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Cargamos datos del usuario y sus visitass por su id
    const fetchDataCustomer = async () => {
      try {
        await fetchCustomers(id);
        await fetchVisits(id);
      } catch (error) {
        console.error("Error cargando datos: ", error);
      }
    };

    fetchDataCustomer();
  }, []);

  const customerData = {
    contactoPrincipal: `${customer[0]?.name} ${customer[0]?.surname}`,
    email: customer[0]?.email,
    telefono: customer[0]?.phone,
    direccion: customer[0]?.address,
    totalServicios: visits?.length,
    ultimoServicio: "2024-03-15",
    // clienteDesde: format(customer[0]?.addedDate	, "dd/MM/yyyy")
  };

  return (
    <>
      <Navbar />
      <section className="p-2">
        <Card className="shadow-xl my-3">
          <CardHeader>
            <div className="flex justify-between items-center flex-wrap gap-5">
              <div className="flex items-center gap-3">
                <UserCircle className="text-blue-500" size={40} />
                <CardTitle>{customerData.contactoPrincipal}</CardTitle>
              </div>
              <div className="bg-blue-50 px-4 py-2 rounded-lg">Cliente desde {customer[0]?.addedDate}</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="flex items-center gap-3">
                <User className="text-gray-500" />
                <div>
                  <h5 className="opacity-65 text-sm">Contacto Principal</h5>
                  <p className="text-base">{customerData.contactoPrincipal}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-gray-500" />
                <div className="">
                  <h5 className="opacity-65 text-sm">Email</h5>
                  <p className="text-base">{customerData.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-gray-500" />
                <div className="">
                  <h5 className="opacity-65 text-sm">Teléfono</h5>
                  <p className="text-base">{customerData.telefono}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-gray-500" />
                <div className="">
                  <h5 className="opacity-65 text-sm">Dirección</h5>
                  <p className="text-base">{customerData.direccion}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <History className="text-gray-500" />
                <div className="">
                  <h5 className="opacity-65 text-sm">Total Servicios</h5>
                  <p className="text-base">{customerData.totalServicios} servicios</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="text-gray-500" />
                <div className="">
                  <h5 className="opacity-65 text-sm">Último Servicio</h5>
                  <p>{customerData.ultimoServicio}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="mx-auto container">
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
                      <div className="flex gap-3 items-center">
                        <UserCircle />
                        <span>{visit.client_name}</span>
                      </div>
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
            <p className="text-center py-4 font-semibold">
              No hay servicios para este cliente.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
