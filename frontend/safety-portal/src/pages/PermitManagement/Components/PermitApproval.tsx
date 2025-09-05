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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

interface PermitApprovalData {
  id: number;
  permitNumber: string;
  title: string;
  permitType?: string;
  status: string;
  requestedByUserName: string;
  workLocation?: string;
  startDate: string;
  endDate: string;
}

const PermitApproval: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [permit, setPermit] = useState<PermitApprovalData | null>(null);
  const [decision, setDecision] = useState<'approve' | 'reject'>('approve');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Mock data for demonstration
    const mockPermit: PermitApprovalData = {
      id: parseInt(id || '0'),
      permitNumber: `PER-20250101-${(id || '0').padStart(4, '0')}`,
      title: 'Hot Work Permit - Welding Area A',
      permitType: 'Hot Work',
      status: 'Pending',
      requestedByUserName: 'John Smith',
      workLocation: 'Production Floor A',
      startDate: '2025-01-15',
      endDate: '2025-01-16',
    };

    setPermit(mockPermit);
    setLoading(false);
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!permit) return;

    setSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Permit approval decision:', {
        permitId: permit.id,
        decision,
        notes,
      });

      // Navigate back to permit details
      navigate(`/permits/${permit.id}`);
    } catch (error) {
      console.error('Error submitting approval:', error);
    } finally {
      setSubmitting(false);
    }
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
          onClick={() => navigate(`/permits/${permit.id}`)}
          sx={{ mr: 2 }}
        >
          Back to Details
        </Button>
        <Typography variant="h4" component="h1">
          Permit Approval
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size ={{xs: 12, md:6}}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                {permit.permitNumber}
              </Typography>
              
              <Typography variant="h5" gutterBottom>
                {permit.title}
              </Typography>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid size ={{xs:6}}>
                  <Typography variant="body2" color="textSecondary">
                    Type
                  </Typography>
                  <Typography variant="body1">
                    {permit.permitType || 'General'}
                  </Typography>
                </Grid>
                <Grid size ={{xs:6}}>
                  <Typography variant="body2" color="textSecondary">
                    Status
                  </Typography>
                  <Chip label={permit.status} color="warning" size="small" />
                </Grid>
                <Grid size ={{xs:6}}>
                  <Typography variant="body2" color="textSecondary">
                    Requested By
                  </Typography>
                  <Typography variant="body1">
                    {permit.requestedByUserName}
                  </Typography>
                </Grid>
                <Grid size ={{xs:6}}>
                  <Typography variant="body2" color="textSecondary">
                    Work Location
                  </Typography>
                  <Typography variant="body1">
                    {permit.workLocation || 'Not specified'}
                  </Typography>
                </Grid>
                <Grid size ={{xs:6}}>
                  <Typography variant="body2" color="textSecondary">
                    Start Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(permit.startDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid size ={{xs:6}}>
                  <Typography variant="body2" color="textSecondary">
                    End Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(permit.endDate).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size ={{xs: 12, md:6}}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Approval Decision
              </Typography>

              <form onSubmit={handleSubmit}>
                <FormControl component="fieldset" sx={{ mb: 3 }}>
                  <FormLabel component="legend">Decision</FormLabel>
                  <RadioGroup
                    value={decision}
                    onChange={(e) => setDecision(e.target.value as 'approve' | 'reject')}
                  >
                    <FormControlLabel 
                      value="approve" 
                      control={<Radio />} 
                      label="Approve Permit" 
                    />
                    <FormControlLabel 
                      value="reject" 
                      control={<Radio />} 
                      label="Reject Permit" 
                    />
                  </RadioGroup>
                </FormControl>

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label={decision === 'approve' ? 'Approval Notes' : 'Rejection Reason'}
                  placeholder={
                    decision === 'approve' 
                      ? 'Enter any approval notes or conditions...'
                      : 'Please explain the reason for rejection...'
                  }
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  sx={{ mb: 3 }}
                  required={decision === 'reject'}
                />

                {decision === 'reject' && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    Please provide a clear reason for rejection to help the requestor understand what needs to be addressed.
                  </Alert>
                )}

                <Box display="flex" gap={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    color={decision === 'approve' ? 'success' : 'error'}
                    startIcon={decision === 'approve' ? <CheckCircleIcon /> : <CancelIcon />}
                    disabled={submitting}
                    fullWidth
                  >
                    {submitting 
                      ? 'Processing...' 
                      : decision === 'approve' 
                        ? 'Approve Permit' 
                        : 'Reject Permit'
                    }
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PermitApproval;