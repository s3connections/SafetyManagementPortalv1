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
  Add as AddIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import ObservationService from '../services/ObservationService';
import { ObservationType, Observation } from '../types';

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
    observationType: ''
  });

  const loadObservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ObservationService.getAllObservations();
      if (!response.success || !response.data) {
        setError(response.error || 'Failed to load');
        return;
      }
      let filtered = response.data as Observation[];
      if (filters.status) {
        filtered = filtered.filter(o => o.status === filters.status);
      }
      if (filters.priority) {
        filtered = filtered.filter(o => o.priority === filters.priority);
      }
      if (filters.observationType) {
        filtered = filtered.filter(o => o.observationType === filters.observationType);
      }
      setTotalCount(filtered.length);
      const start = page * rowsPerPage;
      setObservations(filtered.slice(start, start + rowsPerPage));
    } catch (err: any) {
      setError(err.message || 'Failed to load observations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadObservations();
  }, [page, rowsPerPage, filters]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(0);
  };

  return (
    <Box>
      <Grid container spacing={2} alignItems="center" mb={2}>
        <Grid item>
          <Typography variant="h5">Safety Observations</Typography>
        </Grid>
        <Grid item>
          <Button onClick={loadObservations} disabled={loading} startIcon={<RefreshIcon />}>
            Refresh
          </Button>
        </Grid>
        {onCreateObservation && (
          <Grid item>
            <Button variant="contained" onClick={onCreateObservation} startIcon={<AddIcon />}>
              New Observation
            </Button>
          </Grid>
        )}
      </Grid>

      {error && (
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={loadObservations}>
            Retry
          </Button>
        }>
          {error}
        </Alert>
      )}

      <Box mb={2} display="flex" gap={2}>
        <FormControl>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            label="Status"
            onChange={e => handleFilterChange('status', e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="In_Progress">In Progress</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Priority</InputLabel>
          <Select
            value={filters.priority}
            label="Priority"
            onChange={e => handleFilterChange('priority', e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Type</InputLabel>
          <Select
            value={filters.observationType}
            label="Type"
            onChange={e => handleFilterChange('observationType', e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {Object.values(ObservationType).map(type => (
              <MenuItem key={type} value={type}>{type.replace('_', ' ')}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Paper>
        <TableContainer>
          {loading ? (
            <Box p={4} textAlign="center"><CircularProgress /></Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ticket</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {observations.map(obs => (
                  <TableRow key={obs.id}>
                    <TableCell>{obs.ticketNumber}</TableCell>
                    <TableCell>
                      {obs.description.length > 50
                        ? `${obs.description.slice(0, 50)}…`
                        : obs.description}
                    </TableCell>
                    <TableCell>
                      <Chip label={obs.priority} color={
                        obs.priority === 'High' ? 'error' :
                        obs.priority === 'Medium' ? 'warning' :
                        'success'
                      } />
                    </TableCell>
                    <TableCell>
                      <Chip label={obs.status} color={
                        obs.status === 'Open' ? 'primary' :
                        obs.status === 'In_Progress' ? 'info' :
                        'default'
                      } />
                    </TableCell>
                    <TableCell>{obs.observationType.replace('_', ' ')}</TableCell>
                    <TableCell>
                      {onViewObservation && (
                        <IconButton onClick={() => onViewObservation(obs)}><ViewIcon /></IconButton>
                      )}
                      {onEditObservation && (
                        <IconButton onClick={() => onEditObservation(obs)}><EditIcon /></IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default ObservationList;