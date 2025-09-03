import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Button, Grid, TextField, FormControl,
  InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent,
  DialogActions, Box, Checkbox, FormControlLabel, Divider
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon, Send as SubmitIcon } from '@mui/icons-material';

interface PermitFormProps {
  permitId?: string;
  open: boolean;
  onClose: () => void;
  onSave: (permitData: PermitData) => void;
}

interface PermitData {
  title: string;
  permitType: string;
  description: string;
  workLocation: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  requestedBy: string;
  department: string;
  contractorCompany?: string;
  workCrew: string;
  hazards: string[];
  safetyMeasures: string;
  equipmentRequired: string;
  emergencyContacts: string;
  specialInstructions?: string;
}

const PermitForm: React.FC<PermitFormProps> = ({ permitId, open, onClose, onSave }) => {
  const [formData, setFormData] = useState<PermitData>({
    title: '', permitType: '', description: '', workLocation: '',
    startDate: '', endDate: '', startTime: '', endTime: '',
    requestedBy: '', department: '', workCrew: '', hazards: [],
    safetyMeasures: '', equipmentRequired: '', emergencyContacts: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const hazardOptions = [
    'Fire/Explosion Risk', 'Chemical Exposure', 'Electrical Hazard', 
    'Fall from Height', 'Confined Space', 'Moving Machinery', 
    'Hot Surfaces', 'Noise Exposure', 'Radiation'
  ];

  const handleInputChange = (field: keyof PermitData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleHazardChange = (hazard: string, checked: boolean) => {
    const currentHazards = formData.hazards;
    if (checked) {
      handleInputChange('hazards', [...currentHazards, hazard]);
    } else {
      handleInputChange('hazards', currentHazards.filter(h => h !== hazard));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.permitType) newErrors.permitType = 'Permit type is required';
    if (!formData.workLocation.trim()) newErrors.workLocation = 'Work location is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    
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
      <DialogTitle>{permitId ? 'Edit Work Permit' : 'Create New Work Permit'}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid size ={{xs:12}}>
              <Typography variant="h6" gutterBottom>Basic Information</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid size ={{xs:12}}>
              <TextField
                fullWidth label="Work Permit Title" required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                error={!!errors.title} helperText={errors.title}
              />
            </Grid>
            
            <Grid size ={{xs: 12, md:6}}>
              <FormControl fullWidth error={!!errors.permitType}>
                <InputLabel>Permit Type</InputLabel>
                <Select
                  value={formData.permitType} label="Permit Type"
                  onChange={(e) => handleInputChange('permitType', e.target.value)}
                >
                  <MenuItem value="Hot Work">Hot Work</MenuItem>
                  <MenuItem value="Confined Space">Confined Space Entry</MenuItem>
                  <MenuItem value="Working at Height">Working at Height</MenuItem>
                  <MenuItem value="Electrical">Electrical Work</MenuItem>
                  <MenuItem value="Excavation">Excavation</MenuItem>
                  <MenuItem value="Chemical">Chemical Handling</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size ={{xs: 12, md:6}}>
              <TextField
                fullWidth label="Work Location" required
                value={formData.workLocation}
                onChange={(e) => handleInputChange('workLocation', e.target.value)}
                error={!!errors.workLocation} helperText={errors.workLocation}
              />
            </Grid>

            <Grid size ={{xs:12}}>
              <TextField
                fullWidth label="Work Description" multiline rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </Grid>

            {/* Schedule */}
            <Grid size ={{xs:12}}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Schedule</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid size ={{xs: 12, md:3}}>
              <TextField
                fullWidth label="Start Date" type="date" required
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                error={!!errors.startDate} helperText={errors.startDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid size ={{xs: 12, md:3}}>
              <TextField
                fullWidth label="End Date" type="date" required
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                error={!!errors.endDate} helperText={errors.endDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid size ={{xs: 12, md:3}}>
              <TextField
                fullWidth label="Start Time" type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid size ={{xs: 12, md:3}}>
              <TextField
                fullWidth label="End Time" type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Personnel */}
            <Grid size ={{xs:12}}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Personnel Information</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid size ={{xs: 12, md:6}}>
              <TextField
                fullWidth label="Requested By"
                value={formData.requestedBy}
                onChange={(e) => handleInputChange('requestedBy', e.target.value)}
              />
            </Grid>

            <Grid size ={{xs: 12, md:6}}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={formData.department} label="Department"
                  onChange={(e) => handleInputChange('department', e.target.value)}
                >
                  <MenuItem value="Maintenance">Maintenance</MenuItem>
                  <MenuItem value="Operations">Operations</MenuItem>
                  <MenuItem value="Engineering">Engineering</MenuItem>
                  <MenuItem value="Utilities">Utilities</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size ={{xs: 12, md:6}}>
              <TextField
                fullWidth label="Contractor Company (if applicable)"
                value={formData.contractorCompany}
                onChange={(e) => handleInputChange('contractorCompany', e.target.value)}
              />
            </Grid>

            <Grid size ={{xs: 12, md:6}}>
              <TextField
                fullWidth label="Work Crew Members"
                value={formData.workCrew}
                onChange={(e) => handleInputChange('workCrew', e.target.value)}
              />
            </Grid>

            {/* Safety Information */}
            <Grid size ={{xs:12}}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Safety Information</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid size ={{xs:12}}>
              <Typography variant="subtitle2" gutterBottom>Identified Hazards:</Typography>
              <Grid container>
                {hazardOptions.map((hazard) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={hazard}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.hazards.includes(hazard)}
                          onChange={(e) => handleHazardChange(hazard, e.target.checked)}
                        />
                      }
                      label={hazard}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid size ={{xs:12}}>
              <TextField
                fullWidth label="Safety Measures & Precautions" multiline rows={4}
                value={formData.safetyMeasures}
                onChange={(e) => handleInputChange('safetyMeasures', e.target.value)}
              />
            </Grid>

            <Grid size ={{xs: 12, md:6}}>
              <TextField
                fullWidth label="Required Equipment/PPE" multiline rows={3}
                value={formData.equipmentRequired}
                onChange={(e) => handleInputChange('equipmentRequired', e.target.value)}
              />
            </Grid>

            <Grid size ={{xs: 12, md:6}}>
              <TextField
                fullWidth label="Emergency Contacts" multiline rows={3}
                value={formData.emergencyContacts}
                onChange={(e) => handleInputChange('emergencyContacts', e.target.value)}
              />
            </Grid>

            <Grid size ={{xs:12}}>
              <TextField
                fullWidth label="Special Instructions" multiline rows={2}
                value={formData.specialInstructions}
                onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} startIcon={<CancelIcon />}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" startIcon={<SaveIcon />}>
          Save as Draft
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" startIcon={<SubmitIcon />}>
          Submit for Approval
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PermitForm;