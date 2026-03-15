import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Avatar, Grid, Button, Divider, Chip, IconButton, GlobalStyles } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import SecurityIcon from '@mui/icons-material/Security';
import CelebrationIcon from '@mui/icons-material/Celebration';

export default function AdminProfile({ adminUser, onLogout }) {
  const navigate = useNavigate();

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
            <Box sx={{ zIndex: 1 }}>
              <Chip label="SYSTEM ADMINISTRATOR" size="small" icon={<AdminPanelSettingsIcon />} sx={{ bgcolor: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', fontWeight: 800, mb: 1.5, px: 1, borderRadius: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', mb: 0 }}>{adminUser.name}</Typography>
              <Typography variant="subtitle1" sx={{ color: '#64748b', fontWeight: 600 }}>@{adminUser.username || adminUser.email.split('@')[0]}</Typography>
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
    </Box>
  );
}
