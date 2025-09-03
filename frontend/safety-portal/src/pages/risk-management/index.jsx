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
  Rating,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const riskCategories = [
  'Operational',
  'Environmental',
  'Safety',
  'Security',
  'Financial',
  'Reputational',
  'Compliance',
  'Strategic'
];

const riskStatus = [
  'Open',
  'In Progress',
  'Resolved',
  'Closed'
];

const sampleRisks = [
  {
    id: 1,
    title: 'Chemical Storage Safety Risk',
    category: 'Safety',
    description: 'Improper storage of hazardous chemicals may lead to accidents',
    probability: 3,
    impact: 4,
    riskScore: 12,
    status: 'Open',
    owner: 'John Smith',
    created: '2025-01-15',
    dueDate: '2025-03-15',
    mitigationPlan: 'Install proper ventilation and storage systems'
  },
  {
    id: 2,
    title: 'Equipment Failure Risk',
    category: 'Operational',
    description: 'Critical equipment may fail due to age and wear',
    probability: 4,
    impact: 3,
    riskScore: 12,
    status: 'In Progress',
    owner: 'Sarah Johnson',
    created: '2025-01-20',
    dueDate: '2025-04-20',
    mitigationPlan: 'Implement preventive maintenance schedule'
  },
  {
    id: 3,
    title: 'Data Security Breach',
    category: 'Security',
    description: 'Potential unauthorized access to sensitive data',
    probability: 2,
    impact: 5,
    riskScore: 10,
    status: 'Resolved',
    owner: 'Mike Davis',
    created: '2025-02-01',
    dueDate: '2025-03-01',
    mitigationPlan: 'Enhanced security protocols implemented'
  }
];

const getRiskColor = (score) => {
  if (score >= 15) return 'error';
  if (score >= 10) return 'warning';
  if (score >= 5) return 'info';
  return 'success';
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Open': return 'error';
    case 'In Progress': return 'warning';
    case 'Resolved': return 'info';
    case 'Closed': return 'success';
    default: return 'default';
  }
};

export default function RiskManagement() {
  const [risks, setRisks] = useState(sampleRisks);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRisk, setCurrentRisk] = useState(null);
  const [newRisk, setNewRisk] = useState({
    title: '',
    category: '',
    description: '',
    probability: 1,
    impact: 1,
    owner: '',
    dueDate: '',
    mitigationPlan: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const calculateRiskScore = (probability, impact) => probability * impact;

  const handleAddRisk = () => {
    setEditMode(false);
    setNewRisk({
      title: '',
      category: '',
      description: '',
      probability: 1,
      impact: 1,
      owner: '',
      dueDate: '',
      mitigationPlan: ''
    });
    setOpenDialog(true);
  };

  const handleEditRisk = (risk) => {
    setEditMode(true);
    setCurrentRisk(risk);
    setNewRisk({
      title: risk.title,
      category: risk.category,
      description: risk.description,
      probability: risk.probability,
      impact: risk.impact,
      owner: risk.owner,
      dueDate: risk.dueDate,
      mitigationPlan: risk.mitigationPlan
    });
    setOpenDialog(true);
  };

  const handleDeleteRisk = (id) => {
    setRisks(risks.filter(r => r.id !== id));
    showSnackbar('Risk deleted successfully', 'success');
  };

  const handleSaveRisk = () => {
    if (!newRisk.title.trim() || !newRisk.category) {
      showSnackbar('Title and category are required', 'error');
      return;
    }

    const riskScore = calculateRiskScore(newRisk.probability, newRisk.impact);

    if (editMode) {
      setRisks(risks.map(r => 
        r.id === currentRisk.id 
          ? { ...r, ...newRisk, riskScore, status: 'Open' }
          : r
      ));
      showSnackbar('Risk updated successfully', 'success');
    } else {
      const newId = Math.max(...risks.map(r => r.id)) + 1;
      setRisks([...risks, {
        id: newId,
        ...newRisk,
        riskScore,
        status: 'Open',
        created: new Date().toISOString().split('T')[0]
      }]);
      showSnackbar('Risk created successfully', 'success');
    }
    setOpenDialog(false);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getRiskStatistics = () => {
    return {
      total: risks.length,
      high: risks.filter(r => r.riskScore >= 15).length,
      medium: risks.filter(r => r.riskScore >= 10 && r.riskScore < 15).length,
      low: risks.filter(r => r.riskScore < 10).length,
      open: risks.filter(r => r.status === 'Open').length
    };
  };

  const stats = getRiskStatistics();

  return (
    <Box sx={{ height: '100vh', p: 3 }}>
      <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Toolbar>
          <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
            Risk Management
          </Typography>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={handleAddRisk}
          >
            Add Risk
          </Button>
        </Toolbar>

        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          <Grid container spacing={3}>
            {/* Risk Statistics */}
            <Grid size ={{xs:12}}>
              <Grid container spacing={2}>
                <Grid size ={{xs: 12, md:2.4}}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Total Risks
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
                        High Risk
                      </Typography>
                      <Typography variant="h4" color="error.main">
                        {stats.high}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size ={{xs: 12, md:2.4}}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Medium Risk
                      </Typography>
                      <Typography variant="h4" color="warning.main">
                        {stats.medium}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size ={{xs: 12, md:2.4}}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Low Risk
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        {stats.low}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size ={{xs: 12, md:2.4}}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Open Risks
                      </Typography>
                      <Typography variant="h4" color="info.main">
                        {stats.open}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            {/* Risk Table */}
            <Grid size ={{xs:12}}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Risk Score</TableCell>
                      <TableCell>Probability</TableCell>
                      <TableCell>Impact</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Owner</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {risks.map((risk) => (
                      <TableRow key={risk.id}>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {risk.title}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {risk.description.substring(0, 50)}...
                          </Typography>
                        </TableCell>
                        <TableCell>{risk.category}</TableCell>
                        <TableCell>
                          <Chip 
                            label={risk.riskScore}
                            color={getRiskColor(risk.riskScore)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Rating value={risk.probability} max={5} size="small" readOnly />
                        </TableCell>
                        <TableCell>
                          <Rating value={risk.impact} max={5} size="small" readOnly />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={risk.status}
                            color={getStatusColor(risk.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{risk.owner}</TableCell>
                        <TableCell>{risk.dueDate}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEditRisk(risk)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleDeleteRisk(risk.id)}
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

      {/* Add/Edit Risk Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? 'Edit Risk' : 'Add New Risk'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Risk Title"
              value={newRisk.title}
              onChange={(e) => setNewRisk({ ...newRisk, title: e.target.value })}
              fullWidth
              required
            />
            
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={newRisk.category}
                label="Category"
                onChange={(e) => setNewRisk({ ...newRisk, category: e.target.value })}
              >
                {riskCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Description"
              value={newRisk.description}
              onChange={(e) => setNewRisk({ ...newRisk, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />

            <Grid container spacing={2}>
              <Grid size ={{xs:6}}>
                <Typography component="legend">Probability (1-5)</Typography>
                <Rating
                  value={newRisk.probability}
                  onChange={(event, newValue) => setNewRisk({ ...newRisk, probability: newValue })}
                  max={5}
                />
              </Grid>
              <Grid size ={{xs:6}}>
                <Typography component="legend">Impact (1-5)</Typography>
                <Rating
                  value={newRisk.impact}
                  onChange={(event, newValue) => setNewRisk({ ...newRisk, impact: newValue })}
                  max={5}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid size ={{xs:6}}>
                <TextField
                  label="Risk Owner"
                  value={newRisk.owner}
                  onChange={(e) => setNewRisk({ ...newRisk, owner: e.target.value })}
                  fullWidth
                />
              </Grid>
              <Grid size ={{xs:6}}>
                <TextField
                  label="Due Date"
                  type="date"
                  value={newRisk.dueDate}
                  onChange={(e) => setNewRisk({ ...newRisk, dueDate: e.target.value })}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <TextField
              label="Mitigation Plan"
              value={newRisk.mitigationPlan}
              onChange={(e) => setNewRisk({ ...newRisk, mitigationPlan: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />

            {(newRisk.probability && newRisk.impact) && (
              <Alert severity={getRiskColor(calculateRiskScore(newRisk.probability, newRisk.impact))}>
                Risk Score: {calculateRiskScore(newRisk.probability, newRisk.impact)} 
                ({calculateRiskScore(newRisk.probability, newRisk.impact) >= 15 ? 'High' : 
                  calculateRiskScore(newRisk.probability, newRisk.impact) >= 10 ? 'Medium' : 'Low'} Risk)
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveRisk} variant="contained">
            {editMode ? 'Update' : 'Create'}
          </Button>
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