import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Assignment as AssignIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  GetApp as ExportIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import ObservationService from '../services/ObservationService';
import { Observation, ObservationType, Priority, ObservationStatus, ObservationStage } from '../types';

interface ObservationListProps {
  onViewObservation?: (observation: Observation) => void;
  onEditObservation?: (observation: Observation) => void;
  onCreateObservation?: () => void;
}

const ObservationList: React.FC<ObservationListProps> = ({
  onViewObservation,
  onEditObservation,
  onCreateObservation
}) => {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filters
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    observationType: '',
    plantId: '',
    departmentId: ''
  });

  // Filter dialog
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const loadObservations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ObservationService.getObservations(
        page + 1, 
        rowsPerPage, 
        {
          status: filters.status || undefined,
          priority: filters.priority || undefined,
          plantId: filters.plantId ? parseInt(filters.plantId) : undefined,
          departmentId: filters.departmentId ? parseInt(filters.departmentId) : undefined
        }
      );

      if (response.success) {
        setObservations(response.data);
        setTotalCount(response.totalCount);
      } else {
        setError('Failed to load observations');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load observations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadObservations();
  }, [page, rowsPerPage, filters]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setPage(0); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      observationType: '',
      plantId: '',
      departmentId: ''
    });
    setPage(0);
  };

  const getPriorityColor = (priority: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (status) {
      case 'Open': return 'primary';
      case 'In_Progress': return 'info';
      case 'Closed': return 'success';
      case 'Re_Assigned': return 'warning';
      case 'Wrongly_Assigned': return 'error';
      default: return 'default';
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={loadObservations}>
            Retry
          </Button>
        }>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Safety Observations
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadObservations}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setFilterDialogOpen(true)}
          >
            Filter
          </Button>
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            disabled={observations.length === 0}
          >
            Export
          </Button>
          {onCreateObservation && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateObservation}
            >
              New Observation
            </Button>
          )}
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Observations
              </Typography>
              <Typography variant="h4">
                {totalCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Open
              </Typography>
              <Typography variant="h4" color="primary">
                {observations.filter(o => o.status === 'Open').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                High Priority
              </Typography>
              <Typography variant="h4" color="error">
                {observations.filter(o => o.priority === 'High').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Overdue
              </Typography>
              <Typography variant="h4" color="warning.main">
                {observations.filter(o => o.slaDeadline && new Date(o.slaDeadline) < new Date()).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Data Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Ticket #</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Reported By</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell>SLA Deadline</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : observations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      No observations found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                observations.map((observation) => (
                  <TableRow key={observation.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {observation.ticketNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={observation.observationType.replace('_', ' ')} 
                        size="small" 
                        variant="outlined" 
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200 }}>
                        {observation.description.length > 100 
                          ? `${observation.description.substring(0, 100)}...`
                          : observation.description
                        }
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={observation.priority} 
                        color={getPriorityColor(observation.priority)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={observation.status.replace('_', ' ')} 
                        color={getStatusColor(observation.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{observation.location}</TableCell>
                    <TableCell>
                      {(observation as any).reporter?.firstName} {(observation as any).reporter?.lastName}
                    </TableCell>
                    <TableCell>
                      {(observation as any).assignedUser?.firstName} {(observation as any).assignedUser?.lastName || 'Unassigned'}
                    </TableCell>
                    <TableCell>
                      {format(new Date(observation.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      {observation.slaDeadline ? (
                        <Typography 
                          variant="body2" 
                          color={new Date(observation.slaDeadline) < new Date() ? 'error' : 'textPrimary'}
                        >
                          {format(new Date(observation.slaDeadline), 'MMM dd, yyyy')}
                        </Typography>
                      ) : '-'}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {onViewObservation && (
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small" 
                              onClick={() => onViewObservation(observation)}
                              color="primary"
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {onEditObservation && (
                          <Tooltip title="Edit Observation">
                            <IconButton 
                              size="small" 
                              onClick={() => onEditObservation(observation)}
                              color="secondary"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Reassign">
                          <IconButton size="small" color="info">
                            <AssignIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Filter Observations</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="In_Progress">In Progress</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                  <MenuItem value="Re_Assigned">Re-Assigned</MenuItem>
                  <MenuItem value="Wrongly_Assigned">Wrongly Assigned</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filters.priority}
                  label="Priority"
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                >
                  <MenuItem value="">All Priorities</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Observation Type</InputLabel>
                <Select
                  value={filters.observationType}
                  label="Observation Type"
                  onChange={(e) => handleFilterChange('observationType', e.target.value)}
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="Unsafe_Act">Unsafe Act</MenuItem>
                  <MenuItem value="Unsafe_Condition">Unsafe Condition</MenuItem>
                  <MenuItem value="Work_Stoppage">Work Stoppage</MenuItem>
                  <MenuItem value="Near_Miss">Near Miss</MenuItem>
                  <MenuItem value="Good_Practice">Good Practice</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Plant ID"
                value={filters.plantId}
                onChange={(e) => handleFilterChange('plantId', e.target.value)}
                type="number"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={clearFilters}>Clear All</Button>
          <Button onClick={() => setFilterDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => setFilterDialogOpen(false)} variant="contained">Apply Filters</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ObservationList;