import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress
} from '@mui/material';
import { ObservationType, Observation } from '../types';

const SafetyDashboard: React.FC = () => {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load or mock data
    setLoading(true);
    const mock: Observation[] = [
      {
        id: 1,
        ticketNumber: 'OBS-001',
        title: 'Safety Hazard',
        description: 'Exposed wires',
        observationType: ObservationType.UNSAFE_ACT,
        priority: 'High' ,
        status: 'Open',
        stage: 'REPORTED',
        location: 'Workshop',
        hazardType: '',
        reporter: { id: 1, employeeId:'E1', firstName:'John', lastName:'Doe', email:'', userType:'EMPLOYEE', isActive:true, createdAt:'', updatedAt:''},
        assignee: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        ticketNumber: 'OBS-002',
        title: 'Environmental Concern',
        description: 'Chemical spill',
        observationType: ObservationType.UNSAFE_CONDITION,
        priority: 'Critical',
        status: 'In_Progress',
        stage: 'INVESTIGATING',
        location: 'Storage',
        hazardType: '',
        reporter: { id:2, employeeId:'E2', firstName:'Jane', lastName:'Smith', email:'', userType:'EMPLOYEE', isActive:true, createdAt:'', updatedAt:''},
        assignee: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    setObservations(mock);
    setLoading(false);
  }, []);

  if (loading) {
    return <Box p={4} textAlign="center"><CircularProgress /></Box>;
  }

  // Summary stats
  const total = observations.length;
  const openCount = observations.filter(o => o.status === 'Open').length;
  const highCount = observations.filter(o => ['High','Critical'].includes(o.priority)).length;
  const resolvedCount = observations.filter(o => o.status === 'Closed').length;

  return (
    <Grid container spacing={2}>
      <Grid size ={{xs:3}}>
        <Card>
          <CardContent>
            <Typography>Total Observations</Typography>
            <Typography variant="h4">{total}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size ={{xs:3}}>
        <Card>
          <CardContent>
            <Typography>Open</Typography>
            <Typography variant="h4">{openCount}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size ={{xs:3}}>
        <Card>
          <CardContent>
            <Typography>High Priority</Typography>
            <Typography variant="h4">{highCount}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size ={{xs:3}}>
        <Card>
          <CardContent>
            <Typography>Closed</Typography>
            <Typography variant="h4">{resolvedCount}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SafetyDashboard;