import React, { useState, useEffect } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Box, Badge } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import MapIcon from '@mui/icons-material/Map';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
export default function Sidebar({ drawerWidth, unreadTickets = 0 }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Users', icon: <PeopleIcon />, path: '/users' },
    { text: 'Reports', icon: <ReportProblemIcon />, path: '/reports' },
    { text: 'Rewards', icon: <CardGiftcardIcon />, path: '/rewards' },
    { text: 'Map Analytics', icon: <MapIcon />, path: '/map' },
    { text: 'Help & Support', icon: <SupportAgentIcon />, path: '/support', badge: unreadTickets },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#070a13',
          color: 'primary.contrastText',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        },
      }}
    >
      <Toolbar sx={{ my: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/logo.png" alt="City Guardian Logo" style={{ width: 64, height: 64, objectFit: 'contain' }} />
        </Box>
        <Typography variant="h6" noWrap component="div" sx={{ color: 'white', letterSpacing: 1.5, mb: 0.5 }}>
          CITY GUARDIAN
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, letterSpacing: 2 }}>
          ADMIN PORTAL
        </Typography>
      </Toolbar>
      
      <Box sx={{ overflow: 'auto', mt: 3, px: 2 }}>
        <List>
          {menuItems.map((item) => {
            const isSelected = location.pathname.startsWith(item.path);
            return (
              <ListItem 
                button 
                key={item.text} 
                onClick={() => navigate(item.path)}
                sx={{
                  mb: 1.5,
                  py: 1.2,
                  px: 2.5,
                  borderRadius: 4,
                  backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                  color: isSelected ? '#fff' : 'rgba(255,255,255,0.6)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    color: '#fff',
                    transform: isSelected ? 'none' : 'translateX(4px)'
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 44 }}>
                  {item.badge > 0 ? (
                    <Badge badgeContent={item.badge} color="error" sx={{ '& .MuiBadge-badge': { fontWeight: 800, right: -4, top: 4 } }}>
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: isSelected ? 700 : 500,
                    letterSpacing: 0.3,
                    fontSize: '0.95rem'
                  }} 
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
}
