import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import client_soils_api from "@/api/ClientProductions";
import * as XLSX from "xlsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

function ModalDownloadSoils({ title }) {
  const [soilsData, setSoilsData] = useState<any[]>([]);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const soilDownloadSchema = z.object({
    format: z.enum(["csv", "excel"], { message: "Formato es obligatorio" }),
  });

  type SoilDownload = z.infer<typeof soilDownloadSchema>;

  const form = useForm<SoilDownload>({
    resolver: zodResolver(soilDownloadSchema),
    defaultValues: {
      format: "",
    },
  });

  const { control, handleSubmit, formState: { errors } } = form;

  useEffect(() => {
    async function fetchSoils() {
      try {
        const response = await client_soils_api.get();
        setSoilsData(response.client_soils);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron obtener los suelos.",
        });
      }
    }
    fetchSoils();
  }, []);

  const generateCSV = (data: any[]) => {
    const header = ["Cliente","Finca","Suerte","Suerte madre","Variedad","TCH","TCHM","SAC"];
    const rows = data.map((item) => [
      item.client.name,
      item.NOM_HAC,
      item.STE,
      item.STE2,
      item.VAR,
      item.TCH,
      item.TCHM,
      item.SAC,
    ]);
    return [header.join(","), ...rows.map(row => row.join(","))].join("\n");
  };

  const generateExcel = (data: any[]) => {
    const header = ["Cliente","Finca","Suerte","Suerte madre","Variedad","TCH","TCHM","SAC"];
    const rows = data.map((item) => ({
      "Cliente":item.client.name,
      "NOM_HAC":item.NOM_HAC,
      "STE":item.STE,
      "STE2":item.STE2,
      "VAR":item.VAR,
      "TCH":item.TCH,
      "TCHM":item.TCHM,
      "SAC":item.SAC,
    }));

    const ws = XLSX.utils.json_to_sheet(rows, { header });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Movimientos");
    return wb;
  };

  const handleDownloadCSV = () => {
    if (soilsData.length === 0) {
      toast({
        variant: "destructive",
        title: "No hay suelos",
        description: "No se pueden descargar suelos porque no hay datos disponibles.",
      });
      return;
    }

    const csvData = generateCSV(soilsData);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `suelos.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Descarga completa",
      description: "Las suelos han sido descargadas correctamente.",
    });
  };

  const handleDownloadExcel = () => {
    if (soilsData.length === 0) {
      toast({
        variant: "destructive",
        title: "No hay suelos",
        description: "No se pueden descargar suelos porque no hay datos disponibles.",
      });
      return;
    }

    const wb = generateExcel(soilsData);
    const excelFile = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelFile], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `suelos.xlsx`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Descarga completa",
      description: "Las suelos han sido descargados correctamente en formato Excel.",
    });
  };

  const handleDownload = (data: SoilDownload) => {
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
              <Button type="submit" disabled={soilsData.length === 0}>
                Descargar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ModalDownloadSoils;
