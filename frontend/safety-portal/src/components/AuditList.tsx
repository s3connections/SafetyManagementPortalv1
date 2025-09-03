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
  CircularProgress,
  LinearProgress
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  PlayArrow as StartIcon,
  Stop as CompleteIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  GetApp as ExportIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import AuditService from '../services/AuditService';
import { Audit, AuditStatus } from '.components';

interface AuditListProps {
  onViewAudit?: (audit: Audit) => void;
  onEditAudit?: (audit: Audit) => void;
  onCreateAudit?: () => void;
}

const AuditList: React.FC<AuditListProps> = ({
  onViewAudit,
  onEditAudit,
  onCreateAudit
}) => {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filters
  const [filters, setFilters] = useState({
    status: '',
    plantId: '',
    departmentId: '',
    auditorId: ''
  });

  // Filter dialog
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  // Start/Complete audit dialog
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: 'start' | 'complete';
    audit: Audit | null;
    score?: number;
    remarks?: string;
  }>({ open: false, action: 'start', audit: null });

  const loadAudits = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await AuditService.getAudits(
        page + 1, 
        rowsPerPage, 
        {
          status: filters.status || undefined,
          plantId: filters.plantId ? parseInt(filters.plantId) : undefined,
          departmentId: filters.departmentId ? parseInt(filters.departmentId) : undefined
        }
      );

      if (response.success) {
        setAudits(response.data);
        setTotalCount(response.totalCount);
      } else {
        setError('Failed to load audits');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load audits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAudits();
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
    setPage(0);
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      plantId: '',
      departmentId: '',
      auditorId: ''
    });
    setPage(0);
  };

  const handleStartAudit = async (audit: Audit) => {
    try {
      const response = await AuditService.startAudit(audit.id);
      if (response.success) {
        await loadAudits();
        setActionDialog({ open: false, action: 'start', audit: null });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to start audit');
    }
  };

  const handleCompleteAudit = async (audit: Audit, score?: number, remarks?: string) => {
    try {
      const response = await AuditService.completeAudit(audit.id, score, remarks);
      if (response.success) {
        await loadAudits();
        setActionDialog({ open: false, action: 'complete', audit: null });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to complete audit');
    }
  };

  const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (status) {
      case 'AUDIT_PENDING': return 'warning';
      case 'AUDIT_IN_PROGRESS': return 'info';
      case 'AUDIT_COMPLETED': return 'success';
      case 'AUDIT_CLOSED': return 'default';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'AUDIT_PENDING': return 'Pending';
      case 'AUDIT_IN_PROGRESS': return 'In Progress';
      case 'AUDIT_COMPLETED': return 'Completed';
      case 'AUDIT_CLOSED': return 'Closed';
      default: return status;
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={loadAudits}>
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
          Safety Audits
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadAudits}
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
            disabled={audits.length === 0}
          >
            Export
          </Button>
          {onCreateAudit && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateAudit}
            >
              New Audit
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
                Total Audits
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
                Pending
              </Typography>
              <Typography variant="h4" color="warning.main">
                {audits.filter(a => a.status === 'AUDIT_PENDING').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                In Progress
              </Typography>
              <Typography variant="h4" color="info.main">
                {audits.filter(a => a.status === 'AUDIT_IN_PROGRESS').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Completed
              </Typography>
              <Typography variant="h4" color="success.main">
                {audits.filter(a => a.status === 'AUDIT_COMPLETED').length}
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
                <TableCell>Audit #</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Plant</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Auditor</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Scheduled Date</TableCell>
                <TableCell>Completed Date</TableCell>
                <TableCell>Score</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : audits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      No audits found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                audits.map((audit) => (
                  <TableRow key={audit.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {audit.auditNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {audit.auditType}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {(audit as any).plant?.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {(audit as any).plant?.code}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {(audit as any).department?.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {(audit as any).department?.code}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body2">
                            {(audit as any).auditor?.firstName} {(audit as any).auditor?.lastName}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {(audit as any).auditor?.employeeId}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getStatusLabel(audit.status)} 
                        color={getStatusColor(audit.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {format(new Date(audit.scheduledDate), 'MMM dd, yyyy')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {audit.completedDate ? (
                        <Typography variant="body2">
                          {format(new Date(audit.completedDate), 'MMM dd, yyyy')}
                        </Typography>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      {audit.score !== undefined && audit.score !== null ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {audit.score}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={audit.score}
                            sx={{ 
                              width: 60, 
                              height: 6, 
                              borderRadius: 3,
                              backgroundColor: 'grey.200',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: audit.score >= 80 ? '#4caf50' : audit.score >= 60 ? '#ff9800' : '#f44336'
                              }
                            }}
                          />
                        </Box>
                      ) : '-'}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {onViewAudit && (
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small" 
                              onClick={() => onViewAudit(audit)}
                              color="primary"
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {onEditAudit && (
                          <Tooltip title="Edit Audit">
                            <IconButton 
                              size="small" 
                              onClick={() => onEditAudit(audit)}
                              color="secondary"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {audit.status === 'AUDIT_PENDING' && (
                          <Tooltip title="Start Audit">
                            <IconButton 
                              size="small" 
                              color="success"
                              onClick={() => setActionDialog({ 
                                open: true, 
                                action: 'start', 
                                audit 
                              })}
                            >
                              <StartIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {audit.status === 'AUDIT_IN_PROGRESS' && (
                          <Tooltip title="Complete Audit">
                            <IconButton 
                              size="small" 
                              color="warning"
                              onClick={() => setActionDialog({ 
                                open: true, 
                                action: 'complete', 
                                audit,
                                score: audit.score || undefined,
                                remarks: audit.remarks || ''
                              })}
                            >
                              <CompleteIcon />
                            </IconButton>
                          </Tooltip>
                        )}
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
        <DialogTitle>Filter Audits</DialogTitle>
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
                  <MenuItem value="AUDIT_PENDING">Pending</MenuItem>
                  <MenuItem value="AUDIT_IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="AUDIT_COMPLETED">Completed</MenuItem>
                  <MenuItem value="AUDIT_CLOSED">Closed</MenuItem>
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department ID"
                value={filters.departmentId}
                onChange={(e) => handleFilterChange('departmentId', e.target.value)}
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Auditor ID"
                value={filters.auditorId}
                onChange={(e) => handleFilterChange('auditorId', e.target.value)}
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

      {/* Start/Complete Audit Dialog */}
      <Dialog 
        open={actionDialog.open} 
        onClose={() => setActionDialog({ open: false, action: 'start', audit: null })} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          {actionDialog.action === 'start' ? 'Start Audit' : 'Complete Audit'}
        </DialogTitle>
        <DialogContent>
          {actionDialog.audit && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                <strong>Audit:</strong> {actionDialog.audit.auditNumber}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Type:</strong> {actionDialog.audit.auditType}
              </Typography>
              
              {actionDialog.action === 'complete' && (
                <Box sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    label="Score (%)"
                    type="number"
                    inputProps={{ min: 0, max: 100 }}
                    value={actionDialog.score || ''}
                    onChange={(e) => setActionDialog(prev => ({
                      ...prev,
                      score: e.target.value ? parseFloat(e.target.value) : undefined
                    }))}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Remarks"
                    value={actionDialog.remarks || ''}
                    onChange={(e) => setActionDialog(prev => ({
                      ...prev,
                      remarks: e.target.value
                    }))}
                  />
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialog({ open: false, action: 'start', audit: null })}>
            Cancel
          </Button>
          <Button 
            onClick={() => {
              if (actionDialog.action === 'start' && actionDialog.audit) {
                handleStartAudit(actionDialog.audit);
              } else if (actionDialog.action === 'complete' && actionDialog.audit) {
                handleCompleteAudit(actionDialog.audit, actionDialog.score, actionDialog.remarks);
              }
            }}
            variant="contained"
            color={actionDialog.action === 'start' ? 'success' : 'warning'}
          >
            {actionDialog.action === 'start' ? 'Start Audit' : 'Complete Audit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AuditList;