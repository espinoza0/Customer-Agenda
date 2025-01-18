import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePlacesWidget } from "react-google-autocomplete";
// import { useState } from "react";

const AutocompleteWidget = ({field}) => {

    const { ref } = usePlacesWidget({
      apiKey: import.meta.env.VITE_API_KEY,
      onPlaceSelected: (place) => {
        field.onChange(place.formatted_address);
        // setSelectedPlace(place.formatted_address)
      },
      options: {  
        types: ['address'],
        componentRestrictions: { country: 'es' },
        fields: ['address_components', 'formatted_address', 'geometry'],
      }
    });
  
    return (
      <input 
        ref={ref} 
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
        onChange={(e) => field.onChange(e.target.value)}
        // value={field.value ?? ''}
        onKeyDown={(e) => {
            if (e.key == "Enter") {
                e.preventDefault()
            }
        }}
        value={field.value || ''}
      />
    );
};
export default function CustomerForm({handleSubmit, form}) {
    
    // const [selectedPlace, setSelectedPlace] = useState(null)

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit} className={"grid items-start gap-4 p-5"}>
        
                <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor="name">Nombre</FormLabel>
                        <FormControl>
                            <Input type="text" id="name" required {...field} value={field.value ?? ''}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                name="surname"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor="surname">Apellidos</FormLabel>
                        <FormControl>
                            <Input type="text" id="surname" required {...field} value={field.value ?? ''}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormControl>
                            <Input type='email' id="email" required {...field} value={field.value ?? ''}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                name="phone"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor="tel">Teléfono</FormLabel>
                        <FormControl>
                            <Input id="tel" required {...field} value={field.value ?? ''}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
               <FormField
                    name="address"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel htmlFor="address">Calle</FormLabel>
                        <FormControl>
                            <AutocompleteWidget field={field}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                {/* <FormField
                    name="address"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="address">Calle</FormLabel>
                            <FormControl>
                                <Input id="address" required {...field} value={field.value ?? ''}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                )}
                /> */}
                {/* /AUTOCOMPLETADO CALLE */}
                {/* <div>
                    <label htmlFor="">Calle</label>
                    <Autocomplete
                        apiKey={import.meta.env.VITE_API_KEY}
                        className="border rounded-md w-full p-[0.5rem]"
                        onPlaceSelected={(place) => {
                            setSelectedPlace(place.formatted_address)
                        }}
                        options={{
                            types: ['address'],
                            componentRestrictions: { country: 'es' },
                            fields: ['address_components', 'formatted_address', 'geometry'],
                        }}
                        defaultValue=""
                    />

                    <input type="text" className="hidden" name="address" value={selectedPlace} />
                </div> */}

                {/* <AutocompleteWidget/> */}

                <Button type="submit" className="">Añadir Cliente</Button>
            </form>
        </Form>
    )
}
