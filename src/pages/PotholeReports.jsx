import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, IconButton, Avatar, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Divider
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import AddTaskIcon from '@mui/icons-material/AddTask';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import api from '../api/api';

export default function PotholeReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [isConfirmResolveOpen, setIsConfirmResolveOpen] = useState(false);
  const [isConfirmUnresolveOpen, setIsConfirmUnresolveOpen] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/reports');
      if (res.data.success) {
        const filteredAndSorted = res.data.data
          .filter(r => r.status === 'Verified' || r.status === 'Rejected' || r.status === 'Resolved')
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setReports(filteredAndSorted);
      }
    } catch (err) {
      setError('Failed to load reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      const res = await api.patch(`/admin/reports/${reportId}/status`, { status: newStatus });
      if (res.data.success) {
        setReports(reports.map(r => r._id === reportId ? { ...r, status: res.data.data.status } : r));
        if (selectedReport && selectedReport._id === reportId) {
          setSelectedReport({ ...selectedReport, status: res.data.data.status });
        }
      }
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to update status');
    }
  };

  const handleDeleteReport = async () => {
    if (!reportToDelete) return;
    try {
      const res = await api.delete(`/admin/reports/${reportToDelete._id}`);
      if (res.data.success) {
        setReports(reports.filter(r => r._id !== reportToDelete._id));
        setIsDeleteDialogOpen(false);
        setReportToDelete(null);
      }
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to delete report');
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  const getSeverityStyle = (severity) => {
    switch(severity) {
      case 'High': return { bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' };
      case 'Medium': return { bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' };
      case 'Low': return { bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
      default: return { bgcolor: 'rgba(100, 116, 139, 0.1)', color: '#64748b' };
    }
  };

  const verifiedReports = reports.filter(r => r.status === 'Verified');
  const rejectedReports = reports.filter(r => r.status === 'Rejected');
  const resolvedReports = reports.filter(r => r.status === 'Resolved');

  const renderTableHead = () => (
    <TableHead sx={{ backgroundColor: 'rgba(241, 245, 249, 0.5)' }}>
      <TableRow>
        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', py: 2, fontSize: '0.75rem', letterSpacing: 0.5 }}>Report Details</TableCell>
        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', py: 2, fontSize: '0.75rem', letterSpacing: 0.5 }}>Reporter</TableCell>
        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', py: 2, fontSize: '0.75rem', letterSpacing: 0.5 }}>Date Reported</TableCell>
        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', py: 2, fontSize: '0.75rem', letterSpacing: 0.5 }}>Severity</TableCell>
        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', py: 2, fontSize: '0.75rem', letterSpacing: 0.5 }}>Status</TableCell>
        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', textAlign: 'center', py: 2, fontSize: '0.75rem', letterSpacing: 0.5 }}>Action</TableCell>
      </TableRow>
    </TableHead>
  );

  const renderTableRows = (data) => (
    <TableBody>
      {data.map((report) => (
        <TableRow key={report._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, transition: 'background-color 0.2s', '&:hover': { background: '#f8fafc' } }}>
          <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                src={report.imageUrl}
                variant="rounded" 
                sx={{ bgcolor: 'rgba(241, 245, 249, 0.8)', color: 'grey.500', mr: 2.5, width: 44, height: 44, borderRadius: 3, border: '1px solid rgba(0,0,0,0.05)' }}
              >
                <ImageNotSupportedIcon fontSize="small" />
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: -0.2 }}>{report.description.substring(0, 30)}...</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>ID: {report._id.substring(report._id.length - 6)}</Typography>
              </Box>
            </Box>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.85rem' }}>{report.reportedBy.name}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>@{report.reportedBy.username}</Typography>
          </TableCell>
          <TableCell sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </TableCell>
          <TableCell>
            <Chip 
              label={report.severity} 
              size="small"
              sx={{ 
                fontWeight: 700, 
                borderRadius: 2,
                fontSize: '0.7rem',
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                ...getSeverityStyle(report.severity)
              }}
            />
          </TableCell>
          <TableCell>
            <Chip 
              label={report.status} 
              size="small"
              sx={{
                fontWeight: 700,
                borderRadius: 2,
                fontSize: '0.7rem',
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                bgcolor: report.status === 'Verified' ? 'rgba(59, 130, 246, 0.1)' : report.status === 'Resolved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                color: report.status === 'Verified' ? '#3b82f6' : report.status === 'Resolved' ? '#10b981' : '#f43f5e',
                border: '1px solid',
                borderColor: report.status === 'Verified' ? 'rgba(59, 130, 246, 0.2)' : report.status === 'Resolved' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'
              }}
            />
          </TableCell>
          <TableCell align="center">
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
              {report.status !== 'Rejected' && report.status !== 'Resolved' && (
                <IconButton 
                  onClick={() => {
                    setSelectedReport(report);
                    setIsConfirmResolveOpen(true);
                  }}
                  title="Mark as Resolved"
                  sx={{ 
                    color: 'success.main', 
                    bgcolor: 'rgba(16, 185, 129, 0.05)', 
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.15)', transform: 'scale(1.05)' } 
                  }}
                >
                  <AddTaskIcon fontSize="small" />
                </IconButton>
              )}
              {report.status === 'Resolved' && (
                 <IconButton 
                  onClick={() => {
                    setSelectedReport(report);
                    setIsConfirmUnresolveOpen(true);
                  }}
                  title="Mark as Unresolved"
                  sx={{ 
                    color: '#f59e0b', 
                    bgcolor: 'rgba(245, 158, 11, 0.05)', 
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: 'rgba(245, 158, 11, 0.15)', transform: 'scale(1.05)' } 
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
              <IconButton 
                onClick={() => {
                  setSelectedReport(report);
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
              <IconButton 
                onClick={() => {
                  setReportToDelete(report);
                  setIsDeleteDialogOpen(true);
                }}
                sx={{ 
                  color: 'error.main', 
                  bgcolor: 'rgba(2ef, 68, 68, 0.05)', 
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.15)', transform: 'scale(1.05)' } 
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );

  return (
    <Box sx={{ width: '100%', px: 4, py: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px' }}>
          Pothole Reports
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Review and process citizen damage reports
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, flexShrink: 0 }}>{error}</Alert>}
      
      <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1, display: 'flex', flexDirection: 'column' }}>

      {verifiedReports.length > 0 && (
        <Box sx={{ mb: 5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
            Verified Reports
          </Typography>
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #F1F5F9', overflow: 'hidden' }}>
            <Table sx={{ minWidth: 650 }}>
              {renderTableHead()}
              {renderTableRows(verifiedReports)}
            </Table>
          </TableContainer>
        </Box>
      )}

      {rejectedReports.length > 0 && (
        <Box sx={{ mb: 5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
            Rejected Reports
          </Typography>
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #F1F5F9', overflow: 'hidden' }}>
            <Table sx={{ minWidth: 650 }}>
              {renderTableHead()}
              {renderTableRows(rejectedReports)}
            </Table>
          </TableContainer>
        </Box>
      )}

      {resolvedReports.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
            Resolved Reports
          </Typography>
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #F1F5F9', overflow: 'hidden' }}>
            <Table sx={{ minWidth: 650 }}>
              {renderTableHead()}
              {renderTableRows(resolvedReports)}
            </Table>
          </TableContainer>
        </Box>
      )}

      {verifiedReports.length === 0 && rejectedReports.length === 0 && resolvedReports.length === 0 && !loading && (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 4, border: '1px solid #F1F5F9', bgcolor: 'rgba(241, 245, 249, 0.5)' }}>
          <Typography variant="body1" color="text.secondary">
            No Verified, Rejected, or Resolved reports found.
          </Typography>
        </Paper>
      )}
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
        {selectedReport && (
          <Box sx={{ position: 'relative' }}>
            <IconButton 
              onClick={() => setIsModalOpen(false)}
              sx={{ position: 'absolute', top: 12, right: 12, zIndex: 10, color: 'text.secondary', bgcolor: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: 'white' } }}
            >
              <CloseIcon />
            </IconButton>

            <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: { xs: 3, sm: 4 } }}>
                <Box sx={{ display: 'flex', gap: 3, mb: 4, alignItems: 'flex-start' }}>
                  <Box sx={{ width: 150, height: 150, flexShrink: 0, borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: '2px solid #e2e8f0' }}>
                    {selectedReport.imageUrl ? (
                      <Box 
                        component="img"
                        src={selectedReport.imageUrl}
                        alt="Pothole"
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Box sx={{ width: '100%', height: '100%', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ImageNotSupportedIcon sx={{ color: 'text.disabled', fontSize: 32 }} />
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
                    <Typography variant="overline" sx={{ color: 'text.disabled', fontWeight: 800, letterSpacing: 1.5, display: 'block', lineHeight: 1 }}>
                      Report #{selectedReport._id.substring(selectedReport._id.length - 6).toUpperCase()}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                      <Chip 
                        label={selectedReport.status} 
                        size="small"
                        sx={{
                          fontWeight: 700, borderRadius: 1.5, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5,
                          bgcolor: selectedReport.status === 'Verified' ? 'rgba(59, 130, 246, 0.1)' : selectedReport.status === 'Resolved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                          color: selectedReport.status === 'Verified' ? '#3b82f6' : selectedReport.status === 'Resolved' ? '#10b981' : '#f43f5e',
                        }}
                      />
                      <Chip 
                        label={selectedReport.severity} 
                        size="small"
                        sx={{ 
                          fontWeight: 700, borderRadius: 1.5, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5,
                          ...getSeverityStyle(selectedReport.severity) 
                        }}
                      />
                    </Box>

                    <Box sx={{ mt: 1, p: 1.5, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #f1f5f9', display: 'inline-block', width: '100%' }}>
                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 0.5 }}>
                          <LocationOnIcon sx={{ fontSize: 16, color: '#3b82f6' }} />
                          <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Location Data</Typography>
                       </Box>
                       <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                         <Box sx={{ flex: 1, bgcolor: 'rgba(239, 68, 68, 0.08)', borderRadius: 1.5, p: 1, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                           <Typography variant="overline" sx={{ color: '#ef4444', fontWeight: 800, letterSpacing: 0.5, display: 'block', lineHeight: 1, mb: 0.5, fontSize: '0.65rem' }}>Latitude</Typography>
                           <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', fontFamily: 'monospace' }}>
                             {selectedReport.location?.latitude ? selectedReport.location.latitude.toFixed(4) : 'N/A'}
                           </Typography>
                         </Box>
                         <Box sx={{ flex: 1, bgcolor: 'rgba(59, 130, 246, 0.08)', borderRadius: 1.5, p: 1, border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                           <Typography variant="overline" sx={{ color: '#3b82f6', fontWeight: 800, letterSpacing: 0.5, display: 'block', lineHeight: 1, mb: 0.5, fontSize: '0.65rem' }}>Longitude</Typography>
                           <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', fontFamily: 'monospace' }}>
                             {selectedReport.location?.longitude ? selectedReport.location.longitude.toFixed(4) : 'N/A'}
                           </Typography>
                         </Box>
                       </Box>
                    </Box>
                  </Box>
                </Box>
                
                <Box sx={{ 
                  borderLeft: '4px solid #3b82f6', 
                  pl: 3, 
                  py: 1,
                  mb: 1
                }}>
                  <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500, fontSize: '1.1rem', lineHeight: 1.8, fontStyle: 'italic', opacity: 0.9 }}>
                    "{selectedReport.description}"
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ 
                bgcolor: '#f8fafc', 
                borderTop: '1px solid #f1f5f9', 
                px: { xs: 3, sm: 4 }, 
                py: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    src={selectedReport.reportedBy?.avatarUrl} 
                    sx={{ width: 40, height: 40, border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                  >
                    {selectedReport.reportedBy?.name?.charAt(0) || 'U'}
                  </Avatar>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                      Reported By
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {selectedReport.reportedBy?.name || 'Unknown Citizen'}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ textAlign: 'right' }}>
                   <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                      Date & Time
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {new Date(selectedReport.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(selectedReport.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                </Box>
              </Box>
            </DialogContent>

            <DialogActions sx={{ px: { xs: 3, sm: 5 }, py: 2, bgcolor: '#f8fafc', borderTop: '1px solid rgba(0,0,0,0.03)', justifyContent: 'space-between' }}>
              <Box>
                {selectedReport.status !== 'Rejected' && selectedReport.status !== 'Resolved' ? (
                  <Button 
                    variant="contained"
                    disableElevation
                    onClick={() => {
                      setIsConfirmResolveOpen(true);
                    }}
                    startIcon={<AddTaskIcon />}
                    sx={{ 
                      bgcolor: '#10b981', 
                      '&:hover': { bgcolor: '#059669' },
                      fontWeight: 800,
                      px: 3,
                      borderRadius: 2,
                      textTransform: 'none',
                      letterSpacing: 0.5
                    }}
                  >
                    Mark as Resolved
                  </Button>
                ) : selectedReport.status === 'Resolved' ? (
                  <Button 
                    variant="outlined"
                    disableElevation
                    onClick={() => {
                      setIsConfirmUnresolveOpen(true);
                    }}
                    startIcon={<CloseIcon />}
                    sx={{ 
                      color: '#f59e0b',
                      borderColor: '#f59e0b',
                      '&:hover': { borderColor: '#d97706', bgcolor: 'rgba(245, 158, 11, 0.05)' },
                      fontWeight: 800,
                      px: 3,
                      borderRadius: 2,
                      textTransform: 'none',
                      letterSpacing: 0.5
                    }}
                  >
                    Mark as Unresolved
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#f43f5e', opacity: 0.8 }}>
                    <CloseIcon sx={{ mr: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {selectedReport.status?.toLowerCase()}
                    </Typography>
                  </Box>
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
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 4, p: 2, maxWidth: 400 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: 'text.primary', pb: 1 }}>
          Delete Report?
        </DialogTitle>
        <DialogContent sx={{ pb: 3 }}>
          <Typography color="text.secondary">
            Are you sure you want to permanently delete this report? This action cannot be undone and the report data will be completely erased.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setIsDeleteDialogOpen(false)} 
            sx={{ fontWeight: 600, color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteReport} 
            variant="contained" 
            color="error"
            sx={{ 
              fontWeight: 700, 
              borderRadius: 2, 
              boxShadow: 'none',
              '&:hover': { boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }
            }}
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog 
        open={isConfirmResolveOpen} 
        onClose={() => setIsConfirmResolveOpen(false)}
        PaperProps={{ sx: { borderRadius: 4, p: 2, maxWidth: 400 } }}
        sx={{ zIndex: 9999 }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: 'text.primary', pb: 1 }}>
          Confirm Resolution
        </DialogTitle>
        <DialogContent sx={{ pb: 3 }}>
          <Typography color="text.secondary">
            Are you sure you want to mark this pothole as Resolved? This indicates the issue has been physically fixed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setIsConfirmResolveOpen(false)} 
            sx={{ fontWeight: 600, color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => {
              setIsConfirmResolveOpen(false);
              setIsModalOpen(false);
              handleUpdateStatus(selectedReport._id, 'Resolved');
            }} 
            variant="contained" 
            color="success"
            sx={{ 
              fontWeight: 700, 
              borderRadius: 2, 
              boxShadow: 'none',
              '&:hover': { boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }
            }}
          >
            Yes, Mark Resolved
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog 
        open={isConfirmUnresolveOpen} 
        onClose={() => setIsConfirmUnresolveOpen(false)}
        PaperProps={{ sx: { borderRadius: 4, p: 2, maxWidth: 400 } }}
        sx={{ zIndex: 9999 }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: 'text.primary', pb: 1 }}>
          Revert Resolution?
        </DialogTitle>
        <DialogContent sx={{ pb: 3 }}>
          <Typography color="text.secondary">
            Are you sure you want to mark this pothole as Unresolved? This will move it back to the Verified list for repairs.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setIsConfirmUnresolveOpen(false)} 
            sx={{ fontWeight: 600, color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => {
              setIsConfirmUnresolveOpen(false);
              setIsModalOpen(false);
              handleUpdateStatus(selectedReport._id, 'Verified');
            }} 
            variant="contained" 
            color="warning"
            sx={{ 
              fontWeight: 700, 
              borderRadius: 2, 
              boxShadow: 'none',
              '&:hover': { boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)' }
            }}
          >
            Yes, Unresolve
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
