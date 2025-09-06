import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import ObservationService from '../services/ObservationService';
import {
  CreateObservationDto,
  ObservationType,
  Priority,
  ObservationFormData
} from '../types';

interface ObservationFormProps {
  onSave?: (observation: any) => void;
  onCancel?: () => void;
  open?: boolean;
}

const ObservationForm: React.FC<ObservationFormProps> = ({
  onSave,
  onCancel,
  open = false
}) => {
  // ✅ FIXED: Complete ObservationFormData with all required properties
  const [formData, setFormData] = useState<ObservationFormData>({
    title: '', // ✅ FIXED: Added title property
    description: '', // ✅ FIXED: Made required string
    observationType: ObservationType.GOOD_PRACTICE, // ✅ Use enum value from types.ts
    priority: Priority.MEDIUM, // ✅ FIXED: Use Priority enum
    location: '', // ✅ FIXED: Made required string
    reportedByUserId: 1, // ✅ FIXED: Added missing property
    assignedToUserId: undefined, // ✅ FIXED: Added missing property
    plantId: undefined,
    departmentId: undefined,
    dueDate: undefined
  });

  // ✅ FIXED: Mock priorities that match Priority enum structure
  const priorities = [
    { value: Priority.LOW, label: 'Low', color: '#4caf50' },
    { value: Priority.MEDIUM, label: 'Medium', color: '#ff9800' },
    { value: Priority.HIGH, label: 'High', color: '#f44336' }
  ];

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // ✅ FIXED: Create DTO with exact backend structure
      const createData: CreateObservationDto = {
        title: formData.title,
        description: formData.description,
        observationType: formData.observationType,
        priority: formData.priority, // ✅ Send Priority enum value
        location: formData.location,
        dueDate: formData.dueDate,
        reportedByUserId: formData.reportedByUserId,
        assignedToUserId: formData.assignedToUserId,
        plantId: formData.plantId,
        departmentId: formData.departmentId
      };

      const result = await ObservationService.createObservation(createData);
      
      if (onSave) {
        onSave(result);
      }

      // Reset form
      resetForm();
      
    } catch (error) {
      console.error('Error creating observation:', error);
      setErrors({ submit: 'Failed to create observation. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      observationType: ObservationType.GOOD_PRACTICE,
      priority: Priority.MEDIUM,
      location: '',
      reportedByUserId: 1,
      assignedToUserId: undefined,
      plantId: undefined,
      departmentId: undefined,
      dueDate: undefined
    });
    setErrors({});
  };

  const handleCancel = () => {
    resetForm();
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
      <DialogTitle>Create New Observation</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {errors.submit && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.submit}
            </Alert>
          )}
          
          <Grid container spacing={2}>
            {/* ✅ FIXED: Added Title field */}
            <Grid size ={{xs:12}}>
              <TextField
                fullWidth
                required
                name="title"
                label="Title *"
                value={formData.title}
                onChange={handleInputChange}
                error={!!errors.title}
                helperText={errors.title}
              />
            </Grid>

            <Grid size ={{xs:12}}>
              <TextField
                fullWidth
                required
                multiline
                rows={3}
                name="description"
                label="Description *"
                value={formData.description}
                onChange={handleInputChange}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>

            <Grid size ={{xs: 12, sm: 6}}>
              <FormControl fullWidth required>
                <InputLabel id="observation-type-label">Observation Type *</InputLabel>
                <Select
                  labelId="observation-type-label"
                  name="observationType"
                  value={formData.observationType}
                  label="Observation Type *"
                  onChange={handleSelectChange}
                >
                  <MenuItem value={ObservationType.UNSAFE_ACT}>Unsafe Act</MenuItem>
                  <MenuItem value={ObservationType.UNSAFE_CONDITION}>Unsafe Condition</MenuItem>
                  <MenuItem value={ObservationType.NEAR_MISS}>Near Miss</MenuItem>
                  <MenuItem value={ObservationType.GOOD_PRACTICE}>Good Practice</MenuItem>
                  <MenuItem value={ObservationType.WORK_STOPPAGE}>Work Stoppage</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size ={{xs: 12, sm: 6}}>
              <FormControl fullWidth required>
                <InputLabel id="priority-label">Priority *</InputLabel>
                <Select
                  labelId="priority-label"
                  name="priority"
                  value={formData.priority}
                  label="Priority *"
                  onChange={handleSelectChange}
                >
                  {priorities.map((priority) => (
                    <MenuItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size ={{xs: 12, sm: 6}}>
              <TextField
                fullWidth
                required
                name="location"
                label="Location *"
                value={formData.location}
                onChange={handleInputChange}
                error={!!errors.location}
                helperText={errors.location}
              />
            </Grid>

            <Grid size ={{xs: 12, sm: 6}}>
              <TextField
                fullWidth
                name="dueDate"
                label="Due Date"
                type="datetime-local"
                value={formData.dueDate || ''}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Observation'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ObservationForm;