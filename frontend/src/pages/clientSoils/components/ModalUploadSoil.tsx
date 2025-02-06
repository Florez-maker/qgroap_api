import React, { useCallback, useEffect, useState } from "react";
import clients_api from "@/api/Clients";
import client_soils_api from "@/api/ClientProductions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

function ModalUploadSoil({ title, callback, onSuccess }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const soilSchema = z.object({
    client_id: z.string().min(1, { message: "Debe seleccionar un cliente" }),
    document: z
      .instanceof(File, {
        message: "El documento es obligatorio",
      })
      .refine((file) => file != null, {
        message: "El documento es obligatorio",
      }),
  });

  type Production = z.infer<typeof soilSchema>;

  const form = useForm<Production>({
    resolver: zodResolver(soilSchema),
  });

  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await clients_api.get();
        setClients(response.clients);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    }
    fetchClients();
  }, []);

  const handleUploadSoils = useCallback(
    async (data: Production) => {
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append("client_id", String(Number(data.client_id[0])));

        if (file) {
          formData.append("document", file);
        }

        console.log("FormData being sent:");
        formData.forEach((value, key) => {
          console.log(`${key}: ${value}`);
        });

        const result = await client_soils_api.uploadProductions(formData);

        if (callback) callback(result);
        if (onSuccess) onSuccess();

        toast({
          title: "Producciones subidas",
          description: "Las suelos se han subido correctamente.",
        });

        form.reset();
        setOpen(false);
      } catch (error: any) {
        console.error("Error subiendo suelos:", error);

        toast({
          variant: "destructive",
          title: "Error al subir suelos",
          description: error.message || "Hubo un error al subir las suelos.",
        });
      } finally {
        setLoading(false);
      }
    },
    [callback, onSuccess, form, file, toast]
  );

  const [selectedClient, setSelectedClient] = useState<string>("");
  const [selectedClientData, setSelectedClientData] = useState<any>(null);

  const handleClientChange = (clientId: string) => {
    setSelectedClient(clientId);
    const client = clients.find(client => client.id.toString() === clientId);

    setSelectedClientData(client || null);

    form.setValue("client_id", clientId);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <Upload /> {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUploadSoils)} className="grid gap-2">

            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => handleClientChange(value)}
                    >
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

            {selectedClient && selectedClientData && (
              <Card>
                <CardContent className="grid grid-cols-3 gap-2 p-4">
                  <p className="text-sm text-gray-700 w-full">
                    <strong>Nombre:</strong> {selectedClientData.name}
                  </p>
                </CardContent>
              </Card>
            )}

            <FormField
              control={form.control}
              name="document"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Documento</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".xlsx,.xls,.xlsm,.csv,.CSV"
                      onChange={(e) => {
                        const file = e.target.files ? e.target.files[0] : null;
                        setFile(file);
                        field.onChange(file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="col-span-1" >
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

export default ModalUploadSoil;