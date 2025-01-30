import { useEffect, useState } from "react";
import client_productions_api from "@/api/CLientProductions";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { FiChevronDown, FiChevronUp, FiMenu } from "react-icons/fi";
import { LuPencil } from "react-icons/lu";
import { MdOutlineDelete } from "react-icons/md";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ModalUploadProduction from "./components/ModalUploadProduction";
import ModalUpdateProduction from "./components/ModalUpdateProduction";
import ModalDownloadProduction from "./components/ModalDownloadProduction";
import { TbTransactionDollar } from "react-icons/tb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {Card, CardHeader, CardTitle, CardContent, CardDescription} from "@/components/ui/card";
import { GiFarmTractor } from "react-icons/gi";

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

function CLientProductions() {
  const { toast } = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const reloadData = async () => {
    try {
      const client_productionsData = await client_productions_api.get();
      setData(client_productionsData.client_productions || []);
      setLoading(false);
    } catch (err) {
      setData([]);
      setError("Error fetching client_productions data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  function handleOpenDialog(row) {
    setSelectedRow(row);
    setOpenDialog(true);
  }

  const columns = [
    { accessorKey: "client.name", header: "Cliente" },
    { accessorKey: "TCH", header: "TCH" },
    { accessorKey: "SAC", header: "SAC" },

    { accessorKey: "updated_by_username", header: "Actualizado Por", width: 100 },
    {
      accessorKey: "created_at",
      header: "Fecha de Creación",
      cell: ({ getValue }) => formatDateTime(getValue()),
    },
    {
      accessorKey: "updated_at",
      header: "Fecha de Actualización",
      cell: ({ getValue }) => formatDateTime(getValue()),
    },
    {
      accessorKey: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const client_production = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span className="flex h-8 w-8 cursor-pointer items-center justify-center">
                <FiMenu size={18} />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Opciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleOpenDialog(client_production)}>
                <LuPencil size={18} />
                Editar produccion
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDeleteProduction(client_production.id)}
              >
                <MdOutlineDelete size={18} />
                Eliminar produccion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { columnFilters, sorting },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
  });

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
    if (selectedFilter) {
      table.getColumn(selectedFilter)?.setFilterValue(e.target.value);
    }
  };

  const handleDeleteProduction = async (id) => {
    const confirmation = window.confirm("¿Está seguro de que desea eliminar este produccion?");
    if (confirmation) {
      try {
        const result = await client_productions_api.delete(id);
        if (result.success) {
          setData((prevData) => prevData.filter((client_production) => client_production.id !== id));
          toast({
            title: "Producción eliminada",
            description: "La producción ha sido eliminada correctamente.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error al eliminar la producción",
            description: result.message || "Ha ocurrido un error inesperado. Intente nuevamente.",
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error al eliminar la produccion",
          description: "Ha ocurrido un error inesperado. Intente nuevamente.",
        });
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="flex w-full flex-col">

        <div className="mb-4 flex justify-between text-sm bg-gray-50 rounded-md p-4">
            <span className="flex items-center gap-2 text-lg font-semibold">
              <GiFarmTractor /> Producciones
            </span>
          <div className="flex gap-2">
            <ModalUploadProduction
              title="Subir producciones"
              onSuccess={() => {
                reloadData();
                toast({
                  title: "Producciones subidas",
                  description: "Las producciones han sido subidas exitosamente.",
                });
              }}
            />
            <ModalDownloadProduction title="Descargar producciones" />
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Select value={selectedFilter} onValueChange={(value) => setSelectedFilter(value)}>
            <SelectTrigger className="w-[300px] text-sm">
              <SelectValue placeholder="Seleccione una columna" />
            </SelectTrigger>
            <SelectContent>
              {columns
                .filter((column) => column.accessorKey !== "actions")
                .map((column) => (
                  <SelectItem key={column.accessorKey} value={column.accessorKey}>
                    {column.header}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Filtrar..."
            value={filterValue}
            onChange={handleFilterChange}
            className="ml-2 text-sm p-2 border rounded-md"
          />
        </div>

        <div className="rounded-md border overflow-hidden mb-6">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="bg-gray-100">
                      <div
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex cursor-pointer select-none items-center text-sm text-gray-600"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() ? (
                          header.column.getIsSorted() === "asc" ? (
                            <FiChevronUp size={14} />
                          ) : (
                            <FiChevronDown size={14} />
                          )
                        ) : null}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                    Sin resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center mt-3 text-sm">
          <Button
            onClick={() => table.setPageIndex(table.getState().pagination.pageIndex - 1)}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <span className="text-sm text-gray-600">
              Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </span>
          <Button
            onClick={() => table.setPageIndex(table.getState().pagination.pageIndex + 1)}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>

      <ModalUpdateProduction
        data={selectedRow}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        onUpdate={() => {
          setOpenDialog(false);
          reloadData();
          toast({
            title: "Producción actualizada",
            description: "La producción ha sido actualizada   exitosamente.",
          });
        }}
      />
    </>
  )
}

export default CLientProductions;
