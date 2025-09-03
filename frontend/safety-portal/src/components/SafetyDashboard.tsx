import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  LinearProgress,
  Alert,
  IconButton,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  Security as SecurityIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import ObservationService from '../services/ObservationService';
import AuditService from '../services/AuditService';
import { Observation, Audit } from '../types';

interface DashboardData {
  observations: {
    total: number;
    open: number;
    closed: number;
    overdue: number;
    byPriority: Array<{ name: string; value: number; color: string }>;
    byType: Array<{ name: string; value: number }>;
    trend: Array<{ date: string; count: number }>;
  };
  audits: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    averageScore: number;
  };
  recentActivities: Array<{
    id: string;
    type: 'observation' | 'audit' | 'permit';
    title: string;
    description: string;
    priority?: string;
    date: string;
    user: string;
  }>;
}

const SafetyDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load observations
      const observationsResponse = await ObservationService.getObservations(1, 100);
      const auditsResponse = await AuditService.getAudits(1, 100);

      const observations = observationsResponse.success ? observationsResponse.data : [];
      const audits = auditsResponse.success ? auditsResponse.data : [];

      // Process observations data
      const observationsByPriority = [
        { name: 'High', value: observations.filter(o => o.priority === 'High').length, color: '#f44336' },
        { name: 'Medium', value: observations.filter(o => o.priority === 'Medium').length, color: '#ff9800' },
        { name: 'Low', value: observations.filter(o => o.priority === 'Low').length, color: '#4caf50' }
      ];

      const observationsByType = [
        { name: 'Unsafe Condition', value: observations.filter(o => o.observationType === 'Unsafe_Condition').length },
        { name: 'Unsafe Act', value: observations.filter(o => o.observationType === 'Unsafe_Act').length },
        { name: 'Near Miss', value: observations.filter(o => o.observationType === 'Near_Miss').length },
        { name: 'Good Practice', value: observations.filter(o => o.observationType === 'Good_Practice').length },
        { name: 'Work Stoppage', value: observations.filter(o => o.observationType === 'Work_Stoppage').length }
      ].filter(item => item.value > 0);

      // Generate trend data for the last 30 days
      const trendData = [];
      for (let i = 29; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dateStr = format(date, 'MMM dd');
        const count = observations.filter(o => 
          format(new Date(o.createdAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        ).length;
        trendData.push({ date: dateStr, count });
      }

      // Calculate overdue observations
      const overdueCount = observations.filter(o => 
        o.slaDeadline && new Date(o.slaDeadline) < new Date() && o.status !== 'Closed'
      ).length;

      // Calculate audit statistics
      const completedAudits = audits.filter((a: any) => a.status === 'AUDIT_COMPLETED');
      const averageScore = completedAudits.length > 0 
        ? completedAudits.reduce((sum: number, audit: any) => sum + (audit.score || 0), 0) / completedAudits.length 
        : 0;

      // Generate recent activities
      const recentActivities = [
        ...observations.slice(0, 3).map(o => ({
          id: `obs-${o.id}`,
          type: 'observation' as const,
          title: `Observation ${o.ticketNumber}`,
          description: o.description.substring(0, 100) + '...',
          priority: o.priority,
          date: o.createdAt,
          user: (o as any).reporter?.firstName + ' ' + (o as any).reporter?.lastName || 'Unknown User'
        })),
        ...audits.slice(0, 2).map((a: any) => ({
          id: `audit-${a.id}`,
          type: 'audit' as const,
          title: `Audit ${a.auditNumber}`,
          description: a.auditType,
          date: a.createdAt,
          user: a.auditor?.firstName + ' ' + a.auditor?.lastName || 'Unknown User'
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setData({
        observations: {
          total: observations.length,
          open: observations.filter(o => o.status === 'Open').length,
          closed: observations.filter(o => o.status === 'Closed').length,
          overdue: overdueCount,
          byPriority: observationsByPriority,
          byType: observationsByType,
          trend: trendData
        },
        audits: {
          total: audits.length,
          pending: audits.filter((a: any) => a.status === 'AUDIT_PENDING').length,
          inProgress: audits.filter((a: any) => a.status === 'AUDIT_IN_PROGRESS').length,
          completed: audits.filter((a: any) => a.status === 'AUDIT_COMPLETED').length,
          averageScore
        },
        recentActivities
      });

    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={loadDashboardData}>
            Retry
          </Button>
        }>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
            <DashboardIcon />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Safety Management Dashboard
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Overview of safety observations, audits, and performance metrics
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadDashboardData}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {loading && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress />
        </Box>
      )}

      {data && (
        <>
          {/* Key Metrics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: '100%', background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="white" gutterBottom variant="body2">
                        Total Observations
                      </Typography>
                      <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {data.observations.total}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {data.observations.open} open, {data.observations.closed} closed
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                      <WarningIcon sx={{ color: 'white', fontSize: 32 }} />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: '100%', background: 'linear-gradient(45deg, #FF6B6B 30%, #FFE66D 90%)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="white" gutterBottom variant="body2">
                        Overdue Items
                      </Typography>
                      <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {data.observations.overdue}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        Past SLA deadline
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                      <ScheduleIcon sx={{ color: 'white', fontSize: 32 }} />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: '100%', background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="white" gutterBottom variant="body2">
                        Audits Completed
                      </Typography>
                      <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {data.audits.completed}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        Avg score: {data.audits.averageScore.toFixed(1)}%
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                      <AssignmentIcon sx={{ color: 'white', fontSize: 32 }} />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: '100%', background: 'linear-gradient(45deg, #9C27B0 30%, #E1BEE7 90%)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="white" gutterBottom variant="body2">
                        Safety Score
                      </Typography>
                      <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {data.audits.averageScore > 0 ? data.audits.averageScore.toFixed(0) : 'N/A'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {data.audits.averageScore > 85 ? 'Excellent' : data.audits.averageScore > 70 ? 'Good' : 'Needs Improvement'}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                      <SecurityIcon sx={{ color: 'white', fontSize: 32 }} />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts Row */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Observation Trend */}
            <Grid size ={{xs: 12, lg: 8}}>
              <Paper sx={{ p: 3, height: 400 }}>
                <Typography variant="h6" gutterBottom>
                  Observation Trend (Last 30 Days)
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.observations.trend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#2196F3" 
                      strokeWidth={3}
                      dot={{ fill: '#2196F3', strokeWidth: 2, r: 4 }}
                      name="Observations" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Priority Distribution */}
            <Grid size ={{xs: 12, lg: 4}}>
              <Paper sx={{ p: 3, height: 400 }}>
                <Typography variant="h6" gutterBottom>
                  Observations by Priority
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.observations.byPriority}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: { name: string; percent?: number }) => 
  `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.observations.byPriority.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>

          {/* Bottom Row */}
          <Grid container spacing={3}>
            {/* Observations by Type */}
            <Grid size ={{xs: 12, lg: 6}}>
              <Paper sx={{ p: 3, height: 400 }}>
                <Typography variant="h6" gutterBottom>
                  Observations by Type
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.observations.byType} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4CAF50" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Recent Activities */}
            <Grid size ={{xs: 12, lg: 6}}>
              <Paper sx={{ p: 3, height: 400 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Activities
                </Typography>
                <List sx={{ maxHeight: 320, overflow: 'auto' }}>
                  {data.recentActivities.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar sx={{ 
                            bgcolor: activity.type === 'observation' ? 'warning.main' : 'primary.main',
                            width: 40, 
                            height: 40 
                          }}>
                            {activity.type === 'observation' ? <WarningIcon /> : <AssignmentIcon />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {activity.title}
                              </Typography>
                              {activity.priority && (
                                <Chip 
                                  label={activity.priority} 
                                  size="small" 
                                  color={
                                    activity.priority === 'High' ? 'error' :
                                    activity.priority === 'Medium' ? 'warning' : 'success'
                                  }
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="textSecondary">
                                {activity.description}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                By {activity.user} • {format(new Date(activity.date), 'MMM dd, yyyy HH:mm')}
                              </Typography>
                            </Box>
                          }
                        />
                        <IconButton size="small" color="primary">
                          <ViewIcon />
                        </IconButton>
                      </ListItem>
                      {index < data.recentActivities.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default SafetyDashboard;