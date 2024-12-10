'use client';

import * as React from 'react';
import fetchApi from '@/utils/api';
import { DeleteOutlined } from '@ant-design/icons';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { toast } from 'react-toastify'; // Importing toastify for notifications

import { useSelection } from '@/hooks/use-selection';

// Function to show a success toast message
const showSuccessToast = () => {
  toast.success('Customer deleted successfully!', {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

function noop(): void {
  // do nothing
}

export interface Customer {
  _id: string;
  avatar: string;
  fullName: string;
  email: string;
  status: string;
  address: { city: string; state: string; country: string; street: string };
  phoneNumber: string;
  createdAt: Date;
}

interface CustomersTableProps {
  count?: number;
  page?: number;
  initialRows?: Customer[];
  rowsPerPage?: number;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (newRowsPerPage: number) => void;
}

export function CustomersTable({
  count = 0,
  initialRows = [],
  page = 0,
  rowsPerPage = 0,
  onPageChange = noop,
  onRowsPerPageChange = noop,
}: CustomersTableProps): React.JSX.Element {
  const [rows, setRows] = React.useState(initialRows);

  React.useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  const rowIds = React.useMemo(() => {
    return rows?.map((customer) => customer._id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows?.length;
  const selectedAll = rows?.length > 0 && selected?.size === rows?.length;

  const handleDelete = async (userId: string) => {
    // Ask for confirmation before deleting
    const confirmed = window.confirm('Are you sure you want to delete this customer?');

    if (confirmed) {
      try {
        const response = await fetchApi(`/auth/delete-customer/${userId}`, 'POST'); // Ensure correct endpoint
        if (response.metadata.success) {
          setRows((prevRows) => prevRows.filter((row) => row._id !== userId));
          showSuccessToast(); // Show success message after deleting
        } else {
          console.error('Failed to delete customer');
        }
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Signed Up</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map((row) => {
              const isSelected = selected?.has(row._id);

              return (
                <TableRow hover key={row._id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row._id);
                        } else {
                          deselectOne(row._id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Avatar src={row.avatar} />
                      <Typography variant="subtitle2">{row?.fullName}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phoneNumber}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        color: row.status === 'active' ? 'green' : 'red',
                        fontWeight: 'bold',
                      }}
                    >
                      {row.status}
                    </Typography>
                  </TableCell>
                  <TableCell>{dayjs(row.createdAt).format('MMM D, YYYY')}</TableCell>
                  <TableCell>
                    <DeleteOutlined onClick={() => handleDelete(row._id)} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={(event, newPage) => onPageChange(newPage)} // Update page state
        onRowsPerPageChange={(event) => onRowsPerPageChange(parseInt(event.target.value, 10))} // Update rowsPerPage state
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
