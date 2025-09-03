import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Button, Grid, TextField, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  FormControl, InputLabel, Select, MenuItem, Chip, Box, IconButton
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Visibility as ViewIcon, CheckCircle as ApproveIcon } from '@mui/icons-material';

interface PermitListProps {
  onCreatePermit?: () => void;
  onEditPermit?: (permitId: string) => void;
  onViewPermit?: (permitId: string) => void;
  onApprovePermit?: (permitId: string) => void;
}

interface Permit {
  id: string;
  permitNumber: string;
  title: string;
  permitType: string;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Active' | 'Expired' | 'Cancelled';
  requestedBy: string;
  startDate: Date;
  endDate: Date;
  department: string;
  workLocation: string;
}

const PermitList: React.FC<PermitListProps> = ({ 
  onCreatePermit, onEditPermit, onViewPermit, onApprovePermit 
}) => {
  const [permits, setPermits] = useState<Permit[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    loadPermits();
  }, []);

  const loadPermits = async () => {
    // Mock data
    const mockPermits: Permit[] = [
      {
        id: '1',
        permitNumber: 'WP-2024-001',
        title: 'Hot Work Permit - Welding',
        permitType: 'Hot Work',
        status: 'Pending Approval',
        requestedBy: 'John Smith',
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000), // +1 day
        department: 'Maintenance',
        workLocation: 'Building A - Level 2'
      }
    ];
    setPermits(mockPermits);
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

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Work Permit Management</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={onCreatePermit}>
              Create Permit
            </Button>
          </Box>
          <Grid container spacing={2} alignItems="center">
            <Grid size ={{xs: 12, md:3}}>
              <TextField
                fullWidth label="Search" variant="outlined"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid>
            <Grid size ={{xs: 12, md:3}}>
              <FormControl fullWidth>
                <InputLabel>Filter by Status</InputLabel>
                <Select value={filterStatus} label="Filter by Status" onChange={(e) => setFilterStatus(e.target.value)}>
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Pending Approval">Pending Approval</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Expired">Expired</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size ={{xs: 12, md:3}}>
              <FormControl fullWidth>
                <InputLabel>Filter by Type</InputLabel>
                <Select value={filterType} label="Filter by Type" onChange={(e) => setFilterType(e.target.value)}>
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="Hot Work">Hot Work</MenuItem>
                  <MenuItem value="Confined Space">Confined Space</MenuItem>
                  <MenuItem value="Working at Height">Working at Height</MenuItem>
                  <MenuItem value="Electrical">Electrical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Permit #</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Requested By</TableCell>
                  <TableCell>Valid Period</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {permits.map((permit) => (
                  <TableRow key={permit.id}>
                    <TableCell>{permit.permitNumber}</TableCell>
                    <TableCell>{permit.title}</TableCell>
                    <TableCell>{permit.permitType}</TableCell>
                    <TableCell>
                      <Chip label={permit.status} color={getStatusColor(permit.status) as any} size="small" />
                    </TableCell>
                    <TableCell>{permit.requestedBy}</TableCell>
                    <TableCell>
                      {permit.startDate.toLocaleDateString()} - {permit.endDate.toLocaleDateString()}
                    </TableCell>
                    <TableCell>{permit.workLocation}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => onViewPermit?.(permit.id)}>
                        <ViewIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => onEditPermit?.(permit.id)}>
                        <EditIcon />
                      </IconButton>
                      {permit.status === 'Pending Approval' && (
                        <IconButton size="small" onClick={() => onApprovePermit?.(permit.id)} color="success">
                          <ApproveIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PermitList;