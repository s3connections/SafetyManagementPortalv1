import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

interface PermitDetailsProps {
  permitId: string;
}

interface PermitDetail {
  id: number;
  permitNumber: string;
  title: string;
  permitType?: string;
  description?: string;
  status: string;
  startDate: string;
  endDate: string;
  workLocation?: string;
  safetyRequirements?: string;
  requestedByUserName: string;
  requestedByUserEmail: string;
  approvedByUserName?: string;
  approvedDate?: string;
  approvalNotes?: string;
  createdAt: string;
}

const PermitDetails: React.FC<PermitDetailsProps> = ({ permitId }) => {
  const navigate = useNavigate();
  const [permit, setPermit] = useState<PermitDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demonstration
    const mockPermit: PermitDetail = {
      id: parseInt(permitId),
      permitNumber: `PER-20250101-${permitId.padStart(4, '0')}`,
      title: 'Hot Work Permit - Welding Area A',
      permitType: 'Hot Work',
      description: 'Welding work required for maintenance of production equipment in Area A. Work involves cutting and welding of steel components.',
      status: 'Approved',
      startDate: '2025-01-15',
      endDate: '2025-01-16',
      workLocation: 'Production Floor A, Equipment Station 5',
      safetyRequirements: 'Fire watch required, proper ventilation, appropriate PPE including welding helmet, safety glasses, and fire-resistant clothing.',
      requestedByUserName: 'John Smith',
      requestedByUserEmail: 'john.smith@company.com',
      approvedByUserName: 'Safety Manager',
      approvedDate: '2025-01-05',
      approvalNotes: 'All safety requirements verified. Fire extinguisher equipment confirmed available.',
      createdAt: '2025-01-01'
    };

    setPermit(mockPermit);
    setLoading(false);
  }, [permitId]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      case 'expired': return 'default';
      default: return 'primary';
    }
  };

  const handleApprove = () => {
    // Handle permit approval
    console.log('Approving permit:', permitId);
  };

  const handleReject = () => {
    // Handle permit rejection
    console.log('Rejecting permit:', permitId);
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" p={3}>Loading...</Box>;
  }

  if (!permit) {
    return <Box textAlign="center" p={3}>Permit not found</Box>;
  }

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/permits')}
          sx={{ mr: 2 }}
        >
          Back to Permits
        </Button>
        <Typography variant="h4" component="h1" flexGrow={1}>
          Permit Details
        </Typography>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/permits/${permitId}/edit`)}
        >
          Edit
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid size ={{xs: 12, md:8}}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" color="primary">
                  {permit.permitNumber}
                </Typography>
                <Chip
                  label={permit.status}
                  color={getStatusColor(permit.status) as any}
                />
              </Box>

              <Typography variant="h5" gutterBottom>
                {permit.title}
              </Typography>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size ={{xs: 12, sm:6}}>
                  <Typography variant="body2" color="textSecondary">
                    Permit Type
                  </Typography>
                  <Typography variant="body1">
                    {permit.permitType || 'General'}
                  </Typography>
                </Grid>
                <Grid size ={{xs: 12, sm:6}}>
                  <Typography variant="body2" color="textSecondary">
                    Work Location
                  </Typography>
                  <Typography variant="body1">
                    {permit.workLocation || 'Not specified'}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size ={{xs: 12, sm:6}}>
                  <Typography variant="body2" color="textSecondary">
                    Start Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(permit.startDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid size ={{xs: 12, sm:6}}>
                  <Typography variant="body2" color="textSecondary">
                    End Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(permit.endDate).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" paragraph>
                {permit.description || 'No description provided'}
              </Typography>

              <Typography variant="h6" gutterBottom>
                Safety Requirements
              </Typography>
              <Typography variant="body1" paragraph>
                {permit.safetyRequirements || 'No specific requirements listed'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size ={{xs: 12, md:4}}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Request Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Requested By"
                    secondary={`${permit.requestedByUserName} (${permit.requestedByUserEmail})`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Request Date"
                    secondary={new Date(permit.createdAt).toLocaleDateString()}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {permit.approvedByUserName && (
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Approval Information
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Approved By"
                      secondary={permit.approvedByUserName}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Approval Date"
                      secondary={permit.approvedDate ? new Date(permit.approvedDate).toLocaleDateString() : 'N/A'}
                    />
                  </ListItem>
                </List>
                {permit.approvalNotes && (
                  <Paper sx={{ p: 2, mt: 1, backgroundColor: 'grey.50' }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Approval Notes
                    </Typography>
                    <Typography variant="body2">
                      {permit.approvalNotes}
                    </Typography>
                  </Paper>
                )}
              </CardContent>
            </Card>
          )}

          {permit.status.toLowerCase() === 'pending' && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Actions
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={handleApprove}
                    fullWidth
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={handleReject}
                    fullWidth
                  >
                    Reject
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default PermitDetails;