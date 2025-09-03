import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Button, Grid, Chip, Box,
  List, ListItem, ListItemText, Paper, Divider, Alert
} from '@mui/material';
import { 
  Edit as EditIcon, 
  CheckCircle as ApproveIcon,
  Cancel as CancelIcon,
  Print as PrintIcon 
} from '@mui/icons-material';

interface PermitDetailsProps {
  permitId: string;
  onEdit?: () => void;
  onApprove?: () => void;
  onCancel?: () => void;
}

interface PermitDetail {
  id: string;
  permitNumber: string;
  title: string;
  permitType: string;
  status: string;
  description: string;
  workLocation: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  requestedBy: string;
  department: string;
  contractorCompany?: string;
  workCrew: string;
  hazards: string[];
  safetyMeasures: string;
  equipmentRequired: string;
  emergencyContacts: string;
  specialInstructions?: string;
  approvals?: {
    approvedBy: string;
    approvedDate: Date;
    comments?: string;
  }[];
}

const PermitDetails: React.FC<PermitDetailsProps> = ({
  permitId, onEdit, onApprove, onCancel
}) => {
  const [permit, setPermit] = useState<PermitDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPermitDetails();
  }, [permitId]);

  const loadPermitDetails = async () => {
    setLoading(true);
    try {
      // Mock data
      const mockPermit: PermitDetail = {
        id: permitId,
        permitNumber: 'WP-2024-001',
        title: 'Hot Work Permit - Welding Operations',
        permitType: 'Hot Work',
        status: 'Pending Approval',
        description: 'Welding work required for pipe repair in Building A',
        workLocation: 'Building A - Level 2, Room 245',
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000),
        startTime: '08:00',
        endTime: '17:00',
        requestedBy: 'John Smith',
        department: 'Maintenance',
        workCrew: 'John Smith, Mike Johnson',
        hazards: ['Fire/Explosion Risk', 'Hot Surfaces', 'Fumes'],
        safetyMeasures: 'Fire watch, proper ventilation, fire extinguisher on standby',
        equipmentRequired: 'Welding helmet, fire-resistant clothing, gas detector',
        emergencyContacts: 'Emergency: 911, Security: 555-0123'
      };
      setPermit(mockPermit);
    } catch (error) {
      console.error('Error loading permit details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'default';
      case 'Pending Approval': return 'warning';
      case 'Approved': return 'info';
      case 'Active': return 'success';
      case 'Expired': return 'error';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const isExpiringSoon = () => {
    if (!permit) return false;
    const oneDayFromNow = new Date(Date.now() + 86400000);
    return permit.endDate <= oneDayFromNow;
  };

  if (loading) {
    return <Card><CardContent><Typography>Loading permit details...</Typography></CardContent></Card>;
  }

  if (!permit) {
    return <Card><CardContent><Typography>Permit not found</Typography></CardContent></Card>;
  }

  return (
    <Box>
      {/* Status Alert */}
      {isExpiringSoon() && permit.status === 'Active' && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          This permit is expiring soon. Please renew or complete the work.
        </Alert>
      )}

      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
            <Box>
              <Typography variant="h4" gutterBottom>{permit.title}</Typography>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Permit #{permit.permitNumber}
              </Typography>
              <Box display="flex" gap={1} mb={2}>
                <Chip label={permit.status} color={getStatusColor(permit.status) as any} />
                <Chip label={permit.permitType} variant="outlined" />
              </Box>
            </Box>
            <Box display="flex" gap={1}>
              <Button variant="outlined" startIcon={<PrintIcon />}>Print</Button>
              {permit.status === 'Pending Approval' && (
                <>
                  <Button variant="contained" startIcon={<ApproveIcon />} onClick={onApprove} color="success">
                    Approve
                  </Button>
                  <Button variant="outlined" startIcon={<CancelIcon />} onClick={onCancel} color="error">
                    Reject
                  </Button>
                </>
              )}
              <Button variant="outlined" startIcon={<EditIcon />} onClick={onEdit}>Edit</Button>
            </Box>
          </Box>

          <Typography variant="body1" paragraph>{permit.description}</Typography>

          <Grid container spacing={3}>
            <Grid size ={{xs: 12, md:6}}>
              <List dense>
                <ListItem><ListItemText primary="Work Location" secondary={permit.workLocation} /></ListItem>
                <ListItem><ListItemText primary="Valid Period" secondary={`${permit.startDate.toLocaleDateString()} - ${permit.endDate.toLocaleDateString()}`} /></ListItem>
                <ListItem><ListItemText primary="Work Hours" secondary={`${permit.startTime} - ${permit.endTime}`} /></ListItem>
              </List>
            </Grid>
            <Grid size ={{xs: 12, md:6}}>
              <List dense>
                <ListItem><ListItemText primary="Requested By" secondary={permit.requestedBy} /></ListItem>
                <ListItem><ListItemText primary="Department" secondary={permit.department} /></ListItem>
                <ListItem><ListItemText primary="Work Crew" secondary={permit.workCrew} /></ListItem>
                {permit.contractorCompany && (
                  <ListItem><ListItemText primary="Contractor" secondary={permit.contractorCompany} /></ListItem>
                )}
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Safety Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Safety Information</Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={3}>
            <Grid size ={{xs:12}}>
              <Typography variant="subtitle2" gutterBottom>Identified Hazards:</Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                {permit.hazards.map((hazard, index) => (
                  <Chip key={index} label={hazard} color="warning" variant="outlined" size="small" />
                ))}
              </Box>
            </Grid>

            <Grid size ={{xs: 12, md:6}}>
              <Typography variant="subtitle2" gutterBottom>Safety Measures:</Typography>
              <Typography variant="body2" paragraph>{permit.safetyMeasures}</Typography>
            </Grid>

            <Grid size ={{xs: 12, md:6}}>
              <Typography variant="subtitle2" gutterBottom>Required Equipment/PPE:</Typography>
              <Typography variant="body2" paragraph>{permit.equipmentRequired}</Typography>
            </Grid>

            <Grid size ={{xs: 12, md:6}}>
              <Typography variant="subtitle2" gutterBottom>Emergency Contacts:</Typography>
              <Typography variant="body2">{permit.emergencyContacts}</Typography>
            </Grid>

            {permit.specialInstructions && (
              <Grid size ={{xs: 12, md:6}}>
                <Typography variant="subtitle2" gutterBottom>Special Instructions:</Typography>
                <Typography variant="body2">{permit.specialInstructions}</Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Approvals */}
      {permit.approvals && permit.approvals.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Approval History</Typography>
            <Divider sx={{ mb: 2 }} />
            {permit.approvals.map((approval, index) => (
              <Box key={index} mb={2}>
                <Typography variant="subtitle2">
                  Approved by: {approval.approvedBy}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Date: {approval.approvedDate.toLocaleDateString()}
                </Typography>
                {approval.comments && (
                  <Typography variant="body2">
                    Comments: {approval.comments}
                  </Typography>
                )}
              </Box>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default PermitDetails;