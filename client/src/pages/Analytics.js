import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Analytics() {
  const [timeRange, setTimeRange] = useState('week');
  const [platform, setPlatform] = useState('all');
  const [analyticsData, setAnalyticsData] = useState({
    engagementOverTime: {
      labels: [],
      datasets: [],
    },
    platformPerformance: {
      labels: [],
      datasets: [],
    },
    contentTypes: {
      labels: [],
      datasets: [],
    },
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange, platform]);

  const fetchAnalyticsData = async () => {
    try {
      const response = await axios.get(`/api/analytics/data?timeRange=${timeRange}&platform=${platform}`);
      const data = response.data;

      setAnalyticsData({
        engagementOverTime: {
          labels: data.engagementOverTime.map(item => item.date),
          datasets: [
            {
              label: 'Likes',
              data: data.engagementOverTime.map(item => item.likes),
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
            {
              label: 'Shares',
              data: data.engagementOverTime.map(item => item.shares),
              borderColor: 'rgb(255, 99, 132)',
              tension: 0.1,
            },
            {
              label: 'Comments',
              data: data.engagementOverTime.map(item => item.comments),
              borderColor: 'rgb(53, 162, 235)',
              tension: 0.1,
            },
          ],
        },
        platformPerformance: {
          labels: data.platformPerformance.map(item => item.platform),
          datasets: [
            {
              label: 'Total Engagement',
              data: data.platformPerformance.map(item => item.engagement),
              backgroundColor: [
                'rgba(75, 192, 192, 0.5)',
                'rgba(255, 99, 132, 0.5)',
                'rgba(53, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
              ],
            },
          ],
        },
        contentTypes: {
          labels: data.contentTypes.map(item => item.type),
          datasets: [
            {
              data: data.contentTypes.map(item => item.count),
              backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
              ],
            },
          ],
        },
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Analytics</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="week">Last Week</MenuItem>
              <MenuItem value="month">Last Month</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Platform</InputLabel>
            <Select
              value={platform}
              label="Platform"
              onChange={(e) => setPlatform(e.target.value)}
            >
              <MenuItem value="all">All Platforms</MenuItem>
              <MenuItem value="twitter">Twitter</MenuItem>
              <MenuItem value="facebook">Facebook</MenuItem>
              <MenuItem value="instagram">Instagram</MenuItem>
              <MenuItem value="linkedin">LinkedIn</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Engagement Over Time */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Engagement Over Time
            </Typography>
            <Box sx={{ height: 400 }}>
              <Line
                data={analyticsData.engagementOverTime}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Platform Performance */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Platform Performance
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar
                data={analyticsData.platformPerformance}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Content Types */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Content Types Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <Pie
                data={analyticsData.contentTypes}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Analytics; 