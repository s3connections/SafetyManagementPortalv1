import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Button, Grid, Chip, Box,
  List, ListItem, ListItemText, Paper, Divider, Avatar, Tab, Tabs
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Block as BlockIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon 
} from '@mui/icons-material';

interface UserDetailsProps {
  userId: string;
  onEdit?: () => void;
  onToggleStatus?: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface UserDetail {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  department: string;
  jobTitle: string;
  supervisor?: string;
  startDate: Date;
  status: string;
  lastLogin?: Date;
  permissions: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  certifications: Array<{
    name: string;
    issueDate: Date;
    expiryDate: Date;
    status: string;
  }>;
  recentActivities: Array<{
    type: string;
    description: string;
    timestamp: Date;
  }>;
}

const UserDetails: React.FC<UserDetailsProps> = ({
  userId, onEdit, onToggleStatus
}) => {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadUserDetails();
  }, [userId]);

  const loadUserDetails = async () => {
    setLoading(true);
    try {
      // Mock data
      const mockUser: UserDetail = {
        id: userId,
        employeeId: 'EMP001',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@company.com',
        phoneNumber: '+1-555-0123',
        role: 'Safety Manager',
        department: 'Safety',
        jobTitle: 'Senior Safety Manager',
        supervisor: 'Jane Supervisor',
        startDate: new Date('2020-01-15'),
        status: 'Active',
        lastLogin: new Date(),
        permissions: ['View Incidents', 'Create Incidents', 'Approve Incidents', 'Manage Users'],
        emergencyContact: {
          name: 'Jane Smith',
          relationship: 'Spouse',
          phone: '+1-555-0124'
        },
        certifications: [
          {
            name: 'OSHA 30-Hour Construction',
            issueDate: new Date('2023-01-01'),
            expiryDate: new Date('2026-01-01'),
            status: 'Valid'
          }
        ],
        recentActivities: [
          {
            type: 'Incident',
            description: 'Created incident report INC-2024-001',
            timestamp: new Date()
          }
        ]
      };
      setUser(mockUser);
    } catch (error) {
      console.error('Error loading user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'default';
      case 'Suspended': return 'error';
      default: return 'default';
    }
  };

  const getCertificationColor = (status: string) => {
    switch (status) {
      case 'Valid': return 'success';
      case 'Expiring': return 'warning';
      case 'Expired': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return <Card><CardContent><Typography>Loading user details...</Typography></CardContent></Card>;
  }

  if (!user) {
    return <Card><CardContent><Typography>User not found</Typography></CardContent></Card>;
  }

  return (
    <Box>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="start" mb={3}>
            <Box display="flex" alignItems="center" gap={3}>
              <Avatar sx={{ width: 80, height: 80, fontSize: '2rem' }}>
                {user.firstName}{user.lastName}
              </Avatar>
              <Box>
                <Typography variant="h4" gutterBottom>
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  {user.jobTitle}
                </Typography>
                <Box display="flex" gap={1} mb={2}>
                  <Chip label={user.status} color={getStatusColor(user.status) as any} />
                  <Chip label={user.role} color="primary" variant="outlined" />
                  <Chip label={user.department} variant="outlined" />
                </Box>
              </Box>
            </Box>
            <Box display="flex" gap={1}>
              <Button variant="outlined" startIcon={<EditIcon />} onClick={onEdit}>
                Edit User
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<BlockIcon />} 
                onClick={onToggleStatus}
                color={user.status === 'Active' ? 'error' : 'success'}
              >
                {user.status === 'Active' ? 'Suspend' : 'Activate'}
              </Button>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid size ={{xs: 12, md:6}}>
              <List dense>
                <ListItem>
                  <BadgeIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <ListItemText primary="Employee ID" secondary={user.employeeId} />
                </ListItem>
                <ListItem>
                  <EmailIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <ListItemText primary="Email" secondary={user.email} />
                </ListItem>
                <ListItem>
                  <PhoneIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <ListItemText primary="Phone" secondary={user.phoneNumber} />
                </ListItem>
              </List>
            </Grid>
            <Grid size ={{xs: 12, md:6}}>
              <List dense>
                <ListItem>
                  <ListItemText primary="Department" secondary={user.department} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Start Date" secondary={user.startDate.toLocaleDateString()} />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Last Login" 
                    secondary={user.lastLogin ? user.lastLogin.toLocaleString() : 'Never'} 
                  />
                </ListItem>
                {user.supervisor && (
                  <ListItem>
                    <ListItemText primary="Supervisor" secondary={user.supervisor} />
                  </ListItem>
                )}
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Permissions" />
            <Tab label="Certifications" />
            <Tab label="Emergency Contact" />
            <Tab label="Recent Activity" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>User Permissions</Typography>
          <Divider sx={{ mb: 2 }} />
          <Box display="flex" flexWrap="wrap" gap={1}>
            {user.permissions.map((permission, index) => (
              <Chip key={index} label={permission} color="primary" variant="outlined" />
            ))}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>Certifications</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {user.certifications.map((cert, index) => (
              <Grid size ={{xs: 12, md:6}} key={index}>
                <Paper sx={{ p: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                    <Typography variant="subtitle2">{cert.name}</Typography>
                    <Chip 
                      label={cert.status} 
                      color={getCertificationColor(cert.status) as any} 
                      size="small" 
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Issued: {cert.issueDate.toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Expires: {cert.expiryDate.toLocaleDateString()}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>Emergency Contact</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={3}>
            <Grid size ={{xs: 12, md:4}}>
              <Typography variant="subtitle2">Name</Typography>
              <Typography variant="body2">{user.emergencyContact.name}</Typography>
            </Grid>
            <Grid size ={{xs: 12, md:4}}>
              <Typography variant="subtitle2">Relationship</Typography>
              <Typography variant="body2">{user.emergencyContact.relationship}</Typography>
            </Grid>
            <Grid size ={{xs: 12, md:4}}>
              <Typography variant="subtitle2">Phone Number</Typography>
              <Typography variant="body2">{user.emergencyContact.phone}</Typography>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>Recent Activity</Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            {user.recentActivities.map((activity, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={activity.description}
                  secondary={`${activity.type} • ${activity.timestamp.toLocaleString()}`}
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default UserDetails;