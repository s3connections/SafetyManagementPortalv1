import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Warning as WarningIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

// Sample data for dashboard
const dashboardData = {
  kpis: {
    totalIncidents: 15,
    openIncidents: 8,
    highRiskItems: 5,
    completedAudits: 12,
    pendingWorkflows: 7,
    safetyScore: 85
  },
  recentIncidents: [
    {
      id: 1,
      title: 'Chemical Spill in Lab Area',
      severity: 'High',
      status: 'Under Investigation',
      date: '2025-02-28'
    },
    {
      id: 2,
      title: 'Equipment Malfunction',
      severity: 'Medium',
      status: 'Investigation Complete',
      date: '2025-02-25'
    },
    {
      id: 3,
      title: 'Worker Slip and Fall',
      severity: 'Medium',
      status: 'Closed',
      date: '2025-02-20'
    }
  ],
  pendingTasks: [
    {
      id: 1,
      title: 'Complete Risk Assessment for Plant A',
      type: 'Risk Assessment',
      dueDate: '2025-03-15',
      priority: 'High'
    },
    {
      id: 2,
      title: 'Safety Training Approval',
      type: 'Workflow',
      dueDate: '2025-03-10',
      priority: 'Medium'
    },
    {
      id: 3,
      title: 'Quarterly Safety Audit',
      type: 'Audit',
      dueDate: '2025-03-20',
      priority: 'High'
    }
  ],
  alerts: [
    {
      id: 1,
      message: 'High-risk incident requires immediate attention',
      type: 'error',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      message: 'Safety training completion rate below target',
      type: 'warning',
      timestamp: '1 day ago'
    },
    {
      id: 3,
      message: 'Monthly safety report submitted successfully',
      type: 'success',
      timestamp: '2 days ago'
    }
  ],
  riskTrends: [
    { month: 'Jan', count: 12 },
    { month: 'Feb', count: 8 },
    { month: 'Mar', count: 15 }
  ]
};

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'High': return 'error';
    case 'Medium': return 'warning';
    case 'Low': return 'success';
    default: return 'default';
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High': return 'error';
    case 'Medium': return 'warning';
    case 'Low': return 'success';
    default: return 'default';
  }
};

const getAlertIcon = (type) => {
  switch (type) {
    case 'error': return <ErrorIcon color="error" />;
    case 'warning': return <WarningIcon color="warning" />;
    case 'success': return <CheckIcon color="success" />;
    default: return <NotificationsIcon />;
  }
};

export default function Dashboard() {
  const [data, setData] = useState(dashboardData);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <DashboardIcon />
        Safety Management Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* KPI Cards */}
        <Grid size ={{xs: 12, md:2}}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Total Incidents
              </Typography>
              <Typography variant="h4" color="primary">
                {data.kpis.totalIncidents}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon color="error" fontSize="small" />
                <Typography variant="body2" color="error.main" sx={{ ml: 0.5 }}>
                  +20% vs last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size ={{xs: 12, md:2}}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Open Incidents
              </Typography>
              <Typography variant="h4" color="warning.main">
                {data.kpis.openIncidents}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={(data.kpis.openIncidents / data.kpis.totalIncidents) * 100} 
                color="warning"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size ={{xs: 12, md:2}}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                High Risk Items
              </Typography>
              <Typography variant="h4" color="error.main">
                {data.kpis.highRiskItems}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingDownIcon color="success" fontSize="small" />
                <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                  -15% vs last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size ={{xs: 12, md:2}}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Completed Audits
              </Typography>
              <Typography variant="h4" color="success.main">
                {data.kpis.completedAudits}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={80} 
                color="success"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size ={{xs: 12, md:2}}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Pending Workflows
              </Typography>
              <Typography variant="h4" color="info.main">
                {data.kpis.pendingWorkflows}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Avg. 3.2 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size ={{xs: 12, md:2}}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Safety Score
              </Typography>
              <Typography variant="h4" color="success.main">
                {data.kpis.safetyScore}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={data.kpis.safetyScore} 
                color="success"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Incidents */}
        <Grid size ={{xs: 12, md:6}}>
          <Card sx={{ height: 400 }}>
            <CardHeader title="Recent Incidents" />
            <CardContent>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Severity</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.recentIncidents.map((incident) => (
                      <TableRow key={incident.id}>
                        <TableCell>
                          <Typography variant="body2" noWrap>
                            {incident.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={incident.severity}
                            color={getSeverityColor(incident.severity)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap>
                            {incident.status}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {incident.date}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Tasks */}
        <Grid size ={{xs: 12, md:6}}>
          <Card sx={{ height: 400 }}>
            <CardHeader title="Pending Tasks" />
            <CardContent>
              <List>
                {data.pendingTasks.map((task) => (
                  <ListItem key={task.id} divider>
                    <ListItemIcon>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        <AssignmentIcon fontSize="small" />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={task.title}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Chip 
                            label={task.type}
                            size="small"
                            variant="outlined"
                          />
                          <Chip 
                            label={task.priority}
                            color={getPriorityColor(task.priority)}
                            size="small"
                          />
                          <Typography variant="caption" color="textSecondary">
                            Due: {task.dueDate}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* System Alerts */}
        <Grid size ={{xs:12}}>
          <Card>
            <CardHeader title="System Alerts & Notifications" />
            <CardContent>
              <Grid container spacing={2}>
                {data.alerts.map((alert) => (
                  <Grid size ={{xs: 12, md:4}} key={alert.id}>
                    <Alert 
                      severity={alert.type}
                      icon={getAlertIcon(alert.type)}
                    >
                      <Typography variant="body2">
                        {alert.message}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {alert.timestamp}
                      </Typography>
                    </Alert>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid size ={{xs:12}}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item>
                <Card sx={{ minWidth: 150, cursor: 'pointer', '&:hover': { elevation: 4 } }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="body2">
                      Report Incident
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item>
                <Card sx={{ minWidth: 150, cursor: 'pointer', '&:hover': { elevation: 4 } }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <WarningIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                    <Typography variant="body2">
                      Add Risk
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item>
                <Card sx={{ minWidth: 150, cursor: 'pointer', '&:hover': { elevation: 4 } }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <CheckIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                    <Typography variant="body2">
                      Start Audit
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}