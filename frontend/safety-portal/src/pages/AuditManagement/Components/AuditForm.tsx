import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Divider
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';

interface AuditFormProps {
  auditId?: string;
  open: boolean;
  onClose: () => void;
  onSave: (auditData: AuditData) => void;
}

interface AuditData {
  title: string;
  description: string;
  auditType: string;
  scheduledDate: string;
  auditorId: string;
  departmentId: string;
  plantId: string;
}

const AuditForm: React.FC<AuditFormProps> = ({
  auditId,
  open,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<AuditData>({
    title: '',
    description: '',
    auditType: '',
    scheduledDate: '',
    auditorId: '',
    departmentId: '',
    plantId: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (auditId) {
      // Load audit data for editing
      loadAuditData(auditId);
    } else {
      // Reset form for new audit
      resetForm();
    }
  }, [auditId, open]);

  const loadAuditData = async (id: string) => {
    // Implementation to fetch audit data
    // For now, using mock data
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      auditType: '',
      scheduledDate: '',
      auditorId: '',
      departmentId: '',
      plantId: ''
    });
    setErrors({});
  };

  const handleInputChange = (field: keyof AuditData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.auditType) {
      newErrors.auditType = 'Audit type is required';
    }

    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'Scheduled date is required';
    }

    if (!formData.auditorId) {
      newErrors.auditorId = 'Auditor is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {auditId ? 'Edit Audit' : 'Create New Audit'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid size ={{xs:12}}>
              <TextField
                fullWidth
                label="Audit Title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                error={!!errors.title}
                helperText={errors.title}
                required
              />
            </Grid>

            <Grid size ={{xs: 12, md:6}}>
              <FormControl fullWidth error={!!errors.auditType}>
                <InputLabel>Audit Type</InputLabel>
                <Select
                  value={formData.auditType}
                  label="Audit Type"
                  onChange={(e) => handleInputChange('auditType', e.target.value)}
                >
                  <MenuItem value="Safety">Safety Audit</MenuItem>
                  <MenuItem value="Compliance">Compliance Audit</MenuItem>
                  <MenuItem value="Quality">Quality Audit</MenuItem>
                  <MenuItem value="Environmental">Environmental Audit</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size ={{xs: 12, md:6}}>
              <TextField
                fullWidth
                label="Scheduled Date"
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                error={!!errors.scheduledDate}
                helperText={errors.scheduledDate}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid size ={{xs: 12, md:6}}>
              <FormControl fullWidth>
                <InputLabel>Plant</InputLabel>
                <Select
                  value={formData.plantId}
                  label="Plant"
                  onChange={(e) => handleInputChange('plantId', e.target.value)}
                >
                  <MenuItem value="plant1">Plant 1</MenuItem>
                  <MenuItem value="plant2">Plant 2</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size ={{xs: 12, md:6}}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={formData.departmentId}
                  label="Department"
                  onChange={(e) => handleInputChange('departmentId', e.target.value)}
                >
                  <MenuItem value="manufacturing">Manufacturing</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="quality">Quality Control</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size ={{xs:12}}>
              <FormControl fullWidth error={!!errors.auditorId}>
                <InputLabel>Auditor</InputLabel>
                <Select
                  value={formData.auditorId}
                  label="Auditor"
                  onChange={(e) => handleInputChange('auditorId', e.target.value)}
                >
                  <MenuItem value="auditor1">John Doe</MenuItem>
                  <MenuItem value="auditor2">Jane Smith</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size ={{xs:12}}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} startIcon={<CancelIcon />}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          startIcon={<SaveIcon />}
        >
          {auditId ? 'Update' : 'Create'} Audit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuditForm;