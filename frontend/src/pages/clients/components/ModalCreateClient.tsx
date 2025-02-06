import { useEffect, useState } from "react";
import clientsapi from "@/api/Clients";
import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import clientcropsapi from "@/api/ClientCrops";

const clientSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  company: z.string().min(1, "La compañía es obligatoria"),
  country: z.string().min(1, "El país es obligatorio"),
  city: z.string().min(1, "La ciudad es obligatoria"),
  state: z.string().min(1, "El estado es obligatorio"),
  client_crop_id: z.string().min(1, { message: "Debe seleccionar un cultivo" }),
  is_active: z.boolean().optional(),
});

type Client = z.infer<typeof clientSchema>;

function ModalCreateClient({ title, callback, onSuccess }) {
  const form = useForm<Client>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      company: "",
      country: "",
      city: "",
      state: "",
      client_crop_id: "",
      is_active: true,
    },
  });

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [clientCrops, setClientCrops] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const clientCropResponse = await clientcropsapi.get();
        setClientCrops(clientCropResponse.client_crops);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  async function onSubmit(data) {
    setLoading(true);

    try {
      const newClient = await clientsapi.create(data);

      if (callback) callback(newClient);
      if (onSuccess) onSuccess();

      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error creando cliente:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <CirclePlus /> {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-center">Crear cliente</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-2 mt-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingrese el nombre del cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Compañía</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingrese la compañía" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>País</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingrese el país" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingrese el estado" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciudad</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingrese la ciudad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="client_crop_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cultivo</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione un cultivo" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientCrops.map((b) => (
                          <SelectItem key={b.id} value={b.id.toString()}>
                            {b.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormLabel className="cursor-pointer">Activo</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter className={"flex gap-2 col-span-2 justify-end"}>
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ModalCreateClient;