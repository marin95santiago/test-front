import * as React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from '@mui/material'

interface Column {
  field: string
  label: string
}

interface Action {
  label: string
  alt: string
  action: (row: any) => void
}

interface Props {
  columns: Column[]
  rows: any[]
  actions: Action[]
}

export default function DataTable(props: Props) {

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {
              props.columns.map((column, index) => (
                <TableCell key={index}><b>{column.label}</b></TableCell>
              ))
            }
            <TableCell><b>Actions</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            props.rows.map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {
                  props.columns.map((column) => (
                    <TableCell key={row[column.field]} component="th" scope="row">
                      {row[column.field]}
                    </TableCell>
                  ))
                }
                <TableCell>
                  {
                    props.actions.map((action: any) => (
                      <Button key={action.label} aria-label={action.alt} onClick={() => action.action(row)}>{action.label}</Button>
                    ))
                  }
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}
