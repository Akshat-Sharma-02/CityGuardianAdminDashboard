import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Avatar, Grid, Button, Divider, Chip, IconButton, GlobalStyles, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import SecurityIcon from '@mui/icons-material/Security';
import CelebrationIcon from '@mui/icons-material/Celebration';
import EditIcon from '@mui/icons-material/Edit';
import KeyIcon from '@mui/icons-material/Key';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import api from '../api/api';

export default function AdminProfile({ adminUser, onLogout, setAdminUser }) {
  const navigate = useNavigate();

  // state for modals
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  
  // edit profile state
  const [name, setName] = useState(adminUser?.name || '');
  const [email, setEmail] = useState(adminUser?.email || '');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState(adminUser?.profilePicture || '');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  // change password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // image handling
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  // api calls
  const handleEditProfile = async () => {
    setEditError('');
    setEditSuccess('');
    setEditLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }

      const res = await api.put('/admin/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setEditSuccess('Profile updated successfully!');
        if (setAdminUser) {
           setAdminUser(res.data.user);
           localStorage.setItem('adminUser', JSON.stringify(res.data.user));
        }
        setTimeout(() => setOpenEditProfile(false), 1500);
      }
    } catch (err) {
      setEditError(err.response?.data?.msg || 'Error updating profile');
    } finally {
      setEditLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await api.put('/admin/change-password', {
        oldPassword,
        newPassword
      });

      if (res.data.success) {
        setPasswordSuccess('Password changed successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setOpenChangePassword(false), 1500);
      }
    } catch (err) {
      setPasswordError(err.response?.data?.msg || 'Error changing password');
    } finally {
      setPasswordLoading(false);
    }
  };

  // cleanup modal state
  const handleCloseEdit = () => {
    setOpenEditProfile(false);
    // reset
    setName(adminUser?.name || '');
    setEmail(adminUser?.email || '');
    setProfilePicture(null);
    setProfilePreview(adminUser?.profilePicture || '');
    setEditError('');
    setEditSuccess('');
  };

  const handleClosePassword = () => {
    setOpenChangePassword(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setPasswordSuccess('');
  };

  if (!adminUser) return null;

  return (
    <Box sx={{ width: '100%', p: 1, pb: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <GlobalStyles styles={{ 'html, body': { overflow: 'hidden !important', margin: 0, padding: 0, height: '100%' } }} />
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton 
            onClick={() => navigate(-1)}
            sx={{ 
              bgcolor: 'white', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              '&:hover': { bgcolor: '#f8fafc', transform: 'scale(1.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
              transition: 'all 0.2s',
              color: 'text.primary',
              width: 40, height: 40
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px' }}>Administrator Hub</Typography>
        </Box>
        <Button variant="contained" color="error" startIcon={<LogoutIcon />} onClick={onLogout} disableElevation sx={{ fontWeight: 800, borderRadius: 2 }}>Sign Out</Button>
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2, minHeight: 0 }}>
        
        <Box sx={{ display: 'flex', gap: 2, width: '100%', flex: 1, minHeight: 0 }}>
          
          <Paper elevation={0} sx={{ 
            flex: { xs: '1 1 100%', md: '1 1 65%' }, 
            height: '100%',
            p: 2.5, 
            borderRadius: 4, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2.5, 
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', 
            border: '1px solid #e2e8f0', 
            position: 'relative', 
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}>
            <Box sx={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, bgcolor: '#3b82f6', opacity: 0.05, borderRadius: '50%', filter: 'blur(30px)' }} />
            <Avatar src={adminUser.profilePicture || ''} sx={{ width: 100, height: 100, border: '4px solid white', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', fontSize: '2.5rem', fontWeight: 800, bgcolor: 'primary.main', zIndex: 1 }}>
              {!adminUser.profilePicture && adminUser.name?.charAt(0)}
            </Avatar>
            <Box sx={{ zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
              <Box>
                <Chip label="SYSTEM ADMINISTRATOR" size="small" icon={<AdminPanelSettingsIcon />} sx={{ bgcolor: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', fontWeight: 800, mb: 1.5, px: 1, borderRadius: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', mb: 0 }}>{adminUser.name}</Typography>
                <Typography variant="subtitle1" sx={{ color: '#64748b', fontWeight: 600, mb: 2 }}>@{adminUser.username || adminUser.email.split('@')[0]}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                 <Button 
                   size="small" 
                   variant="outlined" 
                   startIcon={<EditIcon />} 
                   onClick={() => setOpenEditProfile(true)}
                   sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                 >
                   Edit Info
                 </Button>
                 <Button 
                   size="small" 
                   variant="outlined" 
                   startIcon={<KeyIcon />} 
                   onClick={() => setOpenChangePassword(true)}
                   color="secondary"
                   sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                 >
                   Change Password
                 </Button>
              </Box>
            </Box>
          </Paper>

          <Paper elevation={0} sx={{ 
            flex: { xs: '1 1 100%', md: '1 1 30%' }, 
            height: '100%',
            p: 2.5, 
            borderRadius: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            bgcolor: '#10b981', 
            color: 'white', 
            position: 'relative', 
            overflow: 'hidden', 
            boxSizing: 'border-box'
          }}>
            <SecurityIcon sx={{ position: 'absolute', right: -15, bottom: -15, fontSize: 130, opacity: 0.15 }} />
            <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: 1, opacity: 0.9, mb: 0, display: 'block' }}>SECURITY CLEARANCE</Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-1px' }}>Tier 5</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5, opacity: 0.9 }}>Maximum System Access</Typography>
          </Paper>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, width: '100%', flex: 1, minHeight: 0, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
          
          <Paper elevation={0} sx={{ 
            flex: '1 1 30%', 
            p: 2.5, 
            borderRadius: 4, 
            border: '1px solid #e2e8f0', 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <EmailOutlinedIcon sx={{ fontSize: 32, color: '#3b82f6', mb: 1 }} />
            <Typography variant="overline" sx={{ color: '#94a3b8', fontWeight: 800, letterSpacing: 1, mb: 0 }}>CONTACT PROTOCOL</Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', wordBreak: 'break-all', lineHeight: 1.2, mb: 1, fontSize: '1.1rem' }}>{adminUser.email}</Typography>
            <Chip label="Verified Secure Line" size="small" sx={{ bgcolor: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: 700, fontSize: '0.7rem', width: 'fit-content' }} />
          </Paper>

          <Paper elevation={0} sx={{ 
            flex: '1 1 25%', 
            p: 2.5, 
            borderRadius: 4, 
            border: '1px solid #e2e8f0', 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <CelebrationIcon sx={{ fontSize: 32, color: '#f59e0b', mb: 1 }} />
            <Typography variant="overline" sx={{ color: '#94a3b8', fontWeight: 800, letterSpacing: 1, mb: 0 }}>INDUCTION DATE</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', fontSize: '2rem' }}>
              {adminUser.createdAt ? new Date(adminUser.createdAt).getFullYear() : 'Genesis'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
              {adminUser.createdAt ? new Date(adminUser.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'System Core Epoch'}
            </Typography>
          </Paper>

          <Paper elevation={0} sx={{ 
            flex: '1 1 40%', 
            p: 2.5, 
            borderRadius: 4, 
            bgcolor: '#0f172a', 
            color: 'white',
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: '#ef4444' }} />
            <Typography variant="overline" sx={{ color: '#94a3b8', fontWeight: 800, letterSpacing: 1, mb: 1, display: 'block' }}>AUDITING NOTICE</Typography>
            <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.5, fontWeight: 500, fontSize: '0.85rem' }}>
              System configuration changes, user state manipulation, and municipal interventions performed by this profile are recorded.
              <br/><br/>
              <strong style={{ color: '#f8fafc' }}>Actions are continuously traced for municipal auditing.</strong> Ensure absolute credentials security.
            </Typography>
          </Paper>

        </Box>
      </Box>

      {/* Edit Profile Dialog */}
      <Dialog open={openEditProfile} onClose={handleCloseEdit} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Edit Administrator Info</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {editError && <Alert severity="error">{editError}</Alert>}
          {editSuccess && <Alert severity="success">{editSuccess}</Alert>}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mt: 1 }}>
            <Avatar src={profilePreview} sx={{ width: 80, height: 80, fontSize: '2rem' }}>
              {!profilePreview && adminUser.name?.charAt(0)}
            </Avatar>
            <Button component="label" variant="text" size="small" startIcon={<CloudUploadIcon />} sx={{ textTransform: 'none', fontWeight: 600 }}>
              Upload Picture
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
          </Box>

          <TextField 
            label="Name" 
            variant="outlined" 
            fullWidth 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
          <TextField 
            label="Email Address" 
            variant="outlined" 
            fullWidth 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseEdit} sx={{ fontWeight: 600, color: 'text.secondary' }}>Cancel</Button>
          <Button 
            onClick={handleEditProfile} 
            variant="contained" 
            disabled={editLoading}
            sx={{ fontWeight: 600, borderRadius: 2 }}
          >
            {editLoading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={openChangePassword} onClose={handleClosePassword} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Change Security Credentials</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {passwordError && <Alert severity="error">{passwordError}</Alert>}
          {passwordSuccess && <Alert severity="success">{passwordSuccess}</Alert>}
          
          <TextField 
            label="Current Password" 
            type="password"
            variant="outlined" 
            fullWidth 
            value={oldPassword} 
            onChange={(e) => setOldPassword(e.target.value)} 
            sx={{ mt: 1 }}
          />
          <TextField 
            label="New Password" 
            type="password"
            variant="outlined" 
            fullWidth 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
          />
          <TextField 
            label="Confirm New Password" 
            type="password"
            variant="outlined" 
            fullWidth 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClosePassword} sx={{ fontWeight: 600, color: 'text.secondary' }}>Cancel</Button>
          <Button 
            onClick={handleChangePassword} 
            variant="contained" 
            color="secondary"
            disabled={passwordLoading}
            sx={{ fontWeight: 600, borderRadius: 2 }}
          >
            {passwordLoading ? <CircularProgress size={24} /> : 'Update Password'}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
