'use client';

// Đảm bảo đánh dấu file này là client-side component
import React, { useEffect, useState } from 'react';
import fetchApi from '@/utils/api';
import { Button, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import styles from './rompage.module.css'; // Import CSS Module

interface Room {
  _id: string;
  roomCode: string;
  title: string;
  startPrice: number;
  currentPrice: number;
  image: string;
  endDate: string;
  status: string;
  details: string;
  price: number;
  bidHistory: Array<{ uid: string; bidAmount: number; time: string }>;
}

export default function XacNhanPhong() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [visibleDetails, setVisibleDetails] = useState<Record<string, boolean>>({});

  // Hàm fetch dữ liệu từ API
  const fetchRooms = async () => {
    try {
      const response = await fetchApi(`/room/not-confirmed`, 'GET');
      if (response && response.metadata) {
        setRooms(response.metadata);
      } else {
        console.error('Invalid API response structure');
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Hàm toggle hiển thị chi tiết
  const toggleDuyet = async (roomId: string) => {
    try {
      const response = await fetchApi(`/room/acceptRoom`, 'POST', {
        roomId: roomId,
        status: 'Đang diễn ra',
      });
      if (response && response.metadata) {
        setRooms(response.metadata);
        fetchRooms();
      } else {
        console.error('Invalid API response structure');
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Xác nhận phòng</h1>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Rooms</Typography>
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
      {rooms.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Room Code</th>
              <th>Title</th>
              <th>Start Price</th>
              <th>Current Price</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th> {/* Cột này thay thế cho cột Details */}
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <React.Fragment key={room._id}>
                <tr>
                  <td>{room.roomCode}</td>
                  <td>{room.title}</td>
                  <td>${room.startPrice}</td>
                  <td>${room.currentPrice}</td>
                  <td>{room.endDate}</td>
                  <td className={room.status === 'Đang diễn ra' ? styles.statusAvailable : styles.statusUnavailable}>
                    {room.status}
                  </td>
                  <td>
                    <button className={styles.button} onClick={() => toggleDuyet(room._id)}>
                      Duyệt
                    </button>
                    <button
                      className={styles.button}
                      style={{
                        marginLeft: '20px',
                      }}
                      onClick={() => toggleDuyet(room._id)}
                    >
                      Không duyệt
                    </button>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No rooms available.</p>
      )}
    </div>
  );
}
