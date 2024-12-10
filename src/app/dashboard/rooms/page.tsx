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

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [visibleDetails, setVisibleDetails] = useState<Record<string, boolean>>({});

  // Hàm fetch dữ liệu từ API
  const fetchRooms = async () => {
    try {
      const response = await fetchApi(`/room`, 'GET');
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
  const toggleDetails = (roomId: string) => {
    setVisibleDetails((prevState) => ({
      ...prevState,
      [roomId]: !prevState[roomId], // Chỉ thay đổi trạng thái hiển thị chi tiết của phòng này
    }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Phòng đấu giá đang diễn ra</h1>
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
                    <button className={styles.button} onClick={() => toggleDetails(room._id)}>
                      {visibleDetails[room._id] ? 'Hide Details' : 'Show Details'}
                    </button>
                  </td>
                </tr>
                {visibleDetails[room._id] && (
                  <tr>
                    <td colSpan={7}>
                      <div className={styles.details}>
                        <div className={styles.bidHistory}>
                          <p className={styles.bidHistoryTitle}>Bid History:</p>
                          <div className={styles.bidList}>
                            {room.bidHistory.map((bid, index) => (
                              <div key={index} className={styles.bidItem}>
                                <p>
                                  <strong>useId:</strong> {bid.uid}
                                </p>
                                <p>
                                  <strong>Giá đấu:</strong> ${bid.bidAmount}
                                </p>
                                <p>
                                  <strong>thời gian:</strong> {new Date(bid.time).toLocaleDateString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
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
