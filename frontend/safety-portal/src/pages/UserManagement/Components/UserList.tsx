import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Button, Grid, TextField, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  FormControl, InputLabel, Select, MenuItem, Chip, Box, IconButton,
  Avatar, Switch
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Visibility as ViewIcon,
  Block as BlockIcon,
  CheckCircle as ActiveIcon 
} from '@mui/icons-material';

interface UserListProps {
  onCreateUser?: () => void;
  onEditUser?: (userId: string) => void;
  onViewUser?: (userId: string) => void;
  onToggleUserStatus?: (userId: string) => void;
}

interface User {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  lastLogin?: Date;
  createdDate: Date;
  avatar?: string;
}

const UserList: React.FC<UserListProps> = ({ 
  onCreateUser, onEditUser, onViewUser, onToggleUserStatus 
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filterRole, setFilterRole] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    // Mock data
    const mockUsers: User[] = [
      {
        id: '1',
        employeeId: 'EMP001',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@company.com',
        role: 'Safety Manager',
        department: 'Safety',
        status: 'Active',
        lastLogin: new Date(),
        createdDate: new Date()
      },
      {
        id: '2',
        employeeId: 'EMP002',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@company.com',
        role: 'Safety Officer',
        department: 'Manufacturing',
        status: 'Active',
        createdDate: new Date()
      }
    ];
    setUsers(mockUsers);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'default';
      case 'Suspended': return 'error';
      default: return 'default';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'error';
      case 'Safety Manager': return 'primary';
      case 'Safety Officer': return 'info';
      case 'Supervisor': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">User Management</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={onCreateUser}>
              Add User
            </Button>
          </Box>
          <Grid container spacing={2} alignItems="center">
            <Grid size ={{xs: 12, md:3}}>
              <TextField
                fullWidth label="Search Users" variant="outlined"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Name, email, or employee ID"
              />
            </Grid>
            <Grid size ={{xs: 12, md:3}}>
              <FormControl fullWidth>
                <InputLabel>Filter by Role</InputLabel>
                <Select value={filterRole} label="Filter by Role" onChange={(e) => setFilterRole(e.target.value)}>
                  <MenuItem value="">All Roles</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Safety Manager">Safety Manager</MenuItem>
                  <MenuItem value="Safety Officer">Safety Officer</MenuItem>
                  <MenuItem value="Supervisor">Supervisor</MenuItem>
                  <MenuItem value="Employee">Employee</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size ={{xs: 12, md:3}}>
              <FormControl fullWidth>
                <InputLabel>Filter by Status</InputLabel>
                <Select value={filterStatus} label="Filter by Status" onChange={(e) => setFilterStatus(e.target.value)}>
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Employee ID</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar src={user.avatar}>
                          {user.firstName}{user.lastName}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.employeeId}</TableCell>
                    <TableCell>
                      <Chip label={user.role} color={getRoleColor(user.role) as any} size="small" />
                    </TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>
                      <Chip label={user.status} color={getStatusColor(user.status) as any} size="small" />
                    </TableCell>
                    <TableCell>
                      {user.lastLogin ? user.lastLogin.toLocaleDateString() : 'Never'}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => onViewUser?.(user.id)}>
                        <ViewIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => onEditUser?.(user.id)}>
                        <EditIcon />
                      </IconButton>
                      <Switch
                        checked={user.status === 'Active'}
                        onChange={() => onToggleUserStatus?.(user.id)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserList;