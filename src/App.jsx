import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Box, Toolbar, AppBar, Typography, Avatar, IconButton, Badge, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import io from 'socket.io-client';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import PotholeReports from './pages/PotholeReports';
import MapAnalytics from './pages/MapAnalytics';
import HelpSupport from './pages/HelpSupport';
import RewardManagement from './pages/RewardManagement';
import Login from './pages/Login';
import AdminProfile from './pages/AdminProfile';
import api from './api/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!localStorage.getItem('adminToken'));
  const [adminUser, setAdminUser] = React.useState(() => {
    const userStr = localStorage.getItem('adminUser');
    return userStr ? JSON.parse(userStr) : null;
  });
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      api.get('/admin/me')
        .then(res => {
          if (res.data.success) {
            setAdminUser(res.data.user);
            localStorage.setItem('adminUser', JSON.stringify(res.data.user));
          }
        })
        .catch(err => console.error('Failed to fetch active admin details:', err));
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  const [unreadTickets, setUnreadTickets] = React.useState(0);
  const [notificationAnchor, setNotificationAnchor] = React.useState(null);

  const fetchPendingCount = () => {
    api.get('/admin/support')
      .then(res => {
        if (res.data.success) {
          const pending = res.data.data.filter(t => t.status === 'Pending').length;
          setUnreadTickets(pending);
        }
      })
      .catch(console.error);
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchPendingCount();

      const socket = io(import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5002');
      
      socket.on('newSupportTicket', () => {
        setUnreadTickets(prev => prev + 1);
      });
      
      socket.on('ticketUpdated', () => {
        fetchPendingCount();
      });

      socket.on('ticketDeleted', () => {
        fetchPendingCount();
      });

      return () => socket.disconnect();
    }
  }, [isAuthenticated]);

  const drawerWidth = 280;

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: '#f1f5f9' }}>
      <Sidebar drawerWidth={drawerWidth} unreadTickets={unreadTickets} />
      
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.9)', 
            backdropFilter: 'blur(20px)',
            color: 'text.primary',
            zIndex: (theme) => theme.zIndex.drawer - 1,
            top: 24,
            mt: 3,
            mx: 4,
            mb: 3,
            width: 'auto',
            borderRadius: '50px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
            border: '1px solid rgba(255,255,255,0.8)'
          }}
        >
          <Toolbar sx={{ justifyContent: 'flex-end', minHeight: '70px !important', px: { xs: 2, sm: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <IconButton 
                size="large" 
                onClick={(e) => setNotificationAnchor(e.currentTarget)}
                sx={{ 
                  color: 'text.secondary', 
                  bgcolor: 'rgba(0,0,0,0.03)', 
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.06)', transform: 'translateY(-1px)' }
                }}
              >
                <Badge badgeContent={unreadTickets} color="error" sx={{ '& .MuiBadge-badge': { fontWeight: 800 } }}>
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              
              <Menu
                anchorEl={notificationAnchor}
                open={Boolean(notificationAnchor)}
                onClose={() => setNotificationAnchor(null)}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    mt: 1.5,
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 4px 20px rgba(0,0,0,0.1))',
                    borderRadius: 3,
                    minWidth: 280,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Notifications</Typography>
                </Box>
                <Divider />
                
                {unreadTickets > 0 ? (
                  <MenuItem 
                    onClick={() => {
                      setNotificationAnchor(null);
                      navigate('/support');
                    }}
                    sx={{ py: 1.5 }}
                  >
                    <ListItemIcon>
                       <SupportAgentIcon color="error" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={`${unreadTickets} Pending Tickets`} 
                      secondary="Users requested support" 
                      primaryTypographyProps={{ fontWeight: 700, color: 'error.main' }}
                    />
                  </MenuItem>
                ) : (
                  <MenuItem disabled sx={{ py: 3, justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <DoneAllIcon sx={{ color: 'success.main', mb: 1, fontSize: 32 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>All caught up!</Typography>
                      <Typography variant="caption" color="text.secondary">No pending alerts</Typography>
                    </Box>
                  </MenuItem>
                )}
              </Menu>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pl: 3, borderLeft: '1px solid rgba(0,0,0,0.08)' }}>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2, color: 'text.primary' }}>
                      {adminUser?.name || 'Super Admin'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      {adminUser?.email || 'admin@cityguardian.in'}
                    </Typography>
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: 'secondary.main', 
                    fontWeight: 800, 
                    width: 44, 
                    height: 44,
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                    cursor: 'pointer'
                  }} onClick={() => navigate('/profile')} title="View Profile">
                    {adminUser?.profilePicture ? <img src={adminUser.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A')}
                  </Avatar>
                </Box>
              </Box>
            </Toolbar>
          </AppBar>

          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/reports" element={<PotholeReports />} />
            <Route path="/map" element={<MapAnalytics />} />
            <Route path="/support" element={<HelpSupport />} />
            <Route path="/rewards" element={<RewardManagement />} />
            <Route path="/profile" element={<AdminProfile adminUser={adminUser} onLogout={handleLogout} />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
