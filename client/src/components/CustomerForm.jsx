import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AutocompleteWidget from "./AutocompleteWidget";

export default function CustomerForm({handleSubmit, form}) {

    return (
        <Form {...form}>
          <form onSubmit={handleSubmit} className="grid gap-4 p-5">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel htmlFor="name">Nombre</FormLabel>
                  <FormControl>
                    <Input type="text" id="name" required {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="surname"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel htmlFor="surname">Apellidos</FormLabel>
                  <FormControl>
                    <Input type="text" id="surname" required {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="address"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel htmlFor="address">Calle</FormLabel>
                  <FormControl>
                    <AutocompleteWidget field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input type="email" id="email" required {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="phone"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel htmlFor="tel">Teléfono</FormLabel>
                  <FormControl>
                    <Input id="tel" required {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Añadir Cliente</Button>
          </form>
        </Form>
      );
}
