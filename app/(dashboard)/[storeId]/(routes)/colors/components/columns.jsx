"use client"

import CellAction from "./cell-action"
// import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.value}
        <div className="w-6 h-6 rounded-full border" style={{backgroundColor: row.original.value}} />
      </div>
    )
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ( { row } ) => {
      console.log(row.original)
    return <CellAction data={row.original} />
  }
  }
]
