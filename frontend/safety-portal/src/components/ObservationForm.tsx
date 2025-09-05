import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Stack,
  Divider,
  FormHelperText
} from '@mui/material';
import {
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { SelectChangeEvent } from '@mui/material/Select';
import ObservationService from '../services/ObservationService';
import { CreateObservationDto, ObservationType, Priority, ObservationFormData } from '../types';

interface ObservationFormProps {
  onSave?: (observation: any) => void;
  onCancel?: () => void;
  initialData?: Partial<ObservationFormData>;
  mode?: 'create' | 'edit';
}

const ObservationForm: React.FC<ObservationFormProps> = ({
  onSave,
  onCancel,
  initialData,
  mode = 'create'
}) => {
  // ✅ FIXED: Form state matches backend exactly
  const [formData, setFormData] = useState<ObservationFormData>({
    title: '',
    description: '',
    observationType: 'UnsafeAct', // ✅ FIXED: Use backend enum values
    priority: 'Low',
    location: '',
    reportedByUserId: 1, // ✅ FIXED: Use proper property name and default user
    assignedToUserId: undefined,
    plantId: undefined,
    departmentId: undefined,
    dueDate: '',
    ...initialData
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ FIXED: File handling corrected
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // ✅ FIXED: Get first file from FileList
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, JPG, PNG, or GIF)');
        return;
      }

      if (file.size > maxSize) {
        setError('File size must be less than 5MB');
        return;
      }

      setImageFile(file);
      setError(null);
    }
  };

  // Handle text field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle select changes
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.observationType) {
      newErrors.observationType = 'Observation type is required';
    }

    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ FIXED: Form submission with correct types
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // ✅ FIXED: Create DTO with exact backend structure
      const createData: CreateObservationDto = {
        title: formData.title,
        description: formData.description,
        observationType: formData.observationType,
        priority: formData.priority,
        location: formData.location || undefined,
        dueDate: formData.dueDate || undefined,
        reportedByUserId: formData.reportedByUserId,
        assignedToUserId: formData.assignedToUserId,
        plantId: formData.plantId,
        departmentId: formData.departmentId
      };
      
      // ✅ FIXED: Now types match exactly
      const response = await ObservationService.createObservation(createData, imageFile || undefined);
      
      if (response.success && response.data) {
        setSuccess(`Observation created successfully! Ticket: ${response.data.ticketNumber}`);
        onSave?.(response.data);
        
        if (mode === 'create') {
          handleReset();
        }
      } else {
        throw new Error(response.error || 'Failed to create observation');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create observation');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      observationType: 'UnsafeAct',
      priority: 'Low',
      location: '',
      reportedByUserId: 1,
      assignedToUserId: undefined,
      plantId: undefined,
      departmentId: undefined,
      dueDate: ''
    });
    setImageFile(null);
    setError(null);
    setSuccess(null);
    setErrors({});
  };

  const handleRemoveImage = () => {
    setImageFile(null);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {mode === 'create' ? 'Report Safety Observation' : 'Edit Safety Observation'}
          </Typography>
          
          <Divider sx={{ mb: 3 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
              {success}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Title */}
            <Grid size ={{xs:12}}>
              <TextField
                fullWidth
                name="title"
                label="Title *"
                value={formData.title}
                onChange={handleInputChange}
                error={!!errors.title}
                helperText={errors.title}
                placeholder="Enter observation title"
              />
            </Grid>

            {/* Observation Type */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth error={!!errors.observationType}>
                <InputLabel id="observation-type-label">Observation Type *</InputLabel>
                <Select
                  labelId="observation-type-label"
                  name="observationType"
                  value={formData.observationType}
                  label="Observation Type *"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="UnsafeAct">Unsafe Act</MenuItem>
                  <MenuItem value="UnsafeCondition">Unsafe Condition</MenuItem>
                  <MenuItem value="NearMiss">Near Miss</MenuItem>
                  <MenuItem value="GoodPractice">Good Practice</MenuItem>
                </Select>
                {errors.observationType && (
                  <FormHelperText>{errors.observationType}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Priority */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth error={!!errors.priority}>
                <InputLabel id="priority-label">Priority *</InputLabel>
                <Select
                  labelId="priority-label"
                  name="priority"
                  value={formData.priority}
                  label="Priority *"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Critical">Critical</MenuItem>
                </Select>
                {errors.priority && (
                  <FormHelperText>{errors.priority}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Location */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="location"
                label="Location *"
                value={formData.location}
                onChange={handleInputChange}
                error={!!errors.location}
                helperText={errors.location}
                placeholder="Enter location where observation was made"
              />
            </Grid>

            {/* Due Date */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="dueDate"
                label="Due Date"
                type="datetime-local"
                value={formData.dueDate}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* Description */}
            <Grid size ={{xs:12}}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="description"
                label="Description *"
                value={formData.description}
                onChange={handleInputChange}
                error={!!errors.description}
                helperText={errors.description}
                placeholder="Provide detailed description of the observation"
              />
            </Grid>

            {/* File Upload */}
            <Grid size ={{xs:12}}>
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Attach Image (Optional)
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<PhotoCameraIcon />}
                    disabled={loading}
                  >
                    Upload Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                  
                  {imageFile && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {imageFile.name}
                      </Typography>
                      <Button
                        size="small"
                        color="error"
                        onClick={handleRemoveImage}
                        startIcon={<ClearIcon />}
                      >
                        Remove
                      </Button>
                    </Box>
                  )}
                </Stack>
              </Box>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            {onCancel && (
              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            )}
            
            <Button
              variant="outlined"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={loading}
            >
              {loading ? 'Saving...' : (mode === 'create' ? 'Create Observation' : 'Update Observation')}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ObservationForm;