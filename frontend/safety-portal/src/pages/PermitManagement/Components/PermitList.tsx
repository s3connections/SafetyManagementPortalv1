import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

interface Permit {
  id: number;
  permitNumber: string;
  title: string;
  permitType?: string;
  status: string;
  startDate: string;
  endDate: string;
  requestedByUserName: string;
  workLocation?: string;
  createdAt: string;
}

const PermitList: React.FC = () => {
  const [permits, setPermits] = useState<Permit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock data for demonstration
    const mockPermits: Permit[] = [
      {
        id: 1,
        permitNumber: 'PER-20250101-0001',
        title: 'Hot Work Permit - Welding Area A',
        permitType: 'Hot Work',
        status: 'Approved',
        startDate: '2025-01-15',
        endDate: '2025-01-16',
        requestedByUserName: 'John Smith',
        workLocation: 'Production Floor A',
        createdAt: '2025-01-01'
      },
      {
        id: 2,
        permitNumber: 'PER-20250102-0002',
        title: 'Confined Space Entry - Tank 101',
        permitType: 'Confined Space',
        status: 'Pending',
        startDate: '2025-01-20',
        endDate: '2025-01-21',
        requestedByUserName: 'Jane Doe',
        workLocation: 'Tank Farm',
        createdAt: '2025-01-02'
      }
    ];

    setPermits(mockPermits);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      case 'expired': return 'default';
      default: return 'primary';
    }
  };

  const filteredPermits = permits.filter(permit =>
    permit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permit.permitNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Box display="flex" justifyContent="center" p={3}>Loading...</Box>;
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Permits Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/permits/create"
        >
          New Permit
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search permits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Permit Number</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Dates</TableCell>
                  <TableCell>Requested By</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPermits.map((permit) => (
                  <TableRow key={permit.id}>
                    <TableCell>
                      <Typography variant="subtitle2" color="primary">
                        {permit.permitNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>{permit.title}</TableCell>
                    <TableCell>{permit.permitType || 'General'}</TableCell>
                    <TableCell>
                      <Chip
                        label={permit.status}
                        color={getStatusColor(permit.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(permit.startDate).toLocaleDateString()} - {new Date(permit.endDate).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>{permit.requestedByUserName}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        component={Link}
                        to={`/permits/${permit.id}`}
                        title="View Details"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        component={Link}
                        to={`/permits/${permit.id}/edit`}
                        title="Edit"
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredPermits.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="textSecondary">
                No permits found
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {searchTerm ? 'Try adjusting your search criteria' : 'Create your first permit to get started'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PermitList;