import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Button, Grid, Chip, Box,
  List, ListItem, ListItemText, Paper, Divider
} from '@mui/material';
import { Edit as EditIcon, Assignment as AssignmentIcon } from '@mui/icons-material';

interface IncidentDetailsProps {
  incidentId: string;
  onEdit?: () => void;
  onStartInvestigation?: () => void;
}

interface IncidentDetail {
  id: string;
  title: string;
  description: string;
  status: string;
  severity: string;
  incidentType: string;
  incidentDate: Date;
  reportedBy: string;
  location: string;
  witnesses: string;
  immediateActions: string;
  investigation?: {
    investigator: string;
    status: string;
    findings: string;
    rootCause: string;
    correctiveActions: string[];
  };
}

const IncidentDetails: React.FC<IncidentDetailsProps> = ({
  incidentId, onEdit, onStartInvestigation
}) => {
  const [incident, setIncident] = useState<IncidentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIncidentDetails();
  }, [incidentId]);

  const loadIncidentDetails = async () => {
    setLoading(true);
    try {
      // Mock data
      const mockIncident: IncidentDetail = {
        id: incidentId,
        title: 'Slip and Fall Incident',
        description: 'Employee slipped on wet floor in manufacturing area',
        status: 'Open',
        severity: 'Medium',
        incidentType: 'Injury',
        incidentDate: new Date(),
        reportedBy: 'John Smith',
        location: 'Manufacturing Floor A',
        witnesses: 'Jane Doe, Mike Johnson',
        immediateActions: 'First aid provided, area cordoned off'
      };
      setIncident(mockIncident);
    } catch (error) {
      console.error('Error loading incident details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'error';
      case 'Under Investigation': return 'warning';
      case 'Closed': return 'success';
      default: return 'default';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'info';
      default: return 'default';
    }
  };

  if (loading) {
    return <Card><CardContent><Typography>Loading incident details...</Typography></CardContent></Card>;
  }

  if (!incident) {
    return <Card><CardContent><Typography>Incident not found</Typography></CardContent></Card>;    
  }

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
            <Box>
              <Typography variant="h4" gutterBottom>{incident.title}</Typography>
              <Box display="flex" gap={1} mb={2}>
                <Chip label={incident.status} color={getStatusColor(incident.status) as any} />
                <Chip label={incident.severity} color={getSeverityColor(incident.severity) as any} />
                <Chip label={incident.incidentType} />
              </Box>
            </Box>
            <Box display="flex" gap={1}>
              {incident.status === 'Open' && (
                <Button variant="contained" startIcon={<AssignmentIcon />} onClick={onStartInvestigation}>
                  Start Investigation
                </Button>
              )}
              <Button variant="outlined" startIcon={<EditIcon />} onClick={onEdit}>Edit</Button>
            </Box>
          </Box>

          <Typography variant="body1" color="textSecondary" paragraph>
            {incident.description}
          </Typography>

          <Grid container spacing={3}>
            <Grid size ={{xs: 12, md:6}}>
              <List dense>
                <ListItem><ListItemText primary="Incident Date" secondary={incident.incidentDate.toLocaleString()} /></ListItem>
                <ListItem><ListItemText primary="Location" secondary={incident.location} /></ListItem>
                <ListItem><ListItemText primary="Reported By" secondary={incident.reportedBy} /></ListItem>
              </List>
            </Grid>
            <Grid size ={{xs: 12, md:6}}>
              <List dense>
                <ListItem><ListItemText primary="Witnesses" secondary={incident.witnesses || 'None'} /></ListItem>
                <ListItem><ListItemText primary="Immediate Actions" secondary={incident.immediateActions} /></ListItem>
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {incident.investigation && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Investigation Details</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={3}>
              <Grid size ={{xs: 12, md:6}}>
                <List dense>
                  <ListItem><ListItemText primary="Investigator" secondary={incident.investigation.investigator} /></ListItem>
                  <ListItem><ListItemText primary="Status" secondary={incident.investigation.status} /></ListItem>
                </List>
              </Grid>
              <Grid size ={{xs:12}}>
                <Typography variant="subtitle2" gutterBottom>Findings:</Typography>
                <Typography variant="body2" paragraph>{incident.investigation.findings}</Typography>
                <Typography variant="subtitle2" gutterBottom>Root Cause:</Typography>
                <Typography variant="body2" paragraph>{incident.investigation.rootCause}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default IncidentDetails;