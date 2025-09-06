import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress
} from '@mui/material';
import { ObservationFormData, ObservationType } from '../types';
import { ObservationData } from 'types';


const SafetyDashboard: React.FC = () => {
  const [observations, setObservations] = useState<ObservationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockObservations: ObservationData[] = [
        {
          id: 1,
          ticketNumber: 'OBS-001',
          title: 'Safety Hazard in Workshop',
          description: 'Exposed electrical wires found in main workshop area',
          observationType: 'Safety',
          status: 'Open',
          priority: {
            id: 3,
            name: 'High',
            code: 'HIGH',
            color: '#f44336',
            sortOrder: 3,
            slaHours: 24,
            isActive: true
          },
          createdAt: new Date().toISOString(),
          reporter: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@company.com',
            role: 'employee',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        },
        {
          id: 2,
          ticketNumber: 'OBS-002',
          title: 'Environmental Concern',
          description: 'Chemical spill detected near storage area',
          observationType: 'Environmental',
          status: 'InProgress',
          priority: {
            id: 4,
            name: 'Critical',
            code: 'CRIT',
            color: '#9c27b0',
            sortOrder: 4,
            slaHours: 8,
            isActive: true
          },
          createdAt: new Date().toISOString(),
          reporter: {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@company.com',
            role: 'supervisor',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      ];
      
      setObservations(mockObservations);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  // ✅ FIXED: Use Priority entity properties correctly
  const priorityData = [
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
  const generateTrendData = () => {
    const trendData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Mock trend data - replace with actual calculation
      trendData.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 10) + 1
      });
    }
    return trendData;
  };

  const trendData = generateTrendData();

  // Recent observations for display
  const recentObservations = observations
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map(o => ({
      title: `Observation ${o.ticketNumber}`,
      description: (o.description || '').substring(0, 100) + '...',
      priority: o.priority?.name || '', // ✅ FIXED: Get priority name from entity
      date: o.createdAt,
      user: o.reporter ? `${o.reporter.firstName} ${o.reporter.lastName}` : 'Unknown User'
    }));

  return (
    <Grid container spacing={3}>
      {/* Summary Cards */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Observations
            </Typography>
            <Typography variant="h4">
              {observations.length}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Open Observations
            </Typography>
            <Typography variant="h4">
              {observations.filter(o => o.status === 'Open').length}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              High Priority
            </Typography>
            <Typography variant="h4">
              {observations.filter(o => o.priority?.name === 'High' || o.priority?.name === 'Critical').length}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Resolved This Month
            </Typography>
            <Typography variant="h4">
              {observations.filter(o => o.status === 'Resolved').length}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Charts Section */}
      <Grid size ={{xs: 12, md:6}}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Observations by Priority
            </Typography>
            {priorityData.map((item, index) => (
              <Box key={index} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography>{item.name}</Typography>
                <Box display="flex" alignItems="center">
                  <Box 
                    width={20} 
                    height={20} 
                    bgcolor={item.color} 
                    mr={1}
                    borderRadius={1}
                  />
                  <Typography>{item.value}</Typography>
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      <Grid size ={{xs: 12, md:6}}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Observations by Type
            </Typography>
            {observationsByType.map((item, index) => (
              <Box key={index} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography>{item.name}</Typography>
                <Typography>{item.value}</Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Observations */}
      <Grid size ={{xs:12}}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Observations
            </Typography>
            {recentObservations.length === 0 ? (
              <Typography color="textSecondary">No recent observations</Typography>
            ) : (
              recentObservations.map((item, index) => (
                <Box key={index} mb={2} pb={2} borderBottom="1px solid #e0e0e0">
                  <Typography variant="subtitle1">{item.title}</Typography>
                  <Typography color="textSecondary" variant="body2">
                    {item.description}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" mt={1}>
                    <Typography variant="caption">Priority: {item.priority}</Typography>
                    <Typography variant="caption">{item.user}</Typography>
                  </Box>
                </Box>
              ))
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SafetyDashboard;