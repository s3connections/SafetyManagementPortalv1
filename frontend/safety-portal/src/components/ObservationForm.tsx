import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Alert,
  Chip,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { ObservationType, Priority, Plant, Department, User, Observation, ObservationFormData, HazardType } from '../types';
import ObservationService from '../services/ObservationService';

interface ObservationFormProps {
  observation?: Observation;
  onSave?: (observation: Observation) => void;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
}

const ObservationForm: React.FC<ObservationFormProps> = ({
  observation,
  onSave,
  onCancel,
  mode = 'create'
}) => {
  // Form state
  const [formData, setFormData] = useState<ObservationFormData>({
    observationType: undefined,
    priority: undefined,
    description: '',
    location: '',
    plantId: undefined,
    departmentId: undefined,
    hazardType: '',
    assignedTo: undefined
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Mock data - in real app, these would come from API
  const [plants] = useState<Plant[]>([
    { 
      id: 1, 
      name: 'Manufacturing Plant A', 
      code: 'MPA', 
      location: 'Mumbai, Maharashtra', 
      isActive: true,
      createdAt: '',
      updatedAt: '',
      description: ''
    },
    { 
      id: 2, 
      name: 'Chemical Processing Plant B', 
      code: 'CPB', 
      location: 'Pune, Maharashtra', 
      isActive: true,
      createdAt: '',
      updatedAt: '',
      description: ''
    }
  ]);

  const [departments] = useState<Department[]>([
    { id: 1, name: 'Production', code: 'PROD', plantId: 1, isActive: true, createdAt: '', updatedAt: '', description: '' },
    { id: 2, name: 'Maintenance', code: 'MAINT', plantId: 1, isActive: true, createdAt: '', updatedAt: '', description: '' },
    { id: 3, name: 'Quality Control', code: 'QC', plantId: 1, isActive: true, createdAt: '', updatedAt: '', description: '' },
    { id: 4, name: 'Safety', code: 'SAFETY', plantId: 1, isActive: true, createdAt: '', updatedAt: '', description: '' },
    { id: 5, name: 'Chemical Processing', code: 'CHEM', plantId: 2, isActive: true, createdAt: '', updatedAt: '', description: '' },
    { id: 6, name: 'Laboratory', code: 'LAB', plantId: 2, isActive: true, createdAt: '', updatedAt: '', description: '' }
  ]);

  const [users] = useState<User[]>([
    { 
      id: 1, 
      employeeId: 'EMP001', 
      firstName: 'John', 
      lastName: 'Doe', 
      email: 'john.doe@company.com', 
      userType: 'Employee' as any, 
      isActive: true, 
      createdAt: '', 
      updatedAt: '' 
    },
    { 
      id: 2, 
      employeeId: 'EMP002', 
      firstName: 'Jane', 
      lastName: 'Smith', 
      email: 'jane.smith@company.com', 
      userType: 'Responsible_Engineer' as any, 
      isActive: true, 
      createdAt: '', 
      updatedAt: '' 
    }
  ]);

  const hazardTypes = [
    'Slip/Trip/Fall',
    'Chemical Exposure',
    'Electrical Hazard',
    'Fire/Explosion Risk',
    'Mechanical Hazard',
    'Ergonomic Issue',
    'Environmental Release',
    'Personal Protective Equipment',
    'Housekeeping',
    'Other'
  ];

  // Initialize form data when observation prop changes
  useEffect(() => {
    if (observation && mode === 'edit') {
      setFormData({
        observationType: observation.observationType,
        priority: observation.priority,
        description: observation.description,
        location: observation.location,
        plantId: observation.plantId,
        departmentId: observation.departmentId,
        hazardType: typeof observation.hazardType === 'object' 
          ? observation.hazardType.id 
          : observation.hazardType || '',
        assignedTo: typeof observation.assignedTo === 'object' 
          ? observation.assignedTo.id 
          : observation.assignedTo
      });
    }
  }, [observation, mode]);

  // Handle input changes
  const handleInputChange = (field: keyof ObservationFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'assignedTo' ? (value ? Number(value) : undefined) : value
    }));

    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file size must be less than 10MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!formData.observationType) {
      setError('Please select an observation type');
      return false;
    }

    if (!formData.priority) {
      setError('Please select a priority level');
      return false;
    }

    if (!formData.description?.trim()) {
      setError('Please provide a description');
      return false;
    }

    if (!formData.location?.trim()) {
      setError('Please provide a location');
      return false;
    }

    if (!formData.plantId) {
      setError('Please select a plant');
      return false;
    }

    if (!formData.departmentId) {
      setError('Please select a department');
      return false;
    }

    if (!formData.hazardType?.trim()) {
      setError('Please select a hazard type');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'create') {
        const response = await ObservationService.createObservation(formData, imageFile || undefined);
        if (response.success && response.data) {
          setSuccess(`Observation created successfully! Ticket: ${response.data.ticketNumber}`);
          onSave?.(response.data);
        }
      } else {
        // Update logic would go here
        setSuccess('Observation updated successfully!');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving the observation');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (hasChanges()) {
      setShowConfirmDialog(true);
    } else {
      onCancel?.();
    }
  };

  // Check if form has changes
  const hasChanges = (): boolean => {
    if (mode === 'create') {
      return Object.values(formData).some(value => 
        value !== undefined && value !== '' && value !== null
      ) || imageFile !== null;
    }
    // For edit mode, compare with original observation
    return true; // Simplified for now
  };

  // Get filtered departments based on selected plant
  const filteredDepartments = departments.filter(dept => dept.plantId === formData.plantId);

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Card>
        <CardContent>
          <Box mb={3}>
            <Typography variant="h5" component="h1" gutterBottom>
              {mode === 'create'
                ? 'Report Safety Observation'
                : `Edit Observation: ${observation?.ticketNumber}`
              }
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {mode === 'create'
                ? 'Report safety observations to improve workplace safety'
                : `Editing observation: ${observation?.ticketNumber}`
              }
            </Typography>
          </Box>

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
            {/* Observation Type */}
            <Grid size ={{xs: 12, md:6}}>
              <FormControl fullWidth required>
                <InputLabel>Observation Type</InputLabel>
                <Select
                  value={formData.observationType || ''}
                  label="Observation Type"
                  onChange={(e) => handleInputChange('observationType', e.target.value as ObservationType)}
                >
                  <MenuItem value={ObservationType.UNSAFE_ACT}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label="Unsafe Act" color="error" size="small" />
                      Unsafe Act - Behavior that could lead to an accident
                    </Box>
                  </MenuItem>
                  <MenuItem value={ObservationType.UNSAFE_CONDITION}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label="Unsafe Condition" color="warning" size="small" />
                      Unsafe Condition - Physical state that could cause harm
                    </Box>
                  </MenuItem>
                  <MenuItem value={ObservationType.WORK_STOPPAGE}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label="Work Stoppage" color="error" size="small" />
                      Work Stoppage - Immediate danger requiring work to stop
                    </Box>
                  </MenuItem>
                  <MenuItem value={ObservationType.NEAR_MISS}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label="Near Miss" color="info" size="small" />
                      Near Miss - Incident that could have resulted in harm
                    </Box>
                  </MenuItem>
                  <MenuItem value={ObservationType.GOOD_PRACTICE}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label="Good Practice" color="success" size="small" />
                      Good Practice - Positive safety behavior to recognize
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Priority */}
            <Grid size ={{xs: 12, md:6}}>
              <FormControl fullWidth required>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority || ''}
                  label="Priority"
                  onChange={(e) => handleInputChange('priority', e.target.value as Priority)}
                >
                  <MenuItem value={Priority.HIGH}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label="High" color="error" size="small" />
                      High - Immediate attention required (24 hrs)
                    </Box>
                  </MenuItem>
                  <MenuItem value={Priority.MEDIUM}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label="Medium" color="warning" size="small" />
                      Medium - Address within 3 days
                    </Box>
                  </MenuItem>
                  <MenuItem value={Priority.LOW}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label="Low" color="success" size="small" />
                      Low - Address within 1 week
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Description */}
            <Grid size ={{xs:12}}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                placeholder="Describe what you observed in detail..."
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
              />
            </Grid>

            {/* Location */}
            <Grid size ={{xs: 12, md:6}}>
              <TextField
                fullWidth
                label="Location"
                placeholder="Building, floor, room, or area..."
                value={formData.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
              />
            </Grid>

            {/* Assign To */}
            <Grid size ={{xs: 12, md:6}}>
              <FormControl fullWidth>
                <InputLabel>Assign To</InputLabel>
                <Select
                  value={formData.assignedTo || ''}
                  label="Assign To"
                  onChange={(e) => handleInputChange('assignedTo', e.target.value ? Number(e.target.value) : undefined)}
                >
                  <MenuItem value="">Auto-assign based on location</MenuItem>
                  {users.map(user => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.employeeId})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Plant */}
            <Grid size ={{xs: 12, md:6}}>
              <FormControl fullWidth required>
                <InputLabel>Plant</InputLabel>
                <Select
                  value={formData.plantId || ''}
                  label="Plant"
                  onChange={(e) => {
                    const plantId = Number(e.target.value);
                    handleInputChange('plantId', plantId);
                    // Reset department when plant changes
                    const firstDept = departments.find(d => d.plantId === plantId);
                    handleInputChange('departmentId', firstDept?.id);
                  }}
                >
                  {plants.map(plant => (
                    <MenuItem key={plant.id} value={plant.id}>
                      <Box>
                        <Typography variant="body1">{plant.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {plant.location}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Department */}
            <Grid size ={{xs: 12, md:6}}>
              <FormControl fullWidth required disabled={!formData.plantId}>
                <InputLabel>Department</InputLabel>
                <Select
                  value={formData.departmentId || ''}
                  label="Department"
                  onChange={(e) => handleInputChange('departmentId', Number(e.target.value))}
                >
                  {filteredDepartments.map(dept => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name} ({dept.code})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Hazard Type */}
            <Grid size ={{xs:12}}>
              <FormControl fullWidth required>
                <InputLabel>Hazard Type</InputLabel>
                <Select
                  value={formData.hazardType || ''}
                  label="Hazard Type"
                  onChange={(e) => handleInputChange('hazardType', e.target.value)}
                >
                  {hazardTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Image Upload */}
            <Grid size ={{xs:12}}>
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Photo Evidence (Optional)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<PhotoCameraIcon />}
                  >
                    {imageFile ? 'Change Photo' : 'Upload Photo'}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Button>
                  {imageFile && (
                    <IconButton onClick={handleRemoveImage} color="error">
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>

                {imagePreview && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: '300px',
                        maxHeight: '200px',
                        objectFit: 'contain',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* Form Actions */}
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              startIcon={<CancelIcon />}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={loading}
            >
              {loading ? 'Saving...' : mode === 'create' ? 'Submit Observation' : 'Update Observation'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
        <DialogTitle>Unsaved Changes</DialogTitle>
        <DialogContent>
          <Typography>
            You have unsaved changes. Are you sure you want to cancel without saving?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>
            Continue Editing
          </Button>
          <Button 
            onClick={() => {
              setShowConfirmDialog(false);
              onCancel?.();
            }} 
            color="error"
          >
            Discard Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ObservationForm;