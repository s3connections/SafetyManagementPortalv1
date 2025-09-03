import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Search,
  FilterList
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

interface IncidentObservation {
  id: string;
  observationNumber: string;
  reportedBy: string;
  incidentDate: string;
  location: string;
  incidentType: string;
  severity: string;
  status: string;
  priority: string;
  description: string;
  assignedTo?: string;
}

const IncidentList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [incidents, setIncidents] = useState<IncidentObservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  // Dialog state
  const [deleteDialog, setDeleteDialog] = useState<{open: boolean, id: string | null}>({
    open: false,
    id: null
  });

  useEffect(() => {
    fetchIncidents();
  }, [page, rowsPerPage, searchTerm, statusFilter, priorityFilter, typeFilter]);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: rowsPerPage.toString(),
        search: searchTerm,
        status: statusFilter,
        priority: priorityFilter,
        type: typeFilter
      });

      const response = await fetch(`/api/incidentobservation?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setIncidents(data.items);
        setTotalCount(data.totalCount);
      }
    } catch (error) {
      console.error('Error fetching incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/incidentobservation/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchIncidents();
        setDeleteDialog({ open: false, id: null });
      }
    } catch (error) {
      console.error('Error deleting incident:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'closed': return 'success';
      case 'open': return 'warning';
      case 'in-progress': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Incident Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('new')}
        >
          New Incident
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Search"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  endAdornment: <Search />
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="In-Progress">In Progress</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                  <MenuItem value="Re-opened">Re-opened</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Unsafe Act">Unsafe Act</MenuItem>
                  <MenuItem value="Unsafe Condition">Unsafe Condition</MenuItem>
                  <MenuItem value="Near Miss">Near Miss</MenuItem>
                  <MenuItem value="Good Practice">Good Practice</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setPriorityFilter('');
                  setTypeFilter('');
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Incidents Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Reported By</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell>{incident.observationNumber}</TableCell>
                  <TableCell>
                    <Chip label={incident.incidentType} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{incident.location}</TableCell>
                  <TableCell>{incident.reportedBy}</TableCell>
                  <TableCell>{new Date(incident.incidentDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip 
                      label={incident.priority} 
                      color={getPriorityColor(incident.priority)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={incident.status} 
                      color={getStatusColor(incident.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{incident.assignedTo || 'Unassigned'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => navigate(`${incident.id}`)}>
                      <Visibility />
                    </IconButton>
                    <IconButton onClick={() => navigate(`edit/${incident.id}`)}>
                      <Edit />
                    </IconButton>
                    <IconButton 
                      onClick={() => setDeleteDialog({open: true, id: incident.id})}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
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
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({open: false, id: null})}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this incident observation?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({open: false, id: null})}>
            Cancel
          </Button>
          <Button 
            onClick={() => deleteDialog.id && handleDelete(deleteDialog.id)}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IncidentList;