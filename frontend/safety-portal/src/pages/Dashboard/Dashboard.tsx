import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  IconButton,
  Button
} from '@mui/material';
import {
  Warning,
  Assignment,
  Description,
  TrendingUp,
  CheckCircle,
  PendingActions,
  Error,
  Visibility
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardStats {
  totalIncidents: number;
  openIncidents: number;
  closedIncidents: number;
  pendingAudits: number;
  activePermits: number;
  overdueActions: number;
}

interface RecentActivity {
  id: string;
  type: 'incident' | 'audit' | 'permit';
  title: string;
  status: string;
  date: string;
  priority?: 'High' | 'Medium' | 'Low';
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalIncidents: 0,
    openIncidents: 0,
    closedIncidents: 0,
    pendingAudits: 0,
    activePermits: 0,
    overdueActions: 0
  });
  
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Replace with actual API calls
      const [statsResponse, activitiesResponse] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/dashboard/recent-activities')
      ]);

      if (statsResponse.ok && activitiesResponse.ok) {
        const statsData = await statsResponse.json();
        const activitiesData = await activitiesResponse.json();
        
        setStats(statsData);
        setRecentActivities(activitiesData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const kpiCards = [
    {
      title: 'Total Incidents',
      value: stats.totalIncidents,
      icon: <Warning color="warning" />,
      color: '#ff9800'
    },
    {
      title: 'Open Incidents',
      value: stats.openIncidents,
      icon: <Error color="error" />,
      color: '#f44336'
    },
    {
      title: 'Pending Audits',
      value: stats.pendingAudits,
      icon: <Assignment color="info" />,
      color: '#2196f3'
    },
    {
      title: 'Active Permits',
      value: stats.activePermits,
      icon: <Description color="success" />,
      color: '#4caf50'
    }
  ];

  const incidentData = [
    { name: 'Unsafe Acts', value: 35, color: '#ff6b6b' },
    { name: 'Unsafe Conditions', value: 25, color: '#4ecdc4' },
    { name: 'Near Miss', value: 20, color: '#45b7d1' },
    { name: 'Good Practice', value: 20, color: '#96ceb4' }
  ];

  const monthlyTrend = [
    { month: 'Jan', incidents: 12, audits: 8 },
    { month: 'Feb', incidents: 8, audits: 10 },
    { month: 'Mar', incidents: 15, audits: 12 },
    { month: 'Apr', incidents: 6, audits: 9 },
    { month: 'May', incidents: 10, audits: 11 },
    { month: 'Jun', incidents: 4, audits: 8 }
  ];

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'closed': return 'success';
      case 'pending':
      case 'open': return 'warning';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Safety Dashboard
      </Typography>
      
      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpiCards.map((card, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" component="div" sx={{ color: card.color }}>
                      {card.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.title}
                    </Typography>
                  </Box>
                  <Box sx={{ color: card.color }}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Incident Distribution Chart */}
        <Grid size ={{xs: 12, md:6}}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Incident Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incidentData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={(entry) => `${entry.name}: ${entry.value}%`}
                  >
                    {incidentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Trend Chart */}
        <Grid size ={{xs: 12, md:6}}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="incidents" fill="#ff6b6b" name="Incidents" />
                  <Bar dataKey="audits" fill="#4ecdc4" name="Audits" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid size ={{xs:12}}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>
                          <Chip 
                            label={activity.type} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{activity.title}</TableCell>
                        <TableCell>
                          <Chip 
                            label={activity.status} 
                            color={getStatusColor(activity.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {activity.priority && (
                            <Chip 
                              label={activity.priority} 
                              color={getPriorityColor(activity.priority)}
                              size="small"
                            />
                          )}
                        </TableCell>
                        <TableCell>{activity.date}</TableCell>
                        <TableCell>
                          <IconButton size="small">
                            <Visibility />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;