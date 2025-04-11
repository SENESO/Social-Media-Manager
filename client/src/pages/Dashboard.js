import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    scheduledPosts: 0,
    publishedPosts: 0,
    engagement: {
      likes: 0,
      shares: 0,
      comments: 0,
    },
  });

  const [recentPosts, setRecentPosts] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, postsResponse] = await Promise.all([
        axios.get('/api/analytics/stats'),
        axios.get('/api/posts?limit=5'),
      ]);

      setStats(statsResponse.data);
      setRecentPosts(postsResponse.data);

      // Prepare chart data
      const engagementData = statsResponse.data.engagementOverTime;
      setChartData({
        labels: engagementData.map(item => item.date),
        datasets: [
          {
            label: 'Engagement',
            data: engagementData.map(item => item.value),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const socialPlatforms = [
    { name: 'Twitter', icon: <TwitterIcon />, color: '#1DA1F2' },
    { name: 'Facebook', icon: <FacebookIcon />, color: '#4267B2' },
    { name: 'Instagram', icon: <InstagramIcon />, color: '#E1306C' },
    { name: 'LinkedIn', icon: <LinkedInIcon />, color: '#0077B5' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Posts
              </Typography>
              <Typography variant="h4">{stats.totalPosts}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Scheduled Posts
              </Typography>
              <Typography variant="h4">{stats.scheduledPosts}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Published Posts
              </Typography>
              <Typography variant="h4">{stats.publishedPosts}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Engagement
              </Typography>
              <Typography variant="h4">
                {stats.engagement.likes + stats.engagement.shares + stats.engagement.comments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Engagement Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Engagement Over Time
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line
                data={chartData}
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

        {/* Recent Posts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Posts
            </Typography>
            <List>
              {recentPosts.map((post) => (
                <ListItem key={post._id}>
                  <ListItemText
                    primary={post.content.substring(0, 50) + '...'}
                    secondary={new Date(post.createdAt).toLocaleDateString()}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Connected Accounts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Connected Accounts
            </Typography>
            <List>
              {socialPlatforms.map((platform) => (
                <ListItem key={platform.name}>
                  <ListItemIcon sx={{ color: platform.color }}>
                    {platform.icon}
                  </ListItemIcon>
                  <ListItemText primary={platform.name} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 