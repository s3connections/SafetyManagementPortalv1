import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Button, Grid, TextField, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  FormControl, InputLabel, Select, MenuItem, Chip, Box, IconButton
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Visibility as ViewIcon } from '@mui/icons-material';

interface IncidentListProps {
  onCreateIncident?: () => void;
  onEditIncident?: (incidentId: string) => void;
  onViewIncident?: (incidentId: string) => void;
}

interface Incident {
  id: string;
  title: string;
  status: 'Open' | 'Under Investigation' | 'Closed';
  severity: 'High' | 'Medium' | 'Low';
  incidentDate: Date;
  reportedBy: string;
  department: string;
  injuryType?: string;
}

const IncidentList: React.FC<IncidentListProps> = ({ 
  onCreateIncident, onEditIncident, onViewIncident 
}) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    // Mock data
    const mockIncidents: Incident[] = [
      {
        id: '1',
        title: 'Slip and Fall Incident',
        status: 'Open',
        severity: 'Medium',
        incidentDate: new Date(),
        reportedBy: 'John Smith',
        department: 'Manufacturing'
      }
    ];
    setIncidents(mockIncidents);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'error';
      case 'Under Investigation': return 'warning';
      case 'Closed': return 'success';
      default: return 'default';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Incident Management</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={onCreateIncident}>
              Report Incident
            </Button>
          </Box>
          <Grid container spacing={2} alignItems="center">
            <Grid size ={{xs: 12, md:4}}>
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
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="Under Investigation">Under Investigation</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
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
                  <TableCell>Title</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Reporter</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {incidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell>{incident.title}</TableCell>
                    <TableCell>
                      <Chip label={incident.status} color={getStatusColor(incident.status) as any} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip label={incident.severity} color={getSeverityColor(incident.severity) as any} size="small" />
                    </TableCell>
                    <TableCell>{incident.incidentDate.toLocaleDateString()}</TableCell>
                    <TableCell>{incident.reportedBy}</TableCell>
                    <TableCell>{incident.department}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => onViewIncident?.(incident.id)}>
                        <ViewIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => onEditIncident?.(incident.id)}>
                        <EditIcon />
                      </IconButton>
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

export default IncidentList;