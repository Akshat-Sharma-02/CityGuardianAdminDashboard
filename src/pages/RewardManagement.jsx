import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Grid, Card, CardContent, IconButton, Button, 
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, 
  DialogActions, TextField, MenuItem, Switch, FormControlLabel, Tooltip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import SecurityIcon from '@mui/icons-material/Security';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import ParkIcon from '@mui/icons-material/Park';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SchoolIcon from '@mui/icons-material/School';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import TheatersIcon from '@mui/icons-material/Theaters';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import PetsIcon from '@mui/icons-material/Pets';
import FlightIcon from '@mui/icons-material/Flight';
import HotelIcon from '@mui/icons-material/Hotel';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import RedeemIcon from '@mui/icons-material/Redeem';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import api from '../api/api';

const iconOptions = [
  { value: 'storefront', label: 'Storefront', icon: <StorefrontIcon /> },
  { value: 'verified', label: 'Verified Badge', icon: <VerifiedIcon /> },
  { value: 'local_cafe', label: 'Coffee Cup', icon: <LocalCafeIcon /> },
  { value: 'directions_bus', label: 'Bus', icon: <DirectionsBusIcon /> },
  { value: 'park', label: 'Tree / Park', icon: <ParkIcon /> },
  { value: 'card_giftcard', label: 'Gift Card', icon: <CardGiftcardIcon /> },
  { value: 'star', label: 'Gold Star', icon: <StarIcon /> },
  { value: 'favorite', label: 'Heart', icon: <FavoriteIcon /> },
  { value: 'emoji_events', label: 'Trophy', icon: <EmojiEventsIcon /> },
  { value: 'local_dining', label: 'Restaurant', icon: <LocalDiningIcon /> },
  { value: 'local_mall', label: 'Shopping Mall', icon: <LocalMallIcon /> },
  { value: 'directions_car', label: 'Car/Parking', icon: <DirectionsCarIcon /> },
  { value: 'directions_bike', label: 'Bicycle', icon: <DirectionsBikeIcon /> },
  { value: 'fitness_center', label: 'Gym/Fitness', icon: <FitnessCenterIcon /> },
  { value: 'local_hospital', label: 'Health/Clinic', icon: <LocalHospitalIcon /> },
  { value: 'school', label: 'School/Education', icon: <SchoolIcon /> },
  { value: 'local_library', label: 'Library/Books', icon: <LocalLibraryIcon /> },
  { value: 'theaters', label: 'Movie Theater', icon: <TheatersIcon /> },
  { value: 'music_note', label: 'Concerts/Music', icon: <MusicNoteIcon /> },
  { value: 'sports_esports', label: 'Gaming', icon: <SportsEsportsIcon /> },
  { value: 'fastfood', label: 'Fast Food', icon: <FastfoodIcon /> },
  { value: 'local_pizza', label: 'Pizza', icon: <LocalPizzaIcon /> },
  { value: 'pets', label: 'Pets/Veterinary', icon: <PetsIcon /> },
  { value: 'flight', label: 'Travel/Flights', icon: <FlightIcon /> },
  { value: 'hotel', label: 'Hotels/Lodging', icon: <HotelIcon /> },
  { value: 'confirmation_number', label: 'Tickets', icon: <ConfirmationNumberIcon /> },
  { value: 'workspace_premium', label: 'Premium Crown', icon: <WorkspacePremiumIcon /> },
  { value: 'redeem', label: 'Redeem Box', icon: <RedeemIcon /> },
  { value: 'local_shipping', label: 'Free Delivery', icon: <LocalShippingIcon /> },
  { value: 'volunteer_activism', label: 'Charity/Donation', icon: <VolunteerActivismIcon /> },
  { value: 'security', label: 'Guardian Shield', icon: <SecurityIcon /> }
];

const colorOptions = [
  { value: 'orange', label: 'Citrus Orange', hex: '#f97316' },
  { value: 'purple', label: 'Royal Purple', hex: '#a855f7' },
  { value: 'brown', label: 'Earth Brown', hex: '#8B4513' },
  { value: 'blue', label: 'Ocean Blue', hex: '#3b82f6' },
  { value: 'green', label: 'Nature Green', hex: '#22c55e' },
  { value: 'red', label: 'Alert Red', hex: '#ef4444' },
  { value: 'yellow', label: 'Sun Yellow', hex: '#eab308' },
  { value: 'slate', label: 'Slate Gray', hex: '#64748b' },
  { value: 'zinc', label: 'Zinc Dark', hex: '#71717a' },
  { value: 'neutral', label: 'Neutral Gray', hex: '#737373' },
  { value: 'rose', label: 'Rose Pink', hex: '#f43f5e' },
  { value: 'pink', label: 'Bubblegum Pink', hex: '#ec4899' },
  { value: 'fuchsia', label: 'Neon Fuchsia', hex: '#d946ef' },
  { value: 'violet', label: 'Violet', hex: '#8b5cf6' },
  { value: 'indigo', label: 'Deep Indigo', hex: '#6366f1' },
  { value: 'sky', label: 'Sky Blue', hex: '#0ea5e9' },
  { value: 'cyan', label: 'Neon Cyan', hex: '#06b6d4' },
  { value: 'teal', label: 'Teal', hex: '#14b8a6' },
  { value: 'emerald', label: 'Emerald Green', hex: '#10b981' },
  { value: 'lime', label: 'Lime Green', hex: '#84cc16' },
  { value: 'amber', label: 'Amber Gold', hex: '#f59e0b' },
  { value: 'orangeRed', label: 'Orange Red', hex: '#ff4500' },
  { value: 'crimson', label: 'Crimson', hex: '#dc143c' },
  { value: 'darkRed', label: 'Dark Blood Red', hex: '#8b0000' },
  { value: 'gold', label: 'Pure Gold', hex: '#ffd700' },
  { value: 'navy', label: 'Navy Blue', hex: '#000080' },
  { value: 'royalBlue', label: 'Royal Blue', hex: '#4169e1' },
  { value: 'darkGreen', label: 'Forest Green', hex: '#006400' },
  { value: 'olive', label: 'Olive Drab', hex: '#808000' },
  { value: 'maroon', label: 'Maroon', hex: '#800000' },
  { value: 'midnight', label: 'Midnight Blue', hex: '#1e3a8a' },
  { value: 'black', label: 'Pitch Black', hex: '#000000' }
];

export default function RewardManagement() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', pointsCost: 1000, iconName: 'card_giftcard', colorName: 'blue' });
  const [targetReward, setTargetReward] = useState(null);
  const [viewingReward, setViewingReward] = useState(null);

  const fetchRewards = async () => {
    try {
      const res = await api.get('/admin/rewards');
      if (res.data.success) {
        setRewards(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch rewards", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const handleOpenModal = (reward = null) => {
    if (reward) {
      setEditingId(reward._id);
      setFormData({
        title: reward.title,
        description: reward.description,
        pointsCost: reward.pointsCost,
        iconName: reward.iconName,
        colorName: reward.colorName
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', description: '', pointsCost: 1000, iconName: 'card_giftcard', colorName: 'blue' });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveReward = async () => {
    try {
      if (editingId) {
        await api.put(`/admin/rewards/${editingId}`, formData);
      } else {
        await api.post('/admin/rewards', formData);
      }
      fetchRewards();
      handleCloseModal();
    } catch (err) {
      alert("Error saving reward. " + (err.response?.data?.msg || err.message));
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/admin/rewards/${targetReward._id}`);
      fetchRewards();
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const getPreviewIcon = (iconName, colorName) => {
    const iconObj = iconOptions.find(i => i.value === iconName) || iconOptions[5];
    const colorObj = colorOptions.find(c => c.value === colorName) || colorOptions[3];
    return React.cloneElement(iconObj.icon, { sx: { fontSize: 40, color: colorObj.hex } });
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress size={60} thickness={4} sx={{ color: '#4f46e5' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: { xs: 2, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#f1f5f9' }}>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Reward Management
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', mt: 0.5 }}>
            Create and modify the redemption offers available to users.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
          sx={{ borderRadius: 3, fontWeight: 700, px: 3, py: 1, boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)' }}
        >
          Add Reward
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto', pb: 4, pr: 1 }}>
        <TableContainer component={Paper} elevation={0} sx={{ 
          borderRadius: 4, 
          border: '1px solid #e2e8f0',
          bgcolor: 'white'
        }}>
          <Table sx={{ minWidth: 650 }} aria-label="reward table">
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Reward</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Description</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Cost (Guardian Points)</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rewards.map((reward) => (
                <TableRow
                  key={reward._id}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { bgcolor: '#f8fafc' },
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <TableCell component="th" scope="row">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: 3, 
                        display: 'flex',
                        bgcolor: `${colorOptions.find(c => c.value === reward.colorName)?.hex}15`
                      }}>
                        {getPreviewIcon(reward.iconName, reward.colorName)}
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        {reward.title}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {reward.description}
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e3a8a', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                      <SecurityIcon fontSize="small" sx={{ mb: '2px' }} /> {reward.pointsCost.toLocaleString()}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          onClick={() => { setViewingReward(reward); setViewModalOpen(true); }} 
                          sx={{ 
                            color: 'secondary.main', 
                            bgcolor: 'rgba(37, 99, 235, 0.05)', 
                            transition: 'all 0.2s',
                            '&:hover': { bgcolor: 'rgba(37, 99, 235, 0.15)', transform: 'scale(1.05)' } 
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Reward">
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenModal(reward)} 
                          sx={{ 
                            color: '#64748b', 
                            bgcolor: 'rgba(100, 116, 139, 0.05)', 
                            transition: 'all 0.2s',
                            '&:hover': { bgcolor: 'rgba(100, 116, 139, 0.15)', transform: 'scale(1.05)' } 
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Reward">
                        <IconButton 
                          size="small" 
                          onClick={() => { setTargetReward(reward); setDeleteDialogOpen(true); }} 
                          sx={{ 
                            color: 'error.main', 
                            bgcolor: 'rgba(239, 68, 68, 0.05)', 
                            transition: 'all 0.2s',
                            '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.15)', transform: 'scale(1.05)' } 
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              
              {rewards.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <CardGiftcardIcon sx={{ fontSize: 60, color: '#cbd5e1' }} />
                      <Typography variant="h6" color="text.secondary">No rewards created yet</Typography>
                      <Typography variant="body2" color="text.secondary">Click "Add Reward" above to get started.</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
          {editingId ? 'Edit Reward Offer' : 'Create New Reward'}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField 
            label="Title" 
            name="title"
            value={formData.title} 
            onChange={handleChange} 
            fullWidth 
            variant="outlined" 
            required
          />
          <TextField 
            label="Description" 
            name="description"
            value={formData.description} 
            onChange={handleChange} 
            fullWidth 
            multiline 
            rows={3} 
            variant="outlined" 
            required
          />
          <TextField 
            label="Points Cost" 
            name="pointsCost"
            type="number" 
            value={formData.pointsCost} 
            onChange={handleChange} 
            fullWidth 
            variant="outlined" 
            required
            InputProps={{ inputProps: { min: 10 } }}
          />
          
          <Box sx={{ display: 'flex', gap: 3 }}>
            <TextField
              select
              label="Icon Name"
              name="iconName"
              value={formData.iconName}
              onChange={handleChange}
              fullWidth
            >
              {iconOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {React.cloneElement(option.icon, { fontSize: 'small' })}
                    {option.label}
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Color Theme"
              name="colorName"
              value={formData.colorName}
              onChange={handleChange}
              fullWidth
            >
              {colorOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: option.hex }} />
                    {option.label}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
          <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
             <Typography variant="body2" color="text.secondary" fontWeight={600}>Icon Preview:</Typography>
             {getPreviewIcon(formData.iconName, formData.colorName)}
          </Paper>

        </DialogContent>
        <DialogActions sx={{ p: 2, px: 3 }}>
          <Button onClick={handleCloseModal} color="inherit" sx={{ fontWeight: 600 }}>Cancel</Button>
          <Button onClick={handleSaveReward} variant="contained" disableElevation sx={{ fontWeight: 700, borderRadius: 2, px: 3 }}>
            {editingId ? 'Save Changes' : 'Create Offer'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Delete Reward</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{targetReward?.title}"? Users will no longer be able to see or redeem this offer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained" disableElevation>Delete Permanently</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}>
        {viewingReward && (
          <>
            <Box sx={{ bgcolor: `${colorOptions.find(c => c.value === viewingReward.colorName)?.hex}15`, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Box sx={{ p: 2, borderRadius: '50%', bgcolor: 'white', mb: 2, boxShadow: '0 4px 14px rgba(0,0,0,0.05)' }}>
                {getPreviewIcon(viewingReward.iconName, viewingReward.colorName)}
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
                {viewingReward.title}
              </Typography>
              <Typography variant="subtitle1" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontWeight: 800, color: '#1e3a8a', bgcolor: 'white', px: 2, py: 0.5, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <SecurityIcon fontSize="small" /> {viewingReward.pointsCost.toLocaleString()} Points
              </Typography>
            </Box>
            <DialogContent sx={{ p: 4 }}>
              <Typography variant="subtitle2" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, mb: 1, fontWeight: 700 }}>
                Description
              </Typography>
              <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.6 }}>
                {viewingReward.description}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2, px: 3, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
              <Button onClick={() => setViewModalOpen(false)} variant="contained" color="inherit" disableElevation sx={{ fontWeight: 600, width: '100%' }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
