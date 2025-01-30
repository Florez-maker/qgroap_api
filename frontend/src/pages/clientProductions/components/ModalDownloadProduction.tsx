import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import client_productions_api from "@/api/CLientProductions";
import * as XLSX from "xlsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

function ModalDownloadProductions({ title }) {
  const [productionsData, setProductionsData] = useState<any[]>([]);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const productionDownloadSchema = z.object({
    format: z.enum(["csv", "excel"], { message: "Formato es obligatorio" }),
  });

  type ProductionDownload = z.infer<typeof productionDownloadSchema>;

  const form = useForm<ProductionDownload>({
    resolver: zodResolver(productionDownloadSchema),
    defaultValues: {
      format: "",
    },
  });

  const { control, handleSubmit, formState: { errors } } = form;

  useEffect(() => {
    async function fetchProductions() {
      try {
        const response = await client_productions_api.get();
        setProductionsData(response.client_productions);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron obtener los producciones.",
        });
      }
    }
    fetchProductions();
  }, []);

  const generateCSV = (data: any[]) => {
    const header = ["Cliente","TCH","SAC"];
    const rows = data.map((item) => [
      item.client.name,

      item.TCH,
      item.SAC,
    ]);
    return [header.join(","), ...rows.map(row => row.join(","))].join("\n");
  };

  const generateExcel = (data: any[]) => {
    const header = ["Cliente","TCH","SAC"];
    const rows = data.map((item) => ({
      "Cliente":item.client.name,
      "TCH":item.TCH,
      "SAC":item.SAC,
    }));

    const ws = XLSX.utils.json_to_sheet(rows, { header });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Movimientos");
    return wb;
  };

  const handleDownloadCSV = () => {
    if (productionsData.length === 0) {
      toast({
        variant: "destructive",
        title: "No hay producciones",
        description: "No se pueden descargar producciones porque no hay datos disponibles.",
      });
      return;
    }

    const csvData = generateCSV(productionsData);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `producciones.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Descarga completa",
      description: "Los producciones han sido descargados correctamente.",
    });
  };

  const handleDownloadExcel = () => {
    if (productionsData.length === 0) {
      toast({
        variant: "destructive",
        title: "No hay producciones",
        description: "No se pueden descargar producciones porque no hay datos disponibles.",
      });
      return;
    }

    const wb = generateExcel(productionsData);
    const excelFile = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelFile], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `producciones.xlsx`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Descarga completa",
      description: "Las producciones han sido descargados correctamente en formato Excel.",
    });
  };

  const handleDownload = (data: ProductionDownload) => {
    if (data.format === "csv") {
      handleDownloadCSV();
    } else if (data.format === "excel") {
      handleDownloadExcel();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <Download /> {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(handleDownload)} className="grid gap-2">
            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Formato</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona un formato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="col-span-1">
              <Button type="submit" disabled={productionsData.length === 0}>
                Descargar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ModalDownloadProductions;
