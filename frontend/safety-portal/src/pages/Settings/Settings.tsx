import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Save,
  Add,
  Edit,
  Delete,
  Notifications,
  Security,
  Business,
  Email
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const Settings: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showMasterDataDialog, setShowMasterDataDialog] = useState(false);
  const [masterDataType, setMasterDataType] = useState('');
  const [masterDataItems, setMasterDataItems] = useState<any[]>([]);
  
  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    companyName: '',
    timezone: '',
    dateFormat: '',
    slaSettings: {
      high: 24,
      medium: 72,
      low: 168
    }
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    dailyReport: true,
    weeklyReport: true,
    monthlyReport: true,
    slaAlerts: true,
    escalationAlerts: true
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const settings = await response.json();
        setGeneralSettings(settings.general || generalSettings);
        setNotificationSettings(settings.notifications || notificationSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          general: generalSettings,
          notifications: notificationSettings
        })
      });

      if (response.ok) {
        // Show success message
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMasterData = async (type: string) => {
    try {
      const response = await fetch(`/api/masterdata/${type}`);
      if (response.ok) {
        const data = await response.json();
        setMasterDataItems(data);
      }
    } catch (error) {
      console.error('Error loading master data:', error);
    }
  };

  const handleMasterDataEdit = (type: string) => {
    setMasterDataType(type);
    loadMasterData(type);
    setShowMasterDataDialog(true);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        System Settings
      </Typography>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            aria-label="settings tabs"
          >
            <Tab label="General" icon={<Business />} />
            <Tab label="Notifications" icon={<Notifications />} />
            <Tab label="Master Data" icon={<Edit />} />
            <Tab label="Security" icon={<Security />} />
          </Tabs>
        </Box>

        {/* General Settings */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Name"
                value={generalSettings.companyName}
                onChange={(e) => setGeneralSettings(prev => ({
                  ...prev,
                  companyName: e.target.value
                }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Timezone</InputLabel>
                <Select
                  value={generalSettings.timezone}
                  onChange={(e) => setGeneralSettings(prev => ({
                    ...prev,
                    timezone: e.target.value
                  }))}
                >
                  <MenuItem value="Asia/Kolkata">Asia/Kolkata (IST)</MenuItem>
                  <MenuItem value="UTC">UTC</MenuItem>
                  <MenuItem value="America/New_York">America/New_York (EST)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Date Format</InputLabel>
                <Select
                  value={generalSettings.dateFormat}
                  onChange={(e) => setGeneralSettings(prev => ({
                    ...prev,
                    dateFormat: e.target.value
                  }))}
                >
                  <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                  <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                  <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            SLA Settings (Hours)
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="High Priority SLA"
                value={generalSettings.slaSettings.high}
                onChange={(e) => setGeneralSettings(prev => ({
                  ...prev,
                  slaSettings: {
                    ...prev.slaSettings,
                    high: parseInt(e.target.value)
                  }
                }))}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Medium Priority SLA"
                value={generalSettings.slaSettings.medium}
                onChange={(e) => setGeneralSettings(prev => ({
                  ...prev,
                  slaSettings: {
                    ...prev.slaSettings,
                    medium: parseInt(e.target.value)
                  }
                }))}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Low Priority SLA"
                value={generalSettings.slaSettings.low}
                onChange={(e) => setGeneralSettings(prev => ({
                  ...prev,
                  slaSettings: {
                    ...prev.slaSettings,
                    low: parseInt(e.target.value)
                  }
                }))}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Notification Settings */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Notification Channels
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.emailEnabled}
                    onChange={(e) => setNotificationSettings(prev => ({
                      ...prev,
                      emailEnabled: e.target.checked
                    }))}
                  />
                }
                label="Email Notifications"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.smsEnabled}
                    onChange={(e) => setNotificationSettings(prev => ({
                      ...prev,
                      smsEnabled: e.target.checked
                    }))}
                  />
                }
                label="SMS Notifications"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.pushEnabled}
                    onChange={(e) => setNotificationSettings(prev => ({
                      ...prev,
                      pushEnabled: e.target.checked
                    }))}
                  />
                }
                label="Push Notifications"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Report Settings
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.dailyReport}
                    onChange={(e) => setNotificationSettings(prev => ({
                      ...prev,
                      dailyReport: e.target.checked
                    }))}
                  />
                }
                label="Daily Reports"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.weeklyReport}
                    onChange={(e) => setNotificationSettings(prev => ({
                      ...prev,
                      weeklyReport: e.target.checked
                    }))}
                  />
                }
                label="Weekly Reports"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.monthlyReport}
                    onChange={(e) => setNotificationSettings(prev => ({
                      ...prev,
                      monthlyReport: e.target.checked
                    }))}
                  />
                }
                label="Monthly Reports"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Alert Settings
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.slaAlerts}
                    onChange={(e) => setNotificationSettings(prev => ({
                      ...prev,
                      slaAlerts: e.target.checked
                    }))}
                  />
                }
                label="SLA Breach Alerts"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.escalationAlerts}
                    onChange={(e) => setNotificationSettings(prev => ({
                      ...prev,
                      escalationAlerts: e.target.checked
                    }))}
                  />
                }
                label="Escalation Alerts"
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Master Data */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Manage Master Data
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Departments
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Manage company departments and hierarchies
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => handleMasterDataEdit('departments')}
                    fullWidth
                  >
                    Manage
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Locations
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Manage plant locations and stations
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => handleMasterDataEdit('locations')}
                    fullWidth
                  >
                    Manage
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Hazard Categories
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Define hazard types and categories
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => handleMasterDataEdit('hazards')}
                    fullWidth
                  >
                    Manage
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Security Settings */}
        <TabPanel value={tabValue} index={3}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Security settings require administrator privileges
          </Alert>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Password Policy
              </Typography>
              <Box sx={{ ml: 2 }}>
                <Typography variant="body2" gutterBottom>
                  • Minimum 8 characters
                </Typography>
                <Typography variant="body2" gutterBottom>
                  • At least one uppercase letter
                </Typography>
                <Typography variant="body2" gutterBottom>
                  • At least one lowercase letter
                </Typography>
                <Typography variant="body2" gutterBottom>
                  • At least one number
                </Typography>
                <Typography variant="body2" gutterBottom>
                  • Password expiry: 90 days
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        <CardContent>
          <Box display="flex" justifyContent="flex-end">
            <LoadingButton
              variant="contained"
              loading={loading}
              onClick={saveSettings}
              startIcon={<Save />}
            >
              Save Settings
            </LoadingButton>
          </Box>
        </CardContent>
      </Card>

      {/* Master Data Dialog */}
      <Dialog
        open={showMasterDataDialog}
        onClose={() => setShowMasterDataDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Manage {masterDataType.charAt(0).toUpperCase() + masterDataType.slice(1)}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Button variant="contained" startIcon={<Add />}>
              Add New
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {masterDataItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMasterDataDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;