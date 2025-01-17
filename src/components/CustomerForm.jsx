import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Autocomplete from "react-google-autocomplete";
import { useState } from "react";
export default function CustomerForm({handleSubmit, form}) {
    
    const [selectedPlace, setSelectedPlace] = useState(null)

    // const handlePlaceChanged = (autocomplete) => {
    //     if (autocomplete) {
    //       const place = autocomplete.getPlace();
    //       const address = place?.formatted_address || "";
    //       form.setValue(name, address); // Actualiza el valor del formulario
    //     }
    // };

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
               {/* <FormField
                    name="address"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel htmlFor="address">Calle</FormLabel>
                        <FormControl>
                            <Autocomplete
                            apiKey={import.meta.env.VITE_API_KEY}
                            onPlaceSelected={(place, event) => {
                                event.preventDefault()
                                const address = place?.formatted_address || "";
                                field.onChange(address); // Sincroniza el valor seleccionado con el formulario
                            }}
                            options={{
                                types: ["address"],
                                componentRestrictions: { country: "es" },
                            }}
                            defaultValue={field.value ?? ""}
                            className="border rounded-md w-full p-[0.5rem]"
                            placeholder="Introduce una dirección"
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                /> */}
                <FormField
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
                />
                {/* /AUTOCOMPLETADO CALLE */}
                <div>
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
                </div>

                <Button type="submit">Añadir Cliente</Button>
            </form>
        </Form>
    )
}
