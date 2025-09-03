import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Alert,
  Card,
  CardContent,
  FormHelperText,
  Divider,
  Chip,
  IconButton,
  CircularProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  CloudUpload as UploadIcon,
  Image as ImageIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import ObservationService, { CreateObservationDto } from '../services/ObservationService';
import { Observation, ObservationType, Priority, Plant, Department, User } from '../types';

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
  const [formData, setFormData] = useState<CreateObservationDto>({
    observationType: ObservationType.UNSAFE_CONDITION,
    priority: Priority.MEDIUM,
    description: '',
    location: '',
    plantId: 1,
    departmentId: 1,
    hazardType: '',
    assignedTo: undefined
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Mock data - in real app, these would come from API
  const [plants] = useState<Plant[]>([
    { id: 1, name: 'Manufacturing Plant A', code: 'MPA', location: 'Mumbai, Maharashtra', isActive: true },
    { id: 2, name: 'Chemical Processing Plant B', code: 'CPB', location: 'Pune, Maharashtra', isActive: true }
  ]);

  const [departments] = useState<Department[]>([
    { id: 1, name: 'Production', code: 'PROD', plantId: 1, isActive: true },
    { id: 2, name: 'Maintenance', code: 'MAINT', plantId: 1, isActive: true },
    { id: 3, name: 'Quality Control', code: 'QC', plantId: 1, isActive: true },
    { id: 4, name: 'Safety', code: 'SAFETY', plantId: 1, isActive: true }
  ]);

  const [users] = useState<User[]>([
    { id: 1, employeeId: 'EMP001', firstName: 'John', lastName: 'Doe', email: 'john.doe@company.com', userType: 'Employee' as any, isActive: true, createdAt: '', updatedAt: '' },
    { id: 2, employeeId: 'EMP002', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@company.com', userType: 'Responsible_Engineer' as any, isActive: true, createdAt: '', updatedAt: '' }
  ]);

  const hazardTypes = [
    'Electrical',
    'Mechanical',
    'Chemical',
    'Physical',
    'Ergonomic',
    'Biological',
    'Environmental',
    'Fire/Explosion',
    'Slip/Trip/Fall',
    'Other'
  ];

  // Initialize form data if editing
  useEffect(() => {
    if (observation && mode === 'edit') {
      setFormData({
        observationType: observation.observationType,
        priority: observation.priority,
        description: observation.description,
        location: observation.location,
        plantId: observation.plantId,
        departmentId: observation.departmentId,
        hazardType: observation.hazardType || '',
        assignedTo: observation.assignedTo
      });
    }
  }, [observation, mode]);

  const handleInputChange = (field: keyof CreateObservationDto, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'create') {
        const response = await ObservationService.createObservation(formData, imageFile || undefined);
        if (response.success) {
          setSuccess(`Observation created successfully! Ticket: ${response.data.ticketNumber}`);
          onSave?.(response.data);
        }
      } else {
        // Update logic would go here
        setSuccess('Observation updated successfully!');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save observation');
    } finally {
      setLoading(false);
    }
  };

  const filteredDepartments = departments.filter(dept => dept.plantId === formData.plantId);

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <WarningIcon />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              {mode === 'create' ? 'Report New Observation' : 'Edit Observation'}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {mode === 'create' 
                ? 'Report safety observations to improve workplace safety'
                : `Editing observation: ${observation?.ticketNumber}`
              }
            </Typography>
          </Box>
        </Box>

        {/* Status Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessIcon color="primary" />
                Basic Information
              </Typography>
              <Card variant="outlined">
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Observation Type</InputLabel>
                        <Select
                          value={formData.observationType}
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

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Priority</InputLabel>
                        <Select
                          value={formData.priority}
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

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Hazard Type</InputLabel>
                        <Select
                          value={formData.hazardType}
                          label="Hazard Type"
                          onChange={(e) => handleInputChange('hazardType', e.target.value)}
                        >
                          <MenuItem value="">Select hazard type (optional)</MenuItem>
                          {hazardTypes.map(type => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Assign To</InputLabel>
                        <Select
                          value={formData.assignedTo || ''}
                          label="Assign To"
                          onChange={(e) => handleInputChange('assignedTo', e.target.value ? parseInt(e.target.value) : undefined)}
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
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Location Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon color="primary" />
                Location Information
              </Typography>
              <Card variant="outlined">
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Plant</InputLabel>
                        <Select
                          value={formData.plantId}
                          label="Plant"
                          onChange={(e) => {
                            const plantId = parseInt(e.target.value as string);
                            handleInputChange('plantId', plantId);
                            // Reset department when plant changes
                            const firstDept = departments.find(d => d.plantId === plantId);
                            if (firstDept) {
                              handleInputChange('departmentId', firstDept.id);
                            }
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

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Department</InputLabel>
                        <Select
                          value={formData.departmentId}
                          label="Department"
                          onChange={(e) => handleInputChange('departmentId', parseInt(e.target.value as string))}
                        >
                          {filteredDepartments.map(dept => (
                            <MenuItem key={dept.id} value={dept.id}>
                              {dept.name} ({dept.code})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        multiline
                        rows={2}
                        label="Specific Location"
                        placeholder="e.g., Building A, Floor 2, Production Line 3, Near Emergency Exit"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        helperText="Provide detailed location information to help responders find the exact spot"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Observation Details
              </Typography>
              <Card variant="outlined">
                <CardContent>
                  <TextField
                    fullWidth
                    required
                    multiline
                    rows={6}
                    label="Description"
                    placeholder="Describe what you observed in detail. Include what happened, when it happened, who was involved, and any immediate actions taken."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    helperText={`${formData.description.length}/2000 characters`}
                    inputProps={{ maxLength: 2000 }}
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Photo Evidence (Optional)
              </Typography>
              <Card variant="outlined">
                <CardContent>
                  <Box
                    {...getRootProps()}
                    sx={{
                      border: '2px dashed',
                      borderColor: isDragActive ? 'primary.main' : 'grey.300',
                      borderRadius: 2,
                      p: 4,
                      textAlign: 'center',
                      cursor: 'pointer',
                      bgcolor: isDragActive ? 'action.hover' : 'background.paper',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <input {...getInputProps()} />
                    {imagePreview ? (
                      <Box>
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain' }}
                        />
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Click or drag to change image
                        </Typography>
                      </Box>
                    ) : (
                      <Box>
                        <UploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                        <Typography variant="h6" color="textSecondary">
                          {isDragActive ? 'Drop the image here' : 'Drag & drop an image, or click to select'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Supports PNG, JPG, JPEG, GIF (max 10MB)
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={onCancel}
                  startIcon={<CancelIcon />}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={loading || !formData.description.trim() || !formData.location.trim()}
                >
                  {loading ? 'Saving...' : mode === 'create' ? 'Create Observation' : 'Update Observation'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ObservationForm;