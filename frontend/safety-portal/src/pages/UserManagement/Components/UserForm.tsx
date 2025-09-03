import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Button, Grid, TextField, FormControl,
  InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent,
  DialogActions, Box, Switch, FormControlLabel, Divider, Chip
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';

interface UserFormProps {
  userId?: string;
  open: boolean;
  onClose: () => void;
  onSave: (userData: UserData) => void;
}

interface UserData {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  department: string;
  jobTitle: string;
  supervisor?: string;
  startDate: string;
  status: string;
  permissions: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  certifications: string[];
  notes?: string;
}

const UserForm: React.FC<UserFormProps> = ({ userId, open, onClose, onSave }) => {
  const [formData, setFormData] = useState<UserData>({
    employeeId: '', firstName: '', lastName: '', email: '', phoneNumber: '',
    role: '', department: '', jobTitle: '', startDate: '', status: 'Active',
    permissions: [], emergencyContact: { name: '', relationship: '', phone: '' },
    certifications: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const roleOptions = [
    'Admin', 'Safety Manager', 'Safety Officer', 'Supervisor', 'Employee', 'Contractor'
  ];

  const departmentOptions = [
    'Safety', 'Manufacturing', 'Maintenance', 'Operations', 'Engineering', 
    'Quality Control', 'Human Resources', 'Administration'
  ];

  const permissionOptions = [
    'View Incidents', 'Create Incidents', 'Approve Incidents',
    'View Audits', 'Create Audits', 'Conduct Audits',
    'View Permits', 'Create Permits', 'Approve Permits',
    'Manage Users', 'View Reports', 'System Administration'
  ];

  const handleInputChange = (field: keyof UserData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleEmergencyContactChange = (field: keyof UserData['emergencyContact'], value: string) => {
    setFormData(prev => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [field]: value }
    }));
  };

  const handlePermissionChange = (permission: string) => {
    const current = formData.permissions;
    if (current.includes(permission)) {
      handleInputChange('permissions', current.filter(p => p !== permission));
    } else {
      handleInputChange('permissions', [...current, permission]);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.employeeId.trim()) newErrors.employeeId = 'Employee ID is required';
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.department) newErrors.department = 'Department is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
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
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{userId ? 'Edit User' : 'Add New User'}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid size ={{xs:12}}>
              <Typography variant="h6" gutterBottom>Basic Information</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid size ={{xs: 12, md:4}}>
              <TextField
                fullWidth label="Employee ID" required
                value={formData.employeeId}
                onChange={(e) => handleInputChange('employeeId', e.target.value)}
                error={!!errors.employeeId} helperText={errors.employeeId}
              />
            </Grid>
            
            <Grid size ={{xs: 12, md:4}}>
              <TextField
                fullWidth label="First Name" required
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                error={!!errors.firstName} helperText={errors.firstName}
              />
            </Grid>
            
            <Grid size ={{xs: 12, md:4}}>
              <TextField
                fullWidth label="Last Name" required
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                error={!!errors.lastName} helperText={errors.lastName}
              />
            </Grid>

            <Grid size ={{xs: 12, md:6}}>
              <TextField
                fullWidth label="Email" type="email" required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!!errors.email} helperText={errors.email}
              />
            </Grid>

            <Grid size ={{xs: 12, md:6}}>
              <TextField
                fullWidth label="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              />
            </Grid>

            {/* Role & Department */}
            <Grid size ={{xs:12}}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Role & Department</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid size ={{xs: 12, md:4}}>
              <FormControl fullWidth error={!!errors.role}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role} label="Role"
                  onChange={(e) => handleInputChange('role', e.target.value)}
                >
                  {roleOptions.map(role => (
                    <MenuItem key={role} value={role}>{role}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size ={{xs: 12, md:4}}>
              <FormControl fullWidth error={!!errors.department}>
                <InputLabel>Department</InputLabel>
                <Select
                  value={formData.department} label="Department"
                  onChange={(e) => handleInputChange('department', e.target.value)}
                >
                  {departmentOptions.map(dept => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size ={{xs: 12, md:4}}>
              <TextField
                fullWidth label="Job Title"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
              />
            </Grid>

            <Grid size ={{xs: 12, md:6}}>
              <TextField
                fullWidth label="Start Date" type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid size ={{xs: 12, md:6}}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status} label="Status"
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Permissions */}
            <Grid size ={{xs:12}}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Permissions</Typography>
              <Divider sx={{ mb: 2 }} />
              <Box display="flex" flexWrap="wrap" gap={1}>
                {permissionOptions.map((permission) => (
                  <Chip
                    key={permission}
                    label={permission}
                    onClick={() => handlePermissionChange(permission)}
                    color={formData.permissions.includes(permission) ? 'primary' : 'default'}
                    variant={formData.permissions.includes(permission) ? 'filled' : 'outlined'}
                    clickable
                  />
                ))}
              </Box>
            </Grid>

            {/* Emergency Contact */}
            <Grid size ={{xs:12}}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Emergency Contact</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid size ={{xs: 12, md:4}}>
              <TextField
                fullWidth label="Contact Name"
                value={formData.emergencyContact.name}
                onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
              />
            </Grid>

            <Grid size ={{xs: 12, md:4}}>
              <TextField
                fullWidth label="Relationship"
                value={formData.emergencyContact.relationship}
                onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
              />
            </Grid>

            <Grid size ={{xs: 12, md:4}}>
              <TextField
                fullWidth label="Contact Phone"
                value={formData.emergencyContact.phone}
                onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
              />
            </Grid>

            <Grid size ={{xs:12}}>
              <TextField
                fullWidth label="Additional Notes" multiline rows={3}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} startIcon={<CancelIcon />}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" startIcon={<SaveIcon />}>
          {userId ? 'Update' : 'Create'} User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;