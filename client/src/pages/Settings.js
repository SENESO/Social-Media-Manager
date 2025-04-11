import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

function Settings() {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [socialAccounts, setSocialAccounts] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        ...profileData,
        name: user.name,
        email: user.email,
      });
      fetchSocialAccounts();
    }
  }, [user]);

  const fetchSocialAccounts = async () => {
    try {
      const response = await axios.get('/api/social/accounts');
      setSocialAccounts(response.data);
    } catch (error) {
      console.error('Error fetching social accounts:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/auth/profile', {
        name: profileData.name,
        email: profileData.email,
      });
      setSuccess('Profile updated successfully');
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating profile');
      setSuccess('');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (profileData.newPassword !== profileData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      await axios.put('/api/auth/password', {
        currentPassword: profileData.currentPassword,
        newPassword: profileData.newPassword,
      });
      setSuccess('Password updated successfully');
      setError('');
      setProfileData({
        ...profileData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating password');
      setSuccess('');
    }
  };

  const handleSocialConnect = async (platform) => {
    // In a real application, this would redirect to the platform's OAuth flow
    try {
      const response = await axios.post(`/api/social/connect/${platform}`, {
        // Add necessary OAuth tokens and data
      });
      fetchSocialAccounts();
      setSuccess(`${platform} account connected successfully`);
      setError('');
    } catch (error) {
      setError(`Error connecting ${platform} account`);
      setSuccess('');
    }
  };

  const handleSocialDisconnect = async (platform) => {
    try {
      await axios.delete(`/api/social/disconnect/${platform}`);
      fetchSocialAccounts();
      setSuccess(`${platform} account disconnected successfully`);
      setError('');
    } catch (error) {
      setError(`Error disconnecting ${platform} account`);
      setSuccess('');
    }
  };

  const socialPlatforms = [
    { name: 'twitter', icon: <TwitterIcon />, color: '#1DA1F2', label: 'Twitter' },
    { name: 'facebook', icon: <FacebookIcon />, color: '#4267B2', label: 'Facebook' },
    { name: 'instagram', icon: <InstagramIcon />, color: '#E1306C', label: 'Instagram' },
    { name: 'linkedin', icon: <LinkedInIcon />, color: '#0077B5', label: 'LinkedIn' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Profile Settings
            </Typography>
            <Box component="form" onSubmit={handleProfileUpdate}>
              <TextField
                fullWidth
                label="Name"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
                margin="normal"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Update Profile
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Password Change */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <Box component="form" onSubmit={handlePasswordChange}>
              <TextField
                fullWidth
                label="Current Password"
                type="password"
                value={profileData.currentPassword}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    currentPassword: e.target.value,
                  })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={profileData.newPassword}
                onChange={(e) =>
                  setProfileData({ ...profileData, newPassword: e.target.value })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                value={profileData.confirmPassword}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    confirmPassword: e.target.value,
                  })
                }
                margin="normal"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Change Password
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Social Media Accounts */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Connected Social Media Accounts
            </Typography>
            <List>
              {socialPlatforms.map((platform) => (
                <React.Fragment key={platform.name}>
                  <ListItem>
                    <ListItemIcon sx={{ color: platform.color }}>
                      {platform.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={platform.label}
                      secondary={
                        socialAccounts[platform.name]
                          ? `Connected as ${
                              socialAccounts[platform.name].username
                            }`
                          : 'Not connected'
                      }
                    />
                    <ListItemSecondaryAction>
                      {socialAccounts[platform.name] ? (
                        <IconButton
                          edge="end"
                          onClick={() => handleSocialDisconnect(platform.name)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      ) : (
                        <Button
                          variant="outlined"
                          onClick={() => handleSocialConnect(platform.name)}
                        >
                          Connect
                        </Button>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Settings; 