import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, Card, CardContent, CircularProgress, Button } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MapIcon from '@mui/icons-material/Map';
import ArticleIcon from '@mui/icons-material/Article';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { format, subMonths, isSameMonth } from 'date-fns';
import api from '../api/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const adminUserStr = localStorage.getItem('adminUser');
  const adminUser = adminUserStr ? JSON.parse(adminUserStr) : { name: 'Administrator' };
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReports: 0,
    pendingReports: 0,
    fixedPotholes: 0
  });
  const [velocityData, setVelocityData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, reportsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/reports')
        ]);
        
        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }
        
        if (reportsRes.data.success) {
          const reports = reportsRes.data.data;
          
          // Generate last 6 months 
          const last6Months = Array.from({ length: 6 }).map((_, i) => subMonths(new Date(), 5 - i));
          
          const chartData = last6Months.map(date => {
            const monthReports = reports.filter(r => isSameMonth(new Date(r.createdAt), date));
            return {
              name: format(date, 'MMM'),
              reported: monthReports.length,
              resolved: monthReports.filter(r => r.status === 'Resolved' || r.status === 'Fixed').length
            };
          });
          setVelocityData(chartData);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: <PeopleIcon sx={{ color: '#4F46E5', fontSize: 24 }} />, bg: '#EEF2FF', trend: '+5%' },
    { title: 'Total Reports', value: stats.totalReports.toLocaleString(), icon: <ReportProblemIcon sx={{ color: '#0EA5E9', fontSize: 24 }} />, bg: '#E0F2FE', trend: '+12%' },
    { title: 'Pending Reports', value: stats.pendingReports.toLocaleString(), icon: <AssignmentLateIcon sx={{ color: '#F59E0B', fontSize: 24 }} />, bg: '#FEF3C7', trend: '-2%' },
    { title: 'Fixed Potholes', value: stats.fixedPotholes.toLocaleString(), icon: <CheckCircleIcon sx={{ color: '#10B981', fontSize: 24 }} />, bg: '#D1FAE5', trend: '+18%' },
  ];

  if (loading) {
    return (
      <Box sx={{ width: '100%', p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ width: '100%', p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Calculate "Other" category for pie chart
  const otherReports = Math.max(0, stats.totalReports - stats.pendingReports - stats.fixedPotholes);
  const healthData = [
    { name: 'Resolved', value: stats.fixedPotholes, color: '#10B981' },
    { name: 'Pending', value: stats.pendingReports, color: '#F59E0B' },
    { name: 'Rejected/Other', value: otherReports, color: '#64748B' },
  ].filter(item => item.value > 0);

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return percent > 0.05 ? (
      <text x={x} y={y} fill="white" fontSize="12" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <Box sx={{ width: '100%', p: { xs: 2, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexShrink: 0 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-1px' }}>
            Control Center
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, mt: 0.5 }}>
            Live monitoring of municipal infrastructure and citizen reports
          </Typography>
        </Box>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: 3,
        flexShrink: 0,
        pb: 4
      }}>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', xl: 'row' }, 
          gap: 3, 
          flexShrink: 0
        }}>
          <Paper elevation={0} sx={{ 
            flexGrow: 1,
            flexBasis: { xs: 'auto', xl: '65%' },
            minHeight: { xs: 250, md: 320 },
            borderRadius: 4, 
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            color: 'white',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Box sx={{ position: 'absolute', right: '-10%', top: '-20%', width: 300, height: 300, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(40px)' }} />
            
            <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
              <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: 2, opacity: 0.8, mb: { xs: 0.25, xl: 0.5 }, display: 'block', lineHeight: 1 }}>
                DASHBOARD OVERVIEW
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-1px', mb: { xs: 0.5, xl: 1 }, fontSize: { xs: '1.4rem', sm: '1.6rem', md: '1.8rem', xl: '2.5rem' } }}>
                Welcome back, {adminUser.name.split(' ')[0]}!
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9, fontWeight: 500, maxWidth: { xs: '100%', md: '85%' }, mb: { xs: 1.5, xl: 2.5 }, lineHeight: 1.2, fontSize: { xs: '0.8rem', md: '0.85rem', xl: '1rem' } }}>
                There are {stats.pendingReports} new citizen reports requiring your immediate verification today.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  startIcon={<ArticleIcon />}
                  onClick={() => navigate('/reports')}
                  sx={{ bgcolor: 'white', color: '#4f46e5', fontWeight: 800, px: 3, py: 1.5, borderRadius: 2, '&:hover': { bgcolor: '#f8fafc' } }}
                >
                  Review Reports
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<MapIcon />}
                  onClick={() => navigate('/map')}
                  sx={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white', fontWeight: 700, px: 3, py: 1.5, borderRadius: 2, '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
                >
                  Open Map Analytics
                </Button>
              </Box>
            </Box>
          </Paper>

          <Box sx={{ 
            flexGrow: 1,
            flexBasis: { xs: 'auto', xl: '35%' },
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
            gridTemplateRows: 'minmax(0, 1fr) minmax(0, 1fr)',
            gap: 2
          }}>
            {statCards.map((stat, index) => (
              <Card key={index} elevation={0} sx={{ 
                borderRadius: 3, 
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                p: { xs: 1.5, lg: 2 },
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 20px -8px rgba(0,0,0,0.1)' }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                   <Box sx={{ width: 32, height: 32, borderRadius: 2, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     {React.cloneElement(stat.icon, { sx: { fontSize: 18, color: stat.icon.props.sx.color } })}
                   </Box>
                   <Typography color="text.secondary" sx={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, lineHeight: 1.1 }}>
                      {stat.title}
                   </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-1px', lineHeight: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: stat.trend.startsWith('+') ? '#10B981' : '#F43F5E', fontWeight: 800, bgcolor: stat.trend.startsWith('+') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)', px: 1, py: 0.5, borderRadius: 1 }}>
                    {stat.trend}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', xl: 'row' }, 
          gap: 3, 
          flexShrink: 0 
        }}>
          <Paper elevation={0} sx={{ 
            flexGrow: 1,
            flexBasis: { xs: 'auto', xl: '65%' },
            borderRadius: 4,
            border: '1px solid #e2e8f0',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            minHeight: { xs: 350, md: 400 }
          }}>
            <Box sx={{ mb: 2, flexShrink: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>Resolution Velocity</Typography>
              <Typography variant="body2" color="text.secondary">Incident reports logged versus potholes successfully verified and addressed over time.</Typography>
            </Box>
            <Box sx={{ flexGrow: 1, minHeight: 0, mt: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} 
                  />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontWeight: 600, padding: '12px' }}
                    itemStyle={{ fontWeight: 700 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="reported" 
                    name="Reported Incidents"
                    stroke="#4F46E5" 
                    strokeWidth={4} 
                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                    activeDot={{ r: 6, stroke: '#4F46E5', strokeWidth: 2, fill: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="resolved" 
                    name="Fixed Potholes"
                    stroke="#10B981" 
                    strokeWidth={4} 
                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                    activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          <Paper elevation={0} sx={{ 
            flexGrow: 1,
            flexBasis: { xs: 'auto', xl: '35%' },
            borderRadius: 4,
            border: '1px solid #e2e8f0',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            minHeight: { xs: 350, md: 400 }
          }}>
            <Box sx={{ mb: 2, flexShrink: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>System Health</Typography>
              <Typography variant="body2" color="text.secondary">Ratio of verified reports vs total system payload.</Typography>
            </Box>
            <Box sx={{ flexGrow: 1, minHeight: 0, mt: 1 }}>
              {healthData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={healthData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {healthData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontWeight: 700 }}
                      itemStyle={{ color: '#0f172a' }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle"
                      wrapperStyle={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(241, 245, 249, 0.5)', borderRadius: 3, border: '2px dashed #e2e8f0' }}>
                  <Typography color="text.disabled" sx={{ fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', textAlign: 'center' }}>
                    No Data Available
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>

      </Box>
    </Box>
  );
}
