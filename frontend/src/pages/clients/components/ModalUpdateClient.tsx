import React, { useEffect, useState } from "react";
import clientsapi from "@/api/Clients";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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

interface ModalUpdateClientProps {
  data: any;
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  onUpdate: (id: string, updatedData: any) => void;
}

const ModalUpdateClient: React.FC<ModalUpdateClientProps> = ({ data, openDialog, setOpenDialog, onUpdate }) => {

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

  const { reset, handleSubmit, formState: { errors } } = form;
  const [loading, setLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
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

  useEffect(() => {
    if (data && openDialog) {
      reset({
        name: data.name || "",
        company: data.company || "",
        country: data.country || "",
        city: data.city || "",
        state: data.state || "",
        client_crop_id: data.client_crop_id?.id?.toString() || "",
        is_active: data.is_active,
      });
      setUpdateError(null);
    }
  }, [data, openDialog, reset]);

  async function onSubmit(formData: Client) {
    setLoading(true);

    try {
      const updatedClient = await clientsapi.update(data.id, {
        name: formData.name,
        company: formData.company,
        country: formData.country,
        city: formData.city,
        state: formData.state,
        client_crop_id: Number(formData.client_crop_id),
        is_active: formData.is_active,
      });

      if (onUpdate) onUpdate(data.id, updatedClient);
      form.reset();
      setOpenDialog(false);
    } catch (error) {
      console.error("Error actualizando cliente:", error);
      setUpdateError("Hubo un error al actualizar el cliente. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  if (!openDialog) return null;

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-center">Actualizar cliente</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
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
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalUpdateClient;
