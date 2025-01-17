import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Mail, Phone } from "lucide-react"

export default function CustomerCard({customer}) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{customer?.name + ' ' + customer?.surname}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-4">
          <Home className="h-5 w-5 text-gray-500" />
          <span>{customer?.address}</span>
        </div>
        <div className="flex items-center space-x-4">
          <Phone className="h-5 w-5 text-gray-500" />
          <span>{customer?.phone}</span>
        </div>
        <div className="flex items-center space-x-4">
          <Mail className="h-5 w-5 text-gray-500" />
          <span>{customer?.email}</span>
        </div>
      </CardContent>
    </Card>
  )
}
