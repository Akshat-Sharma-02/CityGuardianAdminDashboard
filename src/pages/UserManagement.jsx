import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Chip, Avatar, CircularProgress, Alert, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid, Divider
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import api from '../api/api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmBanOpen, setIsConfirmBanOpen] = useState(false);
  const [userToToggleBan, setUserToToggleBan] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openBanConfirm = (user) => {
    setUserToToggleBan(user);
    setIsConfirmBanOpen(true);
  };

  const handleToggleBan = async (userId, currentStatus) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/ban`);
      if (res.data.success) {
        setUsers(users.map(u => u._id === userId ? { ...u, isBanned: res.data.data.isBanned } : u));
        setIsConfirmBanOpen(false);
        setUserToToggleBan(null);
        if (selectedUser && selectedUser._id === userId) {
             setSelectedUser({ ...selectedUser, isBanned: res.data.data.isBanned });
        }
      }
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to toggle ban status');
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  const adminUsers = users.filter(u => u.role === 'admin');
  const regularUsers = users.filter(u => u.role !== 'admin');

  const renderUserTable = (data, title, headerBg) => (
    <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', mb: 1, display: 'flex', alignItems: 'center' }}>
        {title} 
        <Chip label={data.length} size="small" sx={{ ml: 1.5, fontWeight: 700, bgcolor: 'rgba(0,0,0,0.05)' }} />
      </Typography>
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: headerBg }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', py: 2, fontSize: '0.75rem', letterSpacing: 0.5 }}>User</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', py: 2, fontSize: '0.75rem', letterSpacing: 0.5 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', py: 2, fontSize: '0.75rem', letterSpacing: 0.5 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', textAlign: 'center', py: 2, fontSize: '0.75rem', letterSpacing: 0.5 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary', fontWeight: 500 }}>
                  No {title.toLowerCase()} found.
                </TableCell>
              </TableRow>
            ) : data.map((user) => (
              <TableRow key={user._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, transition: 'background-color 0.2s', '&:hover': { background: '#f8fafc' } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      src={user.profilePicture}
                      sx={{ bgcolor: 'secondary.main', width: 36, height: 36, mr: 2, fontSize: '0.9rem', fontWeight: 600 }}
                    >
                      {!user.profilePicture && (user.name?.charAt(0) || 'U')}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>{user.name}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{user.email}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.role} 
                    size="small"
                    sx={{ 
                      fontWeight: 700, 
                      borderRadius: 2,
                      fontSize: '0.7rem',
                      letterSpacing: 0.5,
                      textTransform: 'uppercase',
                      bgcolor: user.role === 'admin' ? 'rgba(37, 99, 235, 0.1)' : '#f1f5f9',
                      color: user.role === 'admin' ? '#2563eb' : '#475569',
                      border: '1px solid',
                      borderColor: user.role === 'admin' ? 'rgba(37, 99, 235, 0.2)' : '#e2e8f0'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.isBanned ? "BANNED" : "ACTIVE"} 
                    size="small"
                    sx={{
                      fontWeight: 700,
                      borderRadius: 2,
                      bgcolor: user.isBanned ? '#fee2e2' : '#dcfce7',
                      color: user.isBanned ? '#ef4444' : '#10b981'
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <IconButton 
                      title="View Details"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsModalOpen(true);
                      }}
                      sx={{ 
                        color: 'secondary.main', 
                        bgcolor: 'rgba(37, 99, 235, 0.05)', 
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: 'rgba(37, 99, 235, 0.15)', transform: 'scale(1.05)' } 
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    
                    {user.role !== 'admin' && (
                      <IconButton 
                        title={user.isBanned ? "Unban User" : "Ban User"}
                        onClick={() => openBanConfirm(user)}
                        sx={{ 
                          color: user.isBanned ? 'success.main' : 'warning.main', 
                          bgcolor: user.isBanned ? 'rgba(16, 185, 129, 0.05)' : 'rgba(245, 158, 11, 0.05)', 
                          transition: 'all 0.2s',
                          '&:hover': { 
                            bgcolor: user.isBanned ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', 
                            transform: 'scale(1.05)' 
                          } 
                        }}
                      >
                        {user.isBanned ? <CheckCircleOutlineIcon fontSize="small" /> : <BlockIcon fontSize="small" />}
                      </IconButton>
                    )}

                    {user.role !== 'admin' && (
                      <IconButton 
                        title="Delete User"
                        sx={{ 
                          color: 'error.main', 
                          bgcolor: 'rgba(239, 68, 68, 0.05)', 
                          transition: 'all 0.2s',
                          '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.15)', transform: 'scale(1.05)' } 
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box sx={{ width: '100%', px: 4, py: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px' }}>
          User Management
        </Typography>
      </Box>
      
      {error && <Alert severity="error" sx={{ mb: 1, flexShrink: 0 }}>{error}</Alert>}
      
      <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1, display: 'flex', flexDirection: 'column' }}>
        {renderUserTable(adminUsers, "Administrators", "rgba(37, 99, 235, 0.05)")}
        {renderUserTable(regularUsers, "Standard Users", "rgba(241, 245, 249, 0.6)")}
      </Box>

      <Dialog 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: 3, 
            bgcolor: 'background.paper',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)'
          } 
        }}
      >
        {selectedUser && (
          <Box sx={{ position: 'relative' }}>
            <IconButton 
              onClick={() => setIsModalOpen(false)}
              sx={{ position: 'absolute', top: 12, right: 12, zIndex: 10, color: 'text.secondary', bgcolor: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: 'white' } }}
            >
              <CloseIcon />
            </IconButton>

            <DialogContent sx={{ p: 0 }}>
              <Box sx={{ bgcolor: 'rgba(37, 99, 235, 0.05)', height: 80, position: 'relative', borderBottom: '1px solid rgba(0,0,0,0.03)' }} />

              <Box sx={{ px: { xs: 3, sm: 5 }, pb: 3, pt: 0, position: 'relative' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Avatar 
                  src={selectedUser.profilePicture}
                  sx={{ 
                    bgcolor: 'primary.main', 
                    width: 76, 
                    height: 76, 
                    fontSize: '2rem', 
                    fontWeight: 800,
                    border: '4px solid white',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                    mt: -4
                  }}
                >
                  {!selectedUser.profilePicture && (selectedUser.name?.charAt(0) || 'U')}
                </Avatar>
                
                <Box sx={{ mt: 2 }}>
                  <Chip 
                    label={selectedUser.role} 
                    size="small"
                    sx={{
                      fontWeight: 700, borderRadius: 1.5, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5,
                      bgcolor: selectedUser.role === 'admin' ? 'rgba(37, 99, 235, 0.08)' : '#f1f5f9',
                      color: selectedUser.role === 'admin' ? '#2563eb' : '#475569',
                    }}
                  />
                </Box>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px' }}>{selectedUser.name}</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  @{selectedUser.username || selectedUser.email.split('@')[0]}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
                {[
                  { 
                    icon: <EmailOutlinedIcon fontSize="small" />, 
                    label: 'Email', 
                    value: selectedUser.email,
                    color: '#2563eb',
                    bgcolor: 'rgba(37, 99, 235, 0.1)'
                  },
                  { 
                    icon: <PhoneOutlinedIcon fontSize="small" />, 
                    label: 'Phone', 
                    value: selectedUser.phone || 'Not provided',
                    color: '#2563eb',
                    bgcolor: 'rgba(37, 99, 235, 0.1)'
                  },
                  { 
                    icon: <CalendarMonthOutlinedIcon fontSize="small" />, 
                    label: 'Joined', 
                    value: new Date(selectedUser.createdAt).toLocaleDateString(),
                    color: '#10b981',
                    bgcolor: 'rgba(16, 185, 129, 0.1)'
                  },
                  { 
                    icon: <VerifiedUserOutlinedIcon fontSize="small" />, 
                    label: 'Status', 
                    value: selectedUser.isBanned ? "Suspended" : "Active",
                    color: selectedUser.isBanned ? '#ef4444' : '#10b981',
                    bgcolor: selectedUser.isBanned ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'
                  }
                ].map((detail, idx) => (
                  <Box 
                    key={idx}
                    sx={{ 
                      flex: 1,
                      minWidth: 180,
                      maxWidth: 250,
                      display: 'flex', 
                      alignItems: 'center', 
                      p: 1.5, 
                      borderRadius: 2, 
                      bgcolor: '#f8fafc', 
                      border: '1px solid #f1f5f9'
                    }}
                  >
                    <Box sx={{ width: 36, height: 36, flexShrink: 0, borderRadius: 2, bgcolor: detail.bgcolor, color: detail.color, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                      {detail.icon}
                    </Box>
                    <Box sx={{ overflow: 'hidden' }}>
                      <Typography variant="overline" sx={{ color: 'text.disabled', fontWeight: 700, letterSpacing: 0.5, display: 'block', lineHeight: 1 }}>{detail.label}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: detail.label === 'Status' ? 700 : 600, color: detail.label === 'Status' ? detail.color : 'text.primary', mt: 0.5, textTransform: detail.label === 'Status' ? 'uppercase' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {detail.value}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Typography variant="overline" sx={{ color: 'text.disabled', fontWeight: 700, letterSpacing: 1, display: 'block', mb: 1.5 }}>Performance Metrics</Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {[
                  { value: selectedUser.guardianPoints || 0, label: 'Points' },
                  { value: selectedUser.falseReportStreak || 0, label: 'False Flags' },
                  { value: selectedUser.redeemedOffers?.length || 0, label: 'Redemptions' }
                ].map((stat, idx) => (
                  <Box 
                    key={idx}
                    sx={{ 
                      flex: 1,
                      minWidth: 100,
                      maxWidth: 160,
                      p: 1.5, 
                      bgcolor: '#f8fafc', 
                      borderRadius: 3, 
                      border: '1px solid #f1f5f9',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>{stat.value}</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: 0.5 }}>{stat.label}</Typography>
                  </Box>
                ))}
              </Box>
              </Box>
            </DialogContent>
            
            <DialogActions sx={{ px: { xs: 3, sm: 5 }, py: 2, bgcolor: '#f8fafc', borderTop: '1px solid rgba(0,0,0,0.03)', justifyContent: 'space-between' }}>
              <Box>
                {selectedUser.role !== 'admin' && (
                  <Button 
                    onClick={() => openBanConfirm(selectedUser)} 
                    disableElevation
                    variant={selectedUser.isBanned ? "contained" : "outlined"}
                    color={selectedUser.isBanned ? "success" : "error"}
                    sx={{ 
                      fontWeight: 700, 
                      borderRadius: 2, 
                      px: 3,
                      textTransform: 'none',
                      borderWidth: selectedUser.isBanned ? 0 : 2,
                      '&:hover': { borderWidth: selectedUser.isBanned ? 0 : 2 }
                    }}
                  >
                    {selectedUser.isBanned ? "Restore Account" : "Suspend Account"}
                  </Button>
                )}
              </Box>
              <Button onClick={() => setIsModalOpen(false)} sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'none' }}>
                Close
              </Button>
            </DialogActions>
          </Box>
        )}
      </Dialog>

      <Dialog 
        open={isConfirmBanOpen} 
        onClose={() => setIsConfirmBanOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: 'text.primary' }}>
          {userToToggleBan?.isBanned ? "Restore Account" : "Suspend Account"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {userToToggleBan?.isBanned 
              ? `Are you sure you want to unban ${userToToggleBan?.name}? They will regain full access to the application.` 
              : `Are you sure you want to suspend ${userToToggleBan?.name}? They will be logged out and prevented from using the app.`}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setIsConfirmBanOpen(false)} sx={{ fontWeight: 700, color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button 
            onClick={() => handleToggleBan(userToToggleBan._id, userToToggleBan.isBanned)}
            autoFocus
            disableElevation
            variant="contained"
            color={userToToggleBan?.isBanned ? "success" : "error"}
            sx={{ fontWeight: 700, borderRadius: 2 }}
          >
            {userToToggleBan?.isBanned ? "Yes, Unban" : "Yes, Suspend"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
