import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import client_soils_api from "@/api/ClientSoils";
import clients_api from "@/api/Clients";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"

const soilSchema = z.object({
  client_id: z.string().min(1, { message: "Debe seleccionar una cuenta" }),
  pH: z.string().min(1),
  Ca: z.string().min(1),
});

type Soil = z.infer<typeof soilSchema>;

interface ModalUpdateSoilProps {
  data: any;
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  onUpdate: (id: string, updatedData: any) => void;
}

const ModalUpdateSoil: React.FC<ModalUpdateSoilProps> = ({
                                                           data,
                                                           openDialog,
                                                           setOpenDialog,
                                                           onUpdate,
                                                         }) => {
  const form = useForm<Soil>({
    resolver: zodResolver(soilSchema),
    defaultValues: {
      client_id: "",
      pH: "",
      Ca: "",
    },
  });

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const clientsResponse = await clients_api.get();
        setClients(clientsResponse.clients);

        if (data?.id) {
          form.reset({
            client_id: data.client.id.toString() || "",
            pH: data.pH || "",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    if (openDialog && data?.id) {
      fetchData();
    }
  }, [openDialog, data?.id, form]);

  async function onSubmit(formData: Soil) {
    setLoading(true);

    try {
      const payload = {
        client_id: Number(formData.client_id),
        pH: formData.pH,
        Ca: formData.Ca,
      };

      const updatedSoil = await client_soils_api.update(data.id, payload);
      onUpdate(data.id, updatedSoil);
      form.reset();
      setOpenDialog(false);
    } catch (error) {
      console.error("Error updating soil:", error);
    } finally {
      setLoading(false);
    }
  }

  if (!openDialog) return null;

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog} >
      <DialogContent className="sm:max-w-[1200px]">
        <DialogHeader>
          <DialogTitle className="text-center">Actualizar producción</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-3 gap-2">

            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="client_id" className="w-full">
                        <SelectValue placeholder="Selecciona un cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients?.map((row: any) => (
                          <SelectItem key={row.id} value={row.id.toString()}>
                            {row.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="col-span-3" >
              <Button type="submit" disabled={loading}>
                {loading ? "Actualizando..." : "Actualizar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalUpdateSoil;