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
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Visibility as ViewIcon,
  AccountTree as WorkflowIcon
} from '@mui/icons-material';

const workflowTypes = [
  'Incident Reporting',
  'Risk Assessment',
  'Audit Approval',
  'Training Request',
  'Document Review',
  'Change Management'
];

const workflowSteps = [
  'Initiate',
  'Review',
  'Approve',
  'Implement',
  'Verify',
  'Close'
];

const sampleWorkflows = [
  {
    id: 1,
    name: 'Incident Investigation Workflow',
    type: 'Incident Reporting',
    status: 'Active',
    steps: 5,
    created: '2025-01-15',
    lastModified: '2025-02-20'
  },
  {
    id: 2,
    name: 'Risk Assessment Approval',
    type: 'Risk Assessment',
    status: 'Draft',
    steps: 4,
    created: '2025-02-01',
    lastModified: '2025-02-28'
  },
  {
    id: 3,
    name: 'Safety Training Approval',
    type: 'Training Request',
    status: 'Active',
    steps: 3,
    created: '2025-01-20',
    lastModified: '2025-02-15'
  }
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Active': return 'success';
    case 'Draft': return 'warning';
    case 'Inactive': return 'error';
    default: return 'default';
  }
};

export default function WorkflowAdmin() {
  const [workflows, setWorkflows] = useState(sampleWorkflows);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDesigner, setOpenDesigner] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentWorkflow, setCurrentWorkflow] = useState(null);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    type: '',
    description: '',
    steps: []
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentStep, setCurrentStep] = useState(0);

  const handleAddWorkflow = () => {
    setEditMode(false);
    setNewWorkflow({ name: '', type: '', description: '', steps: [] });
    setOpenDialog(true);
  };

  const handleEditWorkflow = (workflow) => {
    setEditMode(true);
    setCurrentWorkflow(workflow);
    setNewWorkflow({
      name: workflow.name,
      type: workflow.type,
      description: workflow.description || '',
      steps: workflow.steps || []
    });
    setOpenDialog(true);
  };

  const handleDeleteWorkflow = (id) => {
    setWorkflows(workflows.filter(w => w.id !== id));
    showSnackbar('Workflow deleted successfully', 'success');
  };

  const handleSaveWorkflow = () => {
    if (!newWorkflow.name.trim() || !newWorkflow.type) {
      showSnackbar('Name and type are required', 'error');
      return;
    }

    if (editMode) {
      setWorkflows(workflows.map(w => 
        w.id === currentWorkflow.id 
          ? { ...w, ...newWorkflow, lastModified: new Date().toISOString().split('T')[0] }
          : w
      ));
      showSnackbar('Workflow updated successfully', 'success');
    } else {
      const newId = Math.max(...workflows.map(w => w.id)) + 1;
      setWorkflows([...workflows, {
        id: newId,
        ...newWorkflow,
        status: 'Draft',
        steps: newWorkflow.steps.length,
        created: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0]
      }]);
      showSnackbar('Workflow created successfully', 'success');
    }
    setOpenDialog(false);
  };

  const handleDesignWorkflow = (workflow) => {
    setCurrentWorkflow(workflow);
    setOpenDesigner(true);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ height: '100vh', p: 3 }}>
      <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Toolbar>
          <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
            Workflow Management
          </Typography>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={handleAddWorkflow}
          >
            Create Workflow
          </Button>
        </Toolbar>

        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          <Grid container spacing={3}>
            {/* Workflow Statistics */}
            <Grid size ={{xs:12}}>
              <Grid container spacing={2}>
                <Grid size ={{xs: 12, md:3}}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Total Workflows
                      </Typography>
                      <Typography variant="h4">
                        {workflows.length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size ={{xs: 12, md:3}}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Active Workflows
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        {workflows.filter(w => w.status === 'Active').length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size ={{xs: 12, md:3}}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Draft Workflows
                      </Typography>
                      <Typography variant="h4" color="warning.main">
                        {workflows.filter(w => w.status === 'Draft').length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size ={{xs: 12, md:3}}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Running Instances
                      </Typography>
                      <Typography variant="h4" color="info.main">
                        12
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            {/* Workflow Table */}
            <Grid size ={{xs:12}}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Steps</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Last Modified</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {workflows.map((workflow) => (
                      <TableRow key={workflow.id}>
                        <TableCell>{workflow.name}</TableCell>
                        <TableCell>{workflow.type}</TableCell>
                        <TableCell>
                          <Chip 
                            label={workflow.status}
                            color={getStatusColor(workflow.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{workflow.steps}</TableCell>
                        <TableCell>{workflow.created}</TableCell>
                        <TableCell>{workflow.lastModified}</TableCell>
                        <TableCell>
                          <IconButton 
                            onClick={() => handleDesignWorkflow(workflow)}
                            title="Design Workflow"
                          >
                            <WorkflowIcon />
                          </IconButton>
                          <IconButton onClick={() => handleEditWorkflow(workflow)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleDeleteWorkflow(workflow.id)}
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

      {/* Add/Edit Workflow Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? 'Edit Workflow' : 'Create New Workflow'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Workflow Name"
              value={newWorkflow.name}
              onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
              fullWidth
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Type</InputLabel>
              <Select
                value={newWorkflow.type}
                label="Type"
                onChange={(e) => setNewWorkflow({ ...newWorkflow, type: e.target.value })}
              >
                {workflowTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Description"
              value={newWorkflow.description}
              onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
              multiline
              rows={4}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveWorkflow} variant="contained">
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Workflow Designer Dialog */}
      <Dialog 
        open={openDesigner} 
        onClose={() => setOpenDesigner(false)} 
        maxWidth="lg" 
        fullWidth
        fullScreen
      >
        <DialogTitle>
          Workflow Designer - {currentWorkflow?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Workflow Steps
            </Typography>
            <Stepper activeStep={currentStep} alternativeLabel>
              {workflowSteps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography color="textSecondary">
                Workflow Designer Interface - Drag and drop steps to design your workflow
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDesigner(false)}>Close</Button>
          <Button variant="contained">Save Workflow</Button>
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