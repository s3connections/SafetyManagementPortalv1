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
  Divider
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
import { Observation, Audit, ObservationType, Priority, ObservationStatus } from '../types';

// ✅ FIXED: Don't extend - create compatible interface
interface ObservationData {
  id: number;
  slaDeadline?: string;
  ticketNumber: string;
  title: string;
  description: string;
  createdAt: string;
  status: ObservationStatus;
  priority: Priority; // ✅ FIXED: Priority entity, not string
  observationType: ObservationType;
  reporter?: {
    firstName: string;
    lastName: string;
  };
}

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

      const observationsResponse = await ObservationService.getAllObservations();
      const auditsResponse = await AuditService.getAudits(1, 100);

      const observations: ObservationData[] = observationsResponse.success 
        ? (observationsResponse.data || []) 
        : [];
      const audits: any[] = auditsResponse.success 
        ? (auditsResponse.data || []) 
        : [];

      // ✅ FIXED: Process observations with Priority entity
      const observationsByPriority = [
        { 
          name: 'High', 
          value: observations.filter((o: ObservationData) => o.priority?.name === 'High').length, 
          color: '#f44336' 
        },
        { 
          name: 'Medium', 
          value: observations.filter((o: ObservationData) => o.priority?.name === 'Medium').length, 
          color: '#ff9800' 
        },
        { 
          name: 'Low', 
          value: observations.filter((o: ObservationData) => o.priority?.name === 'Low').length, 
          color: '#4caf50' 
        },
        { 
          name: 'Critical', 
          value: observations.filter((o: ObservationData) => o.priority?.name === 'Critical').length, 
          color: '#9c27b0' 
        }
      ].filter(item => item.value > 0);

      // ✅ FIXED: Use correct backend ObservationType enum values
      const observationsByType = [
        { name: 'Safety', value: observations.filter((o: ObservationData) => o.observationType === 'Safety').length },
        { name: 'Environmental', value: observations.filter((o: ObservationData) => o.observationType === 'Environmental').length },
        { name: 'Quality', value: observations.filter((o: ObservationData) => o.observationType === 'Quality').length },
        { name: 'Security', value: observations.filter((o: ObservationData) => o.observationType === 'Security').length },
        { name: 'Other', value: observations.filter((o: ObservationData) => o.observationType === 'Other').length }
      ].filter(item => item.value > 0);

      // Generate trend data for the last 30 days
      const trendData = [];
      for (let i = 29; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dateStr = format(date, 'MMM dd');
        const count = observations.filter((o: ObservationData) =>
          format(new Date(o.createdAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        ).length;
        trendData.push({ date: dateStr, count });
      }

      // ✅ FIXED: Use correct backend status values
      const overdueCount = observations.filter((o: ObservationData) =>
        o.slaDeadline && new Date(o.slaDeadline) < new Date() && o.status !== 'Closed'
      ).length;

      // Calculate audit statistics
      const completedAudits = audits.filter((a: any) => a.status === 'AUDIT_COMPLETED');
      const averageScore = completedAudits.length > 0
        ? completedAudits.reduce((sum: number, audit: any) => sum + (audit.score || 0), 0) / completedAudits.length
        : 0;

      // Generate recent activities
      const recentActivities = [
        ...observations.slice(0, 3).map((o: ObservationData) => ({
          id: `obs-${o.id}`,
          type: 'observation' as const,
          title: `Observation ${o.ticketNumber}`,
          description: (o.description || '').substring(0, 100) + '...',
          priority: o.priority?.name || '', // ✅ FIXED: Get priority name from entity
          date: o.createdAt,
          user: o.reporter ? `${o.reporter.firstName} ${o.reporter.lastName}` : 'Unknown User'
        })),
        ...audits.slice(0, 2).map((a: any) => ({
          id: `audit-${a.id}`,
          type: 'audit' as const,
          title: `Audit ${a.auditNumber}`,
          description: a.auditType,
          date: a.createdAt,
          user: a.auditor ? `${a.auditor.firstName} ${a.auditor.lastName}` : 'Unknown User'
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setData({
        observations: {
          total: observations.length,
          open: observations.filter((o: ObservationData) => o.status === 'Open').length,
          closed: observations.filter((o: ObservationData) => o.status === 'Closed').length,
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
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={loadDashboardData}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Safety Management Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Overview of safety observations, audits, and performance metrics
          </Typography>
        </Box>
        <IconButton
          onClick={loadDashboardData}
          disabled={loading}
          color="primary"
        >
          <RefreshIcon />
        </IconButton>
      </Box>

      {loading && (
        <LinearProgress sx={{ mb: 3 }} />
      )}

      {data && (
        <>
          {/* Key Metrics Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Total Observations</Typography>
                  </Box>
                  <Typography variant="h4" color="primary">
                    {data.observations.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {data.observations.open} open, {data.observations.closed} closed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <WarningIcon color="error" sx={{ mr: 1 }} />
                    <Typography variant="h6">Overdue Items</Typography>
                  </Box>
                  <Typography variant="h4" color="error">
                    {data.observations.overdue}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Past SLA deadline
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="h6">Audits Completed</Typography>
                  </Box>
                  <Typography variant="h4" color="success">
                    {data.audits.completed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg score: {data.audits.averageScore.toFixed(1)}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <SecurityIcon color="info" sx={{ mr: 1 }} />
                    <Typography variant="h6">Safety Score</Typography>
                  </Box>
                  <Typography variant="h4" color="info">
                    {data.audits.averageScore > 0 ? data.audits.averageScore.toFixed(0) : 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {data.audits.averageScore > 85 ? 'Excellent' : data.audits.averageScore > 70 ? 'Good' : 'Needs Improvement'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts Row */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* Observation Trend */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Observation Trend (Last 30 Days)
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.observations.trend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Priority Distribution */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
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
                        label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
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
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Bottom Row */}
          <Grid container spacing={3}>
            {/* Observations by Type */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Observations by Type
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.observations.byType}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Activities */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Activities
                  </Typography>
                  <List>
                    {data.recentActivities.map((activity, index) => (
                      <React.Fragment key={activity.id}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              {activity.type === 'observation' ? <AssignmentIcon /> : <SecurityIcon />}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {activity.title}
                                {activity.priority && (
                                  <Chip 
                                    label={activity.priority} 
                                    size="small" 
                                    color={activity.priority === 'High' ? 'error' : activity.priority === 'Medium' ? 'warning' : 'success'}
                                  />
                                )}
                              </Box>
                            }
                            secondary={
                              <>
                                {activity.description}
                                <br />
                                By {activity.user} • {format(new Date(activity.date), 'MMM dd, yyyy HH:mm')}
                              </>
                            }
                          />
                        </ListItem>
                        {index < data.recentActivities.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default SafetyDashboard;