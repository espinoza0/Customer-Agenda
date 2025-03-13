import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Calendar,
  History,
  Mail,
  MapPin,
  // MoreVertical,
  Phone,
  Search,
  // Search,
  User,
  UserCircle,
} from "lucide-react";

// import { Label } from "../components/ui/label";
// import { Input } from "../components/ui/input";
import Navbar from "../components/Navbar";
import { format } from "@formkit/tempo";
// import {format as datefnsFormat}  from "date-fns"
import NoticeCard from "../components/NoticeCard";
import { Input } from "../components/ui/input";

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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const customerData = {
    contactoPrincipal: `${customer[0]?.name} ${customer[0]?.surname}`,
    email: customer[0]?.email,
    telefono: customer[0]?.phone,
    direccion: customer[0]?.address,
    totalServicios: visits?.length,
    ultimoServicio:
      visits?.length == 0
        ? "-"
        : format({
            date: visits[0]?.date,
            format: "short",
            tz: "Europe/Madrid",
          }),
    clienteDesde: format({
      date: customer[0]?.addedDate,
      format: "short",
      tz: "Europe/Madrid",
    }),
  };


  useEffect(() => {
    fetchVisits(id, selectedState)
  }, [selectedState])

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
              <div className="bg-blue-50 px-4 py-2 rounded-lg text-blue-600">
                Cliente desde {customerData?.clienteDesde}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="flex items-center gap-3">
                <User className="text-gray-500" />
                <div>
                  <h5 className="opacity-65 text-sm">Contacto Principal</h5>
                  <p className="text-base">{customerData?.contactoPrincipal}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-gray-500" />
                <div className="">
                  <h5 className="opacity-65 text-sm">Email</h5>
                  <p className="text-base">{customerData?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-gray-500" />
                <div className="">
                  <h5 className="opacity-65 text-sm">Teléfono</h5>
                  <p className="text-base">{customerData?.telefono}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-gray-500" />
                <div className="">
                  <h5 className="opacity-65 text-sm">Dirección</h5>
                  <p className="text-base">{customerData?.direccion}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <History className="text-gray-500" />
                <div className="">
                  <h5 className="opacity-65 text-sm">Total Servicios</h5>
                  <p className="text-base">
                    {customerData?.totalServicios} servicios
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="text-gray-500" />
                <div className="">
                  <h5 className="opacity-65 text-sm">Último Servicio</h5>
                  <p>{customerData?.ultimoServicio}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2">
          <div className="relative flex items-center w-full rounded-lg my-5 col-span-3">
            <Input
              type="search"
              placeholder="Buscar"
              className="w-full pl-10 font-semibold"
              value={searchQuery}
              onChange={handleSearch}
            />
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>

          <div className="w-full">
            <Tabs
              value={selectedState}
              onValueChange={setSelectedState}
              className="w-full"
            >
              <TabsList className="w-full flex">
                <TabsTrigger value={null} className="flex-1">
                  Todos
                </TabsTrigger>
                <TabsTrigger value="pendiente" className="flex-1">
                  Pendientes
                </TabsTrigger>
                <TabsTrigger value="realizado" className="flex-1">
                  Realizados
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        <div className="mx-auto container mt-3">
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
              No hay servicios para este cliente.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
