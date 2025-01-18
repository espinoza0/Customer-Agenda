import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar1, Home, Mail, MoreHorizontal, Phone, Trash2Icon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"



export default function CustomerCard({customer}) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold w-fit">{customer?.name + ' ' + customer?.surname}</CardTitle>
            <Popover>
              <PopoverTrigger>
                <MoreHorizontal/>
              </PopoverTrigger>
              <PopoverContent className="max-w-[5rem]">
                <div className="flex flex-col justify-center items-center gap-5">
                  <button>
                    <Trash2Icon/>
                  </button>
                  <button>
                    <Calendar1/>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
        </div>
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
