import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Button, Grid, TextField, FormControl,
  InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent,
  DialogActions, Box, Checkbox, FormControlLabel
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';

interface IncidentFormProps {
  incidentId?: string;
  open: boolean;
  onClose: () => void;
  onSave: (incidentData: IncidentData) => void;
}

interface IncidentData {
  title: string;
  description: string;
  incidentType: string;
  severity: string;
  incidentDate: string;
  location: string;
  reportedBy: string;
  departmentId: string;
  witnesses: string;
  injuryDetails?: string;
  immediateActions: string;
}

const IncidentForm: React.FC<IncidentFormProps> = ({ incidentId, open, onClose, onSave }) => {
  const [formData, setFormData] = useState<IncidentData>({
    title: '', description: '', incidentType: '', severity: '',
    incidentDate: '', location: '', reportedBy: '', departmentId: '',
    witnesses: '', immediateActions: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof IncidentData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.incidentType) newErrors.incidentType = 'Incident type is required';
    if (!formData.severity) newErrors.severity = 'Severity is required';
    if (!formData.incidentDate) newErrors.incidentDate = 'Incident date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{incidentId ? 'Edit Incident' : 'Report New Incident'}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid size ={{xs:12}}>
              <TextField
                fullWidth label="Incident Title" required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                error={!!errors.title} helperText={errors.title}
              />
            </Grid>
            <Grid size ={{xs: 12, md:6}}>
              <FormControl fullWidth error={!!errors.incidentType}>
                <InputLabel>Incident Type</InputLabel>
                <Select
                  value={formData.incidentType} label="Incident Type"
                  onChange={(e) => handleInputChange('incidentType', e.target.value)}
                >
                  <MenuItem value="Injury">Personal Injury</MenuItem>
                  <MenuItem value="Near Miss">Near Miss</MenuItem>
                  <MenuItem value="Property Damage">Property Damage</MenuItem>
                  <MenuItem value="Environmental">Environmental</MenuItem>
                  <MenuItem value="Security">Security Incident</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size ={{xs: 12, md:6}}>
              <FormControl fullWidth error={!!errors.severity}>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={formData.severity} label="Severity"
                  onChange={(e) => handleInputChange('severity', e.target.value)}
                >
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size ={{xs: 12, md:6}}>
              <TextField
                fullWidth label="Incident Date & Time" type="datetime-local" required
                value={formData.incidentDate}
                onChange={(e) => handleInputChange('incidentDate', e.target.value)}
                error={!!errors.incidentDate} helperText={errors.incidentDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size ={{xs: 12, md:6}}>
              <TextField
                fullWidth label="Location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </Grid>
            <Grid size ={{xs:12}}>
              <TextField
                fullWidth label="Description" multiline rows={4} required
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </Grid>
            <Grid size ={{xs: 12, md:6}}>
              <TextField
                fullWidth label="Reported By"
                value={formData.reportedBy}
                onChange={(e) => handleInputChange('reportedBy', e.target.value)}
              />
            </Grid>
            <Grid size ={{xs: 12, md:6}}>
              <TextField
                fullWidth label="Witnesses"
                value={formData.witnesses}
                onChange={(e) => handleInputChange('witnesses', e.target.value)}
              />
            </Grid>
            <Grid size ={{xs:12}}>
              <TextField
                fullWidth label="Immediate Actions Taken" multiline rows={3}
                value={formData.immediateActions}
                onChange={(e) => handleInputChange('immediateActions', e.target.value)}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} startIcon={<CancelIcon />}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" startIcon={<SaveIcon />}>
          {incidentId ? 'Update' : 'Report'} Incident
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IncidentForm;