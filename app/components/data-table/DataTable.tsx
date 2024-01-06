import { ColumnDef, useReactTable, getCoreRowModel, flexRender, Table as ITable } from "@tanstack/react-table"
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "../ui/table"

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

// function DataTable({ columns, data, filterBar }) {
export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Table>
      <TableHeader>
        <DataTable.TableHeader table={table} />
      </TableHeader>

      <TableBody>
        <DataTable.TableRow
          isEmpty={!Boolean(table.getRowModel().rows?.length)}
          contentRows={<DataTable.TableRowContent table={table} />}
          emptyRow={<DataTable.TableEmptyRow table={table} />}
        />
      </TableBody>
    </Table>
  )
}
DataTable.displayName = "DataTable";

function CustomTableHeader<TData>({ table }: { table: ITable<TData> }) {
  return (
    table.getHeaderGroups().map((headerGroup) => (
      <TableRow key={headerGroup.id}>
        {
          headerGroup.headers.map((header) => (
            <TableHead key={header.id}>
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </TableHead>
          ))
        }
      </TableRow>
    ))
  )
}
DataTable.TableHeader = CustomTableHeader;

function CustomTableRowContent<TData>({ table }: { table: ITable<TData> }) {
  return (
    table.getRowModel().rows.map((row) => (
      <TableRow key={row.id}>
        {
          row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(
                cell.column.columnDef.cell,
                cell.getContext()
              )}
            </TableCell>
          ))
        }
      </TableRow>
    ))
  )
}
DataTable.TableRowContent = CustomTableRowContent;

function CustomTableRow({ isEmpty, contentRows, emptyRow }: { isEmpty: boolean, contentRows: JSX.Element, emptyRow: JSX.Element }) {
  if (isEmpty) {
    return emptyRow
  }

  return contentRows
}
DataTable.TableRow = CustomTableRow;

function CustomTableEmptyRow<TData>({ table }: { table: ITable<TData> }) {
  return (
    <TableRow>
      <TableCell
        colSpan={table.getAllColumns().length}
        className="h-24 text-center"
      >
        <p className="text-center text-gray-500">Nenhum registro encontrado</p>
      </TableCell>
    </TableRow>
  )
}
DataTable.TableEmptyRow = CustomTableEmptyRow;
