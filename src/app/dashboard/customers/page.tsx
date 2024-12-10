'use client';

import * as React from 'react';
import fetchApi from '@/utils/api';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';

import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import type { Customer } from '@/components/dashboard/customer/customers-table';

export default function Page(): React.JSX.Element {
  const [originalData, setOriginalData] = React.useState<Customer[]>([]);
  const [userData, setUserData] = React.useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [page, setPage] = React.useState(0);
  const rowsPerPage = 5;

  const fetchUser = async () => {
    try {
      const userId = Cookies.get('userId');

      if (!userId) {
        console.error('User ID is missing from cookies');
        return;
      }

      const response = await fetchApi(`/auth/getAllUser/${userId}`, 'GET');
      console.log('Admin user:', response.metadata);
      const data = response.metadata || [];
      setOriginalData(data); // Lưu dữ liệu gốc
      setUserData(data); // Hiển thị dữ liệu ban đầu
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  React.useEffect(() => {
    fetchUser();
  }, []);

  // Lọc danh sách khách hàng dựa trên từ khóa tìm kiếm
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!searchTerm.trim()) {
        // Nếu từ khóa tìm kiếm trống, khôi phục dữ liệu gốc
        setUserData(originalData);
      } else {
        // Lọc dữ liệu dựa trên từ khóa tìm kiếm
        const newFilteredCustomers = originalData.filter((customer) =>
          customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setUserData(newFilteredCustomers);
      }
    }
  };

  const paginatedCustomers = applyPagination(userData, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Customers</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
        </div>
      </Stack>
      <Card sx={{ p: 2 }}>
        <OutlinedInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch}
          fullWidth
          placeholder="Search customer"
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          sx={{ maxWidth: '500px' }}
        />
      </Card>
      <CustomersTable
        count={userData.length}
        page={page}
        initialRows={paginatedCustomers}
        rowsPerPage={rowsPerPage}
        onChangePage={(newPage) => setPage(newPage)}
      />
    </Stack>
  );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
