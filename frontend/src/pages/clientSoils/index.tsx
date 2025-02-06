import { useEffect, useState } from "react";
import client_soils_api from "@/api/ClientSoils";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { FiChevronDown, FiChevronUp, FiMenu } from "react-icons/fi";
import { LuPencil } from "react-icons/lu";
import { MdOutlineDelete } from "react-icons/md";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { GiFarmTractor, GiGroundSprout } from "react-icons/gi";
import ModalDownloadSoil from "@/pages/clientSoils/components/ModalDownloadSoil";
import ModalUpdateSoil from "@/pages/clientSoils/components/ModalUpdateSoil";
import ModalUploadSoil from "@/pages/clientSoils/components/ModalUploadSoil";

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

function ClientSoils() {
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
      const client_soilsData = await client_soils_api.get();
      setData(client_soilsData.client_soils || []);
      setLoading(false);
    } catch (err) {
      setData([]);
      setError("Error fetching client soils data.");
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
    { accessorKey: "pH", header: "pH" },
    {
      accessorKey: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const client_soil = row.original;
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
              <DropdownMenuItem onClick={() => handleOpenDialog(client_soil)}>
                <LuPencil size={18} />
                Editar produccion
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDeleteProduction(client_soil.id)}
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

  const handleDeleteSoil = async (id) => {
    const confirmation = window.confirm("¿Está seguro de que desea eliminar este suelo?");
    if (confirmation) {
      try {
        const result = await client_soils_api.delete(id);
        if (result.success) {
          setData((prevData) => prevData.filter((client_soil) => client_soil.id !== id));
          toast({
            title: "Suelo eliminado",
            description: "El suelo ha sido eliminado correctamente.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error al eliminar el suelo",
            description: result.message || "Ha ocurrido un error inesperado. Intente nuevamente.",
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error al eliminar el suelo",
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
              <GiGroundSprout /> Suelos
            </span>
          <div className="flex gap-2">
            <ModalUploadSoil
              title="Subir suelos"
              onSuccess={() => {
                reloadData();
                toast({
                  title: "Suelos subidas",
                  description: "Las suelos han sido subidas exitosamente.",
                });
              }}
            />
            <ModalDownloadSoil title="Descargar suelos" />
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

      <ModalUpdateSoil
        data={selectedRow}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        onUpdate={() => {
          setOpenDialog(false);
          reloadData();
          toast({
            title: "Suelo actualizado",
            description: "El suelo ha sido actualizado exitosamente.",
          });
        }}
      />

    </>
  )
}

export default ClientSoils;
