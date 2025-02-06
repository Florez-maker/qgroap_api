import { useEffect, useState } from "react";
import clientsapi from "@/api/Clients";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from "@tanstack/react-table";
import { FiChevronDown, FiChevronUp, FiMenu, } from "react-icons/fi";
import { LuPencil } from "react-icons/lu";
import { MdOutlineDelete } from "react-icons/md";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ModalCreateClient from "./components/ModalCreateClient";
import ModalUpdateClient from "./components/ModalUpdateClient";
import { PiFarm } from "react-icons/pi";

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

type SelectChangeEvent = string;

function Clients() {

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
      const clientsData = await clientsapi.get();
      setData(clientsData.clients);
      setLoading(false);
    } catch (err) {
      setError("Error fetching clients data.");
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
    { accessorKey: "name", header: "Cliente" },
    { accessorKey: "company", header: "Compañia" },
    { accessorKey: "country", header: "País" },
    { accessorKey: "state", header: "Municipio" },
    { accessorKey: "city", header: "Ciudad" },
    {
      accessorKey: "client_crop",
      header: "Cultivo",
      cell: ({ row }) => row.original.client_crop?.name || "N/A",
    },
    {
      accessorKey: "is_active",
      header: "Estado",
      cell: ({ getValue }) => {
        const isActive = getValue();
        return (
          <span
            className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
              isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}
          >
        {isActive ? "Activo" : "Inactivo"}
      </span>
        );
      },
    },
    { accessorKey: "updated_by_username", header: "Actualizado Por" },
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
        const client = row.original;

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
              <DropdownMenuItem onClick={() => handleOpenDialog(client)}>
                <LuPencil size={18} />
                Editar cliente
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDeleteClient(client.id)}
              >
                <MdOutlineDelete size={18} />
                Eliminar cliente
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const handleDeleteClient = async (id) => {
    const confirmation = window.confirm("¿Está seguro de que desea eliminar este cliente?");
    if (confirmation) {
      try {
        const response = await clientsapi.delete(id);

        if (response.success) {
          setData((prevData) => prevData.filter((client) => client.id !== id));
          toast({
            title: "Cliente eliminado",
            description: "El cliente ha sido eliminado correctamente.",
          });
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error("Error al eliminar el cliente:", error);
        toast({
          variant: "destructive",
          title: "Error al eliminar el cliente",
          description: error.message || "Ha ocurrido un error inesperado. Intente nuevamente.",
        });
      }
    }
  };

  return (
    <>

      <div className="flex w-full flex-col">

        <div className="mb-4 flex justify-between text-sm bg-gray-50 rounded-md p-4">
            <span className="flex items-center gap-2 text-lg font-semibold">
            <PiFarm /> Clientes
            </span>
          <div className="flex gap-2">
            <ModalCreateClient
              title="Crear cliente"
              onSuccess={() => {
                reloadData();
                toast({
                  title: 'Cliente creado',
                  description: 'El cliente ha sido creado exitosamente.'
                });
              }}
            />
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

      <ModalUpdateClient
        data={selectedRow}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        onUpdate={() => {
          setOpenDialog(false);
          reloadData();
          toast({
            title: 'Cliente actualizado',
            description: 'El cliente ha sido actualizado exitosamente.'
          });
        }}
      />
    </>
  );
}

export default Clients;