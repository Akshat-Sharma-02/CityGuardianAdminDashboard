import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar, 
  Divider, TextField, Button, CircularProgress, Chip, IconButton, Tabs, Tab, 
  InputAdornment, Tooltip, Zoom, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BackHandIcon from '@mui/icons-material/BackHand';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import io from 'socket.io-client';
import { format } from 'date-fns';
import api from '../api/api';

export default function HelpSupport() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  
  const messagesEndRef = useRef(null);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/admin/support');
      if (res.data.success) {
        setTickets(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch support tickets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();

    const socket = io(import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5002');
    
    socket.on('newSupportTicket', (newTicket) => {
      setTickets(prev => [newTicket, ...prev]);
    });

    socket.on('ticketUpdated', (updatedTicket) => {
      setTickets(prev => prev.map(t => t._id === updatedTicket._id ? updatedTicket : t));
      setSelectedTicket(curr => curr?._id === updatedTicket._id ? updatedTicket : curr);
    });

    socket.on('ticketDeleted', (deletedTicketId) => {
      setTickets(prev => prev.filter(t => t._id !== deletedTicketId));
      setSelectedTicket(curr => curr?._id === deletedTicketId ? null : curr);
    });

    return () => socket.disconnect();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (selectedTicket) {
      scrollToBottom();
    }
  }, [selectedTicket?.conversation]);

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;
    setSending(true);
    try {
      const res = await api.post(`/admin/support/${selectedTicket._id}/reply`, {
        message: replyMessage
      });
      if (res.data.success) {
        setReplyMessage('');
      }
    } catch (err) {
      console.error("Failed to send reply", err);
    } finally {
      setSending(false);
    }
  };

  const handleAcceptTicket = async () => {
    try {
      await api.patch(`/admin/support/${selectedTicket._id}/accept`);
    } catch (err) {
      console.error("Failed to accept ticket", err);
    }
  };

  const handleRejectTicket = () => {
    setRejectDialogOpen(true);
  };

  const confirmRejectTicket = async () => {
    try {
      await api.patch(`/admin/support/${selectedTicket._id}/reject`);
    } catch (err) {
      console.error("Failed to reject ticket", err);
    } finally {
      setRejectDialogOpen(false);
    }
  };

  const handleResolveTicket = async () => {
    try {
      await api.patch(`/admin/support/${selectedTicket._id}/resolve`);
    } catch (err) {
      console.error("Failed to resolve ticket", err);
    }
  };

  const handleDeleteTicket = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDeleteTicket = async () => {
    try {
      await api.delete(`/admin/support/${selectedTicket._id}`);
    } catch (err) {
      console.error("Failed to delete ticket", err);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const getFilteredTickets = () => {
    return tickets.filter(ticket => {
      const matchesSearch = ticket.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            ticket.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            ticket._id.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (tabIndex === 0) return ticket.status === 'Pending';
      if (tabIndex === 1) return ticket.status === 'Active';
      if (tabIndex === 2) return ticket.status === 'Resolved';
      if (tabIndex === 3) return true; // All
      return true;
    });
  };

  const filteredTickets = getFilteredTickets();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'error';
      case 'Active': return 'info';
      case 'Resolved': return 'success';
      default: return 'default';
    }
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
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3, flexShrink: 0 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Help & Support Hub
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', mt: 0.5 }}>
            Manage citizen inquiries, resolve issues, and ensure community satisfaction.
          </Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
           <Paper elevation={0} sx={{ p: '8px 16px', borderRadius: 3, bgcolor: 'white', display: 'flex', alignItems: 'center', gap: 1, border: '1px solid #e2e8f0' }}>
             <ErrorOutlineIcon color="error" />
             <Box>
               <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block' }}>Pending</Typography>
               <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1, color: '#0f172a' }}>{tickets.filter(t => t.status === 'Pending').length}</Typography>
             </Box>
           </Paper>
           <Paper elevation={0} sx={{ p: '8px 16px', borderRadius: 3, bgcolor: 'white', display: 'flex', alignItems: 'center', gap: 1, border: '1px solid #e2e8f0' }}>
             <SupportAgentIcon color="info" />
             <Box>
               <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block' }}>Active Chats</Typography>
               <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1, color: '#0f172a' }}>{tickets.filter(t => t.status === 'Active').length}</Typography>
             </Box>
           </Paper>
        </Box>
      </Box>

      <Paper elevation={0} sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        borderRadius: 4, 
        border: '1px solid #e2e8f0', 
        overflow: 'hidden',
        minHeight: 0,
        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)',
        bgcolor: 'white'
      }}>
        
        <Box sx={{ 
          width: { xs: '100%', md: '380px', lg: '420px' }, 
          borderRight: '1px solid #e2e8f0', 
          display: { xs: selectedTicket ? 'none' : 'flex', md: 'flex' },
          flexDirection: 'column',
          bgcolor: '#ffffff' 
        }}>
          
          <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0', bgcolor: '#f8fafc', flexShrink: 0 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search users or tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                sx: { borderRadius: 3, bgcolor: 'white', '& fieldset': { borderColor: '#e2e8f0' } }
              }}
              sx={{ mb: 2 }}
            />
            <Tabs 
              value={tabIndex} 
              onChange={(e, v) => setTabIndex(v)} 
              variant="scrollable"
              scrollButtons="auto"
              sx={{ minHeight: 40, '& .MuiTab-root': { minHeight: 40, textTransform: 'none', fontWeight: 600, fontSize: '0.875rem' } }}
            >
              <Tab label="Requires Action" />
              <Tab label="Active" />
              <Tab label="Resolved" />
              <Tab label="All" />
            </Tabs>
          </Box>

          <List sx={{ flexGrow: 1, overflowY: 'auto', p: 0, '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-thumb': { bgcolor: '#cbd5e1', borderRadius: '4px' } }}>
            {filteredTickets.length === 0 ? (
               <Box sx={{ p: 6, textAlign: 'center', opacity: 0.6 }}>
                 <SupportAgentIcon sx={{ fontSize: 60, color: '#94a3b8', mb: 2 }} />
                 <Typography variant="h6" sx={{ color: '#475569', fontWeight: 700 }}>No tickets found</Typography>
                 <Typography variant="body2" sx={{ color: '#64748b' }}>Try adjusting your filters or search query.</Typography>
               </Box>
            ) : filteredTickets.map((ticket) => (
              <React.Fragment key={ticket._id}>
                <ListItem 
                  button 
                  onClick={() => setSelectedTicket(ticket)}
                  sx={{ 
                    bgcolor: selectedTicket?._id === ticket._id ? '#f5f3ff' : 'transparent',
                    borderLeft: selectedTicket?._id === ticket._id ? '4px solid #4f46e5' : '4px solid transparent',
                    py: 2.5,
                    px: 3,
                    transition: 'all 0.2s ease',
                    '&:hover': { bgcolor: selectedTicket?._id === ticket._id ? '#f5f3ff' : '#f8fafc' }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      src={ticket.user?.profilePicture || ''} 
                      sx={{ 
                        bgcolor: getStatusColor(ticket.status) + '.light', 
                        color: getStatusColor(ticket.status) + '.dark',
                        fontWeight: 700,
                        width: 48,
                        height: 48
                      }}
                    >
                      {ticket.user?.name ? ticket.user.name.charAt(0).toUpperCase() : '?'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', noWrap: true, fontSize: '0.95rem' }}>
                          {ticket.user?.name || 'Unknown User'}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={ticket.status} 
                          color={getStatusColor(ticket.status)} 
                          sx={{ height: 22, fontSize: '0.7rem', fontWeight: 800, borderRadius: 1.5 }} 
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.5, noWrap: true }}>{ticket.subject}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <Typography variant="caption" sx={{ color: '#64748b', display: 'block', noWrap: true, maxWidth: '70%' }}>
                             {ticket.conversation[ticket.conversation.length - 1]?.content || 'Started a ticket'}
                           </Typography>
                           <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                             {format(new Date(ticket.updatedAt), 'MMM d')}
                           </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        </Box>

        <Box sx={{ 
          flexGrow: 1, 
          display: { xs: selectedTicket ? 'flex' : 'none', md: 'flex' },
          flexDirection: 'column', 
          bgcolor: '#ffffff',
          backgroundImage: 'radial-gradient(#f1f5f9 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}>
          {selectedTicket ? (
            <>
              <Box sx={{ 
                p: { xs: 2, md: 3 }, 
                borderBottom: '1px solid #e2e8f0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                flexShrink: 0,
                bgcolor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                zIndex: 10
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton 
                    sx={{ display: { xs: 'flex', md: 'none' }, bgcolor: '#f1f5f9' }} 
                    onClick={() => setSelectedTicket(null)}
                    size="small"
                  >
                    <BackHandIcon fontSize="small" sx={{ transform: 'rotate(90deg)' }} />
                  </IconButton>
                  
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.2 }}>{selectedTicket.subject}</Typography>
                    <Typography variant="body2" color="#64748b" sx={{ fontWeight: 500 }}>
                      Ticket #{selectedTicket._id.toString().substring(18)} <span style={{ margin: '0 8px' }}>•</span> {selectedTicket.user?.email}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  {selectedTicket.status === 'Active' && (
                     <Button 
                       variant="contained" 
                       color="success" 
                       size="medium" 
                       onClick={handleResolveTicket}
                       startIcon={<CheckCircleIcon />}
                       sx={{ borderRadius: 2, fontWeight: 700, display: { xs: 'none', md: 'flex' }, boxShadow: 'none' }}
                     >
                       Mark Resolved
                     </Button>
                  )}
                  <Tooltip title="Delete Ticket Permanently">
                    <IconButton onClick={handleDeleteTicket} sx={{ color: '#ef4444', bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' }, borderRadius: 2 }}>
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Box sx={{ 
                 flexGrow: 1, overflowY: 'auto', p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', gap: 3,
                 '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-thumb': { bgcolor: '#cbd5e1', borderRadius: '4px' }
              }}>
                <Box sx={{ textAlign: 'center', my: 2 }}>
                   <Chip label={`Ticket created on ${format(new Date(selectedTicket.createdAt), 'MMMM d, yyyy')}`} size="small" sx={{ bgcolor: '#f1f5f9', color: '#64748b', fontWeight: 600 }} />
                </Box>
                
                {selectedTicket.conversation.map((msg, idx) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <Box key={idx} sx={{ display: 'flex', flexDirection: isUser ? 'row' : 'row-reverse', alignItems: 'flex-end', gap: 1.5 }}>
                      <Avatar src={isUser ? (selectedTicket.user?.profilePicture || '') : '/logo.png'} sx={{ width: 32, height: 32, bgcolor: isUser ? 'primary.main' : '#0f172a', mb: 3 }}>
                         {isUser && !selectedTicket.user?.profilePicture ? selectedTicket.user?.name?.charAt(0) : ''}
                      </Avatar>
                      <Box sx={{ maxWidth: '70%', display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-start' : 'flex-end' }}>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, mb: 0.5, px: 1 }}>
                          {isUser ? selectedTicket.user?.name : 'City Guardian Support'}
                        </Typography>
                        <Box sx={{ 
                          bgcolor: isUser ? 'white' : '#4f46e5', 
                          color: isUser ? '#1e293b' : 'white',
                          p: '12px 16px', 
                          borderRadius: '16px',
                          borderBottomLeftRadius: isUser ? 0 : 16,
                          borderBottomRightRadius: isUser ? 16 : 0,
                          boxShadow: isUser ? '0 4px 6px -1px rgba(0,0,0,0.05)' : '0 4px 12px rgba(79, 70, 229, 0.3)',
                          border: isUser ? '1px solid #e2e8f0' : 'none'
                        }}>
                          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5, fontSize: '0.95rem' }}>{msg.content}</Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 0.5, px: 1 }}>
                          {format(new Date(msg.timestamp), 'h:mm a')}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
                <div ref={messagesEndRef} />
              </Box>

              <Box sx={{ bgcolor: 'white', borderTop: '1px solid #e2e8f0', zIndex: 10 }}>
                {selectedTicket.status === 'Pending' ? (
                   <Zoom in={true}>
                     <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#f8fafc' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
                          Action Required
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                          This ticket is pending. You must accept it to start chatting.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Button 
                            variant="outlined" 
                            color="error" 
                            size="medium"
                            startIcon={<CloseIcon />}
                            onClick={handleRejectTicket}
                            sx={{ borderRadius: 4, fontWeight: 700, px: 3, textTransform: 'none' }}
                          >
                            Reject
                          </Button>
                          <Button 
                            variant="contained" 
                            color="primary" 
                            size="medium"
                            startIcon={<BackHandIcon />}
                            onClick={handleAcceptTicket}
                            sx={{ borderRadius: 4, fontWeight: 700, px: 3, boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)', textTransform: 'none' }}
                          >
                            Accept & Chat
                          </Button>
                        </Box>
                     </Box>
                   </Zoom>
                ) : selectedTicket.status === 'Active' ? (
                   <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'flex-end', bgcolor: '#f8fafc' }}>
                     <TextField
                       fullWidth
                       placeholder="Type your response to the user..."
                       variant="outlined"
                       multiline
                       maxRows={5}
                       value={replyMessage}
                       onChange={(e) => setReplyMessage(e.target.value)}
                       onKeyDown={(e) => {
                         if (e.key === 'Enter' && !e.shiftKey) {
                           e.preventDefault();
                           handleSendReply();
                         }
                       }}
                       sx={{ 
                         '& .MuiOutlinedInput-root': { 
                           borderRadius: 4, 
                           bgcolor: 'white', 
                           boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                           '& fieldset': { borderColor: '#e2e8f0' },
                           '&:hover fieldset': { borderColor: '#cbd5e1' },
                           '&.Mui-focused fieldset': { borderColor: '#4f46e5' }
                         } 
                       }}
                     />
                     <IconButton 
                       color="primary" 
                       onClick={handleSendReply}
                       disabled={!replyMessage.trim() || sending}
                       sx={{ 
                         bgcolor: '#4f46e5', 
                         color: 'white', 
                         width: 52,
                         height: 52,
                         mb: 0.5,
                         '&:hover': { bgcolor: '#4338ca', transform: 'scale(1.05)' }, 
                         '&:disabled': { bgcolor: '#cbd5e1', color: 'white' }, 
                         boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)',
                         transition: 'all 0.2s'
                       }}
                     >
                       {sending ? <CircularProgress size={24} color="inherit" /> : <SendIcon sx={{ ml: 0.5 }} />}
                     </IconButton>
                   </Box>
                ) : (
                   <Box sx={{ p: 3, textAlign: 'center', bgcolor: '#f0fdf4', borderTop: '1px solid #bbf7d0' }}>
                      <Typography color="#166534" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, fontSize: '1.1rem' }}>
                        <CheckCircleIcon fontSize="large" sx={{ color: '#22c55e' }} /> This conversation is resolved and closed
                      </Typography>
                   </Box>
                )}
              </Box>
            </>
          ) : (
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', bgcolor: '#ffffff' }}>
              <SupportAgentIcon sx={{ fontSize: 80, opacity: 0.3, mb: 3 }} />
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#334155', mb: 1 }}>Select a Conversation</Typography>
              <Typography variant="body1">Choose a ticket from your inbox to view the history and reply.</Typography>
            </Box>
          )}
        </Box>
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete this ticket history? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={confirmDeleteTicket} variant="contained" color="error" disableElevation>Delete History</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800 }}>Decline Ticket</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to decline this support ticket? The user will be notified that it was rejected and closed.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRejectDialogOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={confirmRejectTicket} variant="contained" color="error" disableElevation>Reject Ticket</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
