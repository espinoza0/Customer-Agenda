// import { useState } from "react"
import { Search, ChevronDown, ChevronUp, MoreVertical } from "lucide-react"

import { Button } from "@/components/ui/button"
// import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Card, CardContent, CardFooter, CardHeader, CardTitle} from "./ui/card"

const data = [
  {
    id: "728ed52f",
    fecha: "2023-05-01",
    cliente: "Cliente A",
    descripcion: "Reparación de aire acondicionado",
    estado: "Completado",
  },
  {
    id: "489e1d42",
    fecha: "2023-05-03",
    cliente: "Cliente B",
    descripcion: "Instalación de calefacción",
    estado: "Pendiente",
  },
  {
    id: "153e1d42",
    fecha: "2023-05-05",
    cliente: "Cliente C",
    descripcion: "Mantenimiento de sistema eléctrico",
    estado: "En progreso",
  },
  // Agrega más datos de ejemplo aquí
]

export default function Agenda() {
  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4">
      <div className="space-y-2">
        {/* <Input
          placeholder="Buscar servicios..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full"
          icon={<Search className="h-4 w-4 text-gray-500" />}
        /> */}
        <Select >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filtrar por cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los clientes</SelectItem>
            <SelectItem value="Cliente A">Cliente A</SelectItem>
            <SelectItem value="Cliente B">Cliente B</SelectItem>
            <SelectItem value="Cliente C">Cliente C</SelectItem>
          </SelectContent>
        </Select>
        {/* <Button variant="outline" className="w-full flex justify-between items-center" onClick={toggleSortOrder}>
          Ordenar por fecha
          {sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button> */}
      </div>

      <div className="space-y-4">
        {data.map((servicio) => (
          <Card key={servicio.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{servicio.cliente}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(servicio.id)}>
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
              <p className="text-sm text-gray-500">{servicio.fecha}</p>
              <p className="mt-2">{servicio.descripcion}</p>
            </CardContent>
            <CardFooter>
              <span
                className={`text-sm font-semibold ${
                  servicio.estado === "Completado"
                    ? "text-green-600"
                    : servicio.estado === "Pendiente"
                      ? "text-yellow-600"
                      : "text-blue-600"
                }`}
              >
                {servicio.estado}
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* {servicios.length === 0 && <p className="text-center text-gray-500">No se encontraron resultados.</p>} */}
    </div>
  )
}
