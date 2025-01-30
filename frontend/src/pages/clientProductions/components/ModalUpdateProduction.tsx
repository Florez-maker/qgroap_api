import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import client_productions_api from "@/api/CLientProductions";
import clients_api from "@/api/Clients";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"

const productionSchema = z.object({
  client_id: z.string().min(1, { message: "Debe seleccionar una cuenta" }),
  TCH: z.string().min(1),
});

type Production = z.infer<typeof productionSchema>;

interface ModalUpdateProductionProps {
  data: any;
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  onUpdate: (id: string, updatedData: any) => void;
}

const ModalUpdateProduction: React.FC<ModalUpdateProductionProps> = ({
                                                                       data,
                                                                       openDialog,
                                                                       setOpenDialog,
                                                                       onUpdate,
                                                                     }) => {
  const form = useForm<Production>({
    resolver: zodResolver(productionSchema),
    defaultValues: {
      client_id: "",
      TCH: "",

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
            TCH: data.TCH || "",
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

  async function onSubmit(formData: Production) {
    setLoading(true);

    try {
      const payload = {
        client_id: Number(formData.client_id),
        TCH: formData.TCH,
      };

      const updatedProduction = await client_productions_api.update(data.id, payload);
      onUpdate(data.id, updatedProduction);
      form.reset();
      setOpenDialog(false);
    } catch (error) {
      console.error("Error updating production:", error);
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
                        <SelectValue placeholder="Selecciona una cuenta bancaria" />
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

export default ModalUpdateProduction;