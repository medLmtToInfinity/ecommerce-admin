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
    accessorKey: "billboard",
    header: "Billboard",
    cell: ( { row } ) => {
      console.log(row.original)
      return row.original.label
    }
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ( { row } ) => <CellAction data={row.original} />
  }
]
