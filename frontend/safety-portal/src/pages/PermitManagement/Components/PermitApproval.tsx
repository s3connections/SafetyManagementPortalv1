import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Security as SecurityIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Permit, PermitStatus, PermitType } from '../../../types';

interface PermitApprovalProps {
  permitId?: number;
}

const PermitApproval: React.FC<PermitApprovalProps> = ({ permitId }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const actualPermitId = permitId || (id ? parseInt(id) : undefined);

  const [permit, setPermit] = useState<Permit | null>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [approvalRemarks, setApprovalRemarks] = useState('');
  const [rejectionRemarks, setRejectionRemarks] = useState('');
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);

  useEffect(() => {
    if (actualPermitId) {
      fetchPermit();
    }
  }, [actualPermitId]);

  const fetchPermit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/permits/${actualPermitId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch permit');
      }
      
      const result = await response.json();
      setPermit(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!permit) return;

    try {
      setApproving(true);
      
      const response = await fetch(`/api/permits/${permit.id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'approve',
          remarks: approvalRemarks
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to approve permit');
      }
      
      const result = await response.json();
      setPermit(result.data);
      setShowApprovalDialog(false);
      setApprovalRemarks('');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve permit');
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!permit) return;

    try {
      setApproving(true);
      
      const response = await fetch(`/api/permits/${permit.id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reject',
          remarks: rejectionRemarks
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to reject permit');
      }
      
      const result = await response.json();
      setPermit(result.data);
      setShowRejectionDialog(false);
      setRejectionRemarks('');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject permit');
    } finally {
      setApproving(false);
    }
  };

  const getStatusColor = (status: PermitStatus) => {
    switch (status) {
      case PermitStatus.DRAFT:
        return 'default';
      case PermitStatus.PENDING_APPROVAL:
        return 'warning';
      case PermitStatus.APPROVED:
        return 'success';
      case PermitStatus.ACTIVE:
        return 'info';
      case PermitStatus.COMPLETED:
        return 'success';
      case PermitStatus.CANCELLED:
      case PermitStatus.EXPIRED:
        return 'error';
      default:
        return 'default';
    }
  };

  const getPermitTypeColor = (type: PermitType) => {
    switch (type) {
      case PermitType.HOT_WORK:
        return 'error';
      case PermitType.CONFINED_SPACE:
        return 'warning';
      case PermitType.HEIGHT_WORK:
        return 'info';
      case PermitType.ELECTRICAL_WORK:
        return 'secondary';
      case PermitType.EXCAVATION:
        return 'primary';
      case PermitType.CHEMICAL_HANDLING:
        return 'error';
      default:
        return 'default';
    }
  };

  const getApprovalSteps = () => [
    'Risk Assessment Review',
    'Safety Measures Verification',
    'Authorization Check',
    'Final Approval'
  ];

  const getCurrentStep = () => {
    if (!permit) return 0;
    
    switch (permit.status) {
      case PermitStatus.DRAFT:
        return 0;
      case PermitStatus.PENDING_APPROVAL:
        return 1;
      case PermitStatus.APPROVED:
        return 4;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchPermit}>
          Retry
        </Button>
      </Box>
    );
  }

  if (!permit) {
    return (
      <Box p={3}>
        <Alert severity="warning">
          Permit not found
        </Alert>
      </Box>
    );
  }

  const canApprove = permit.status === PermitStatus.PENDING_APPROVAL;

  return (
    <Box p={3}>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>
          Permit Approval
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/permits')}>
          Back to Permits
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Permit Details */}
        <Grid size ={{xs: 12, md:8}}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                <Typography variant="h6" gutterBottom>
                  Permit Details
                </Typography>
                <Box display="flex" gap={1}>
                  <Chip 
                    label={permit.type.replace('_', ' ')} 
                    color={getPermitTypeColor(permit.type)}
                    size="small"
                  />
                  <Chip 
                    label={permit.status.replace('_', ' ')} 
                    color={getStatusColor(permit.status)}
                    size="small"
                  />
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid size ={{xs: 12, sm:6}}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Permit Number
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {permit.permitNumber}
                  </Typography>
                </Grid>

                <Grid size ={{xs: 12, sm:6}}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Title
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {permit.title}
                  </Typography>
                </Grid>

                <Grid size ={{xs:12}}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Description
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {permit.description}
                  </Typography>
                </Grid>

                <Grid size ={{xs: 12, sm:6}}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Valid From
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {format(new Date(permit.validFrom), 'PPP p')}
                  </Typography>
                </Grid>

                <Grid size ={{xs: 12, sm:6}}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Valid To
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {format(new Date(permit.validTo), 'PPP p')}
                  </Typography>
                </Grid>

                <Grid size ={{xs:12}}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Location
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {permit.location}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Risk Assessment
              </Typography>
              <Typography variant="body1">
                {permit.riskAssessment}
              </Typography>
            </CardContent>
          </Card>

          {/* Safety Measures */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <CheckCircleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Safety Measures
              </Typography>
              <List>
                {permit.safetyMeasures.map((measure, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <WarningIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText primary={measure} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Approval Panel */}
        <Grid size ={{xs: 12, md:4}}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Approval Status
              </Typography>

              <Stepper orientation="vertical" activeStep={getCurrentStep()}>
                {getApprovalSteps().map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" alignItems="center" mb={2}>
                <PersonIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle2">
                  Requested by: {permit.requester?.firstName} {permit.requester?.lastName}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={2}>
                <ScheduleIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle2">
                  Requested on: {format(new Date(permit.createdAt), 'PPP')}
                </Typography>
              </Box>

              {canApprove && (
                <Box mt={3}>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    onClick={() => setShowApprovalDialog(true)}
                    disabled={approving}
                    sx={{ mb: 1 }}
                  >
                    Approve Permit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    onClick={() => setShowRejectionDialog(true)}
                    disabled={approving}
                  >
                    Reject Permit
                  </Button>
                </Box>
              )}

              {permit.status === PermitStatus.APPROVED && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  This permit has been approved
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onClose={() => setShowApprovalDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Approve Permit</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to approve this permit?
          </Typography>
          <TextField
            multiline
            rows={3}
            fullWidth
            label="Approval Remarks (Optional)"
            value={approvalRemarks}
            onChange={(e) => setApprovalRemarks(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowApprovalDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleApprove} 
            variant="contained" 
            color="success"
            disabled={approving}
          >
            {approving ? <CircularProgress size={20} /> : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={showRejectionDialog} onClose={() => setShowRejectionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Permit</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Please provide a reason for rejecting this permit:
          </Typography>
          <TextField
            multiline
            rows={3}
            fullWidth
            label="Rejection Reason"
            value={rejectionRemarks}
            onChange={(e) => setRejectionRemarks(e.target.value)}
            required
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRejectionDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleReject} 
            variant="contained" 
            color="error"
            disabled={approving || !rejectionRemarks.trim()}
          >
            {approving ? <CircularProgress size={20} /> : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PermitApproval;