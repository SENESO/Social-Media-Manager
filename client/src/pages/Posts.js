import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';
import axios from 'axios';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    content: '',
    platforms: [],
    scheduledTime: new Date(),
    mediaUrls: [],
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleOpen = (post = null) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        content: post.content,
        platforms: post.platforms,
        scheduledTime: post.scheduledFor ? new Date(post.scheduledFor) : new Date(),
        mediaUrls: post.mediaUrls,
      });
    } else {
      setEditingPost(null);
      setFormData({
        content: '',
        platforms: [],
        scheduledTime: new Date(),
        mediaUrls: [],
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingPost(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPost) {
        await axios.put(`/api/posts/${editingPost._id}`, formData);
      } else {
        await axios.post('/api/posts', formData);
      }
      fetchPosts();
      handleClose();
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`/api/posts/${postId}`);
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handlePublish = async (postId) => {
    try {
      await axios.post(`/api/posts/${postId}/publish`);
      fetchPosts();
    } catch (error) {
      console.error('Error publishing post:', error);
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'twitter':
        return <TwitterIcon sx={{ color: '#1DA1F2' }} />;
      case 'facebook':
        return <FacebookIcon sx={{ color: '#4267B2' }} />;
      case 'instagram':
        return <InstagramIcon sx={{ color: '#E1306C' }} />;
      case 'linkedin':
        return <LinkedInIcon sx={{ color: '#0077B5' }} />;
      default:
        return null;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Posts</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Create Post
        </Button>
      </Box>

      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} md={6} lg={4} key={post._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {post.content.substring(0, 100)}
                  {post.content.length > 100 ? '...' : ''}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {post.platforms.map((platform) => (
                    <Chip
                      key={platform}
                      icon={getPlatformIcon(platform)}
                      label={platform}
                      sx={{ mr: 1 }}
                    />
                  ))}
                </Box>
                <Typography color="textSecondary">
                  Scheduled for:{' '}
                  {post.scheduledFor
                    ? new Date(post.scheduledFor).toLocaleString()
                    : 'Not scheduled'}
                </Typography>
                <Typography color="textSecondary">
                  Status: {post.status}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleOpen(post)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(post._id)}>
                  <DeleteIcon />
                </IconButton>
                {post.status === 'scheduled' && (
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handlePublish(post._id)}
                  >
                    Publish Now
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingPost ? 'Edit Post' : 'Create New Post'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Platforms</InputLabel>
              <Select
                multiple
                value={formData.platforms}
                onChange={(e) =>
                  setFormData({ ...formData, platforms: e.target.value })
                }
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        icon={getPlatformIcon(value)}
                        label={value}
                      />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="twitter">Twitter</MenuItem>
                <MenuItem value="facebook">Facebook</MenuItem>
                <MenuItem value="instagram">Instagram</MenuItem>
                <MenuItem value="linkedin">LinkedIn</MenuItem>
              </Select>
            </FormControl>
            <DateTimePicker
              label="Schedule Time"
              value={formData.scheduledTime}
              onChange={(newValue) =>
                setFormData({ ...formData, scheduledTime: newValue })
              }
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingPost ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Posts; 