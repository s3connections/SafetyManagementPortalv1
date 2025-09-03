import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Toolbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Grid,
  FormControlLabel,
  Switch,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Assignment as ReportIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';

const incidentTypes = [
  'Near Miss',
  'Minor Injury',
  'Major Injury',
  'Property Damage',
  'Environmental',
  'Security Breach',
  'Equipment Failure',
  'Fire/Explosion',
  'Chemical Spill'
];

const severityLevels = [
  'Low',
  'Medium',
  'High',
  'Critical'
];

const incidentStatus = [
  'Reported',
  'Under Investigation',
  'Investigation Complete',
  'Corrective Actions Pending',
  'Closed'
];

const investigationSteps = [
  'Initial Report',
  'Investigation',
  'Root Cause Analysis',
  'Corrective Actions',
  'Verification',
  'Closure'
];

const sampleIncidents = [
  {
    id: 1,
    incidentNumber: 'INC-2025-001',
    title: 'Chemical Spill in Lab Area',
    type: 'Chemical Spill',
    severity: 'High',
    status: 'Under Investigation',
    reportedBy: 'John Smith',
    reportedDate: '2025-02-28',
    location: 'Laboratory A',
    description: 'Minor chemical spill occurred during experiment setup',
    injuries: false,
    currentStep: 2
  },
  {
    id: 2,
    incidentNumber: 'INC-2025-002',
    title: 'Equipment Malfunction',
    type: 'Equipment Failure',
    severity: 'Medium',
    status: 'Investigation Complete',
    reportedBy: 'Sarah Johnson',
    reportedDate: '2025-02-25',
    location: 'Production Floor B',
    description: 'Conveyor belt stopped unexpectedly causing production delay',
    injuries: false,
    currentStep: 4
  },
  {
    id: 3,
    incidentNumber: 'INC-2025-003',
    title: 'Worker Slip and Fall',
    type: 'Minor Injury',
    severity: 'Medium',
    status: 'Closed',
    reportedBy: 'Mike Davis',
    reportedDate: '2025-02-20',
    location: 'Warehouse C',
    description: 'Employee slipped on wet floor, minor bruising',
    injuries: true,
    currentStep: 5
  }
];

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'Critical': return 'error';
    case 'High': return 'warning';
    case 'Medium': return 'info';
    case 'Low': return 'success';
    default: return 'default';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Reported': return 'info';
    case 'Under Investigation': return 'warning';
    case 'Investigation Complete': return 'primary';
    case 'Corrective Actions Pending': return 'warning';
    case 'Closed': return 'success';
    default: return 'default';
  }
};

export default function IncidentReporting() {
  const [incidents, setIncidents] = useState(sampleIncidents);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentIncident, setCurrentIncident] = useState(null);
  const [newIncident, setNewIncident] = useState({
    title: '',
    type: '',
    severity: 'Low',
    location: '',
    description: '',
    reportedBy: '',
    injuries: false,
    immediateActions: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleAddIncident = () => {
    setEditMode(false);
    setNewIncident({
      title: '',
      type: '',
      severity: 'Low',
      location: '',
      description: '',
      reportedBy: '',
      injuries: false,
      immediateActions: ''
    });
    setOpenDialog(true);
  };

  const handleEditIncident = (incident) => {
    setEditMode(true);
    setCurrentIncident(incident);
    setNewIncident({
      title: incident.title,
      type: incident.type,
      severity: incident.severity,
      location: incident.location,
      description: incident.description,
      reportedBy: incident.reportedBy,
      injuries: incident.injuries,
      immediateActions: incident.immediateActions || ''
    });
    setOpenDialog(true);
  };

  const handleViewIncident = (incident) => {
    setCurrentIncident(incident);
    setOpenViewDialog(true);
  };

  const handleDeleteIncident = (id) => {
    setIncidents(incidents.filter(i => i.id !== id));
    showSnackbar('Incident deleted successfully', 'success');
  };

  const handleSaveIncident = () => {
    if (!newIncident.title.trim() || !newIncident.type) {
      showSnackbar('Title and type are required', 'error');
      return;
    }

    if (editMode) {
      setIncidents(incidents.map(i => 
        i.id === currentIncident.id 
          ? { ...i, ...newIncident }
          : i
      ));
      showSnackbar('Incident updated successfully', 'success');
    } else {
      const newId = Math.max(...incidents.map(i => i.id)) + 1;
      const incidentNumber = `INC-2025-${String(newId).padStart(3, '0')}`;
      setIncidents([...incidents, {
        id: newId,
        incidentNumber,
        ...newIncident,
        status: 'Reported',
        reportedDate: new Date().toISOString().split('T')[0],
        currentStep: 0
      }]);
      showSnackbar('Incident reported successfully', 'success');
    }
    setOpenDialog(false);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getIncidentStatistics = () => {
    return {
      total: incidents.length,
      open: incidents.filter(i => i.status !== 'Closed').length,
      withInjuries: incidents.filter(i => i.injuries).length,
      critical: incidents.filter(i => i.severity === 'Critical').length,
      thisMonth: incidents.filter(i => 
        new Date(i.reportedDate).getMonth() === new Date().getMonth()
      ).length
    };
  };

  const stats = getIncidentStatistics();

  return (
    <Box sx={{ height: '100vh', p: 3 }}>
      <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Toolbar>
          <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
            Incident Reporting
          </Typography>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={handleAddIncident}
          >
            Report Incident
          </Button>
        </Toolbar>

        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          <Grid container spacing={3}>
            {/* Incident Statistics */}
            <Grid size ={{xs:12}}>
              <Grid container spacing={2}>
                <Grid size ={{xs: 12, md:2.4}}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Total Incidents
                      </Typography>
                      <Typography variant="h4">
                        {stats.total}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size ={{xs: 12, md:2.4}}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Open Incidents
                      </Typography>
                      <Typography variant="h4" color="warning.main">
                        {stats.open}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size ={{xs: 12, md:2.4}}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        With Injuries
                      </Typography>
                      <Typography variant="h4" color="error.main">
                        {stats.withInjuries}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size ={{xs: 12, md:2.4}}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Critical Incidents
                      </Typography>
                      <Typography variant="h4" color="error.main">
                        {stats.critical}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size ={{xs: 12, md:2.4}}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        This Month
                      </Typography>
                      <Typography variant="h4" color="info.main">
                        {stats.thisMonth}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            {/* Incident Table */}
            <Grid size ={{xs:12}}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Incident #</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Severity</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Reported Date</TableCell>
                      <TableCell>Injuries</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {incidents.map((incident) => (
                      <TableRow key={incident.id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {incident.incidentNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {incident.title}
                          </Typography>
                        </TableCell>
                        <TableCell>{incident.type}</TableCell>
                        <TableCell>
                          <Chip 
                            label={incident.severity}
                            color={getSeverityColor(incident.severity)}
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
                        <TableCell>{incident.location}</TableCell>
                        <TableCell>{incident.reportedDate}</TableCell>
                        <TableCell>
                          {incident.injuries ? (
                            <Chip label="Yes" color="error" size="small" />
                          ) : (
                            <Chip label="No" color="success" size="small" />
                          )}
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleViewIncident(incident)}>
                            <ViewIcon />
                          </IconButton>
                          <IconButton onClick={() => handleEditIncident(incident)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleDeleteIncident(incident.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Add/Edit Incident Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? 'Edit Incident' : 'Report New Incident'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Incident Title"
              value={newIncident.title}
              onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
              fullWidth
              required
            />
            
            <Grid container spacing={2}>
              <Grid size ={{xs:6}}>
                <FormControl fullWidth required>
                  <InputLabel>Incident Type</InputLabel>
                  <Select
                    value={newIncident.type}
                    label="Incident Type"
                    onChange={(e) => setNewIncident({ ...newIncident, type: e.target.value })}
                  >
                    {incidentTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size ={{xs:6}}>
                <FormControl fullWidth>
                  <InputLabel>Severity</InputLabel>
                  <Select
                    value={newIncident.severity}
                    label="Severity"
                    onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value })}
                  >
                    {severityLevels.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid size ={{xs:6}}>
                <TextField
                  label="Location"
                  value={newIncident.location}
                  onChange={(e) => setNewIncident({ ...newIncident, location: e.target.value })}
                  fullWidth
                />
              </Grid>
              <Grid size ={{xs:6}}>
                <TextField
                  label="Reported By"
                  value={newIncident.reportedBy}
                  onChange={(e) => setNewIncident({ ...newIncident, reportedBy: e.target.value })}
                  fullWidth
                />
              </Grid>
            </Grid>

            <TextField
              label="Description"
              value={newIncident.description}
              onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
              multiline
              rows={4}
              fullWidth
              required
            />

            <TextField
              label="Immediate Actions Taken"
              value={newIncident.immediateActions}
              onChange={(e) => setNewIncident({ ...newIncident, immediateActions: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />

            <FormControlLabel
              control={
                <Switch
                  checked={newIncident.injuries}
                  onChange={(e) => setNewIncident({ ...newIncident, injuries: e.target.checked })}
                />
              }
              label="Injuries Involved"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveIncident} variant="contained">
            {editMode ? 'Update' : 'Report'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Incident Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Incident Details - {currentIncident?.incidentNumber}
        </DialogTitle>
        <DialogContent>
          {currentIncident && (
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid size ={{xs:12}}>
                  <Typography variant="h6" gutterBottom>
                    {currentIncident.title}
                  </Typography>
                </Grid>
                
                <Grid size ={{xs:6}}>
                  <Typography variant="body2" color="textSecondary">Type:</Typography>
                  <Typography variant="body1">{currentIncident.type}</Typography>
                </Grid>
                
                <Grid size ={{xs:6}}>
                  <Typography variant="body2" color="textSecondary">Severity:</Typography>
                  <Chip 
                    label={currentIncident.severity}
                    color={getSeverityColor(currentIncident.severity)}
                    size="small"
                  />
                </Grid>

                <Grid size ={{xs:12}}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Investigation Progress:
                  </Typography>
                  <Stepper activeStep={currentIncident.currentStep} alternativeLabel>
                    {investigationSteps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Grid>

                <Grid size ={{xs:12}}>
                  <Typography variant="body2" color="textSecondary">Description:</Typography>
                  <Typography variant="body1">{currentIncident.description}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}