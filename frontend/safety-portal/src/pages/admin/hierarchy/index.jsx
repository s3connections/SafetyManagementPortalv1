import React, { useState, useEffect } from 'react';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { 
  Box, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Paper,
  Toolbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';

// Transform the plants data into the format expected by RichTreeView
const transformPlantData = (plants) => {
  if (!plants || !Array.isArray(plants)) return [];
  
  return plants.map(plant => ({
    id: `plant-${plant.id}`,
    label: plant.name,
    children: plant.locations ? plant.locations.map(location => ({
      id: `location-${location.id}`,
      label: location.name,
      children: location.departments ? location.departments.map(dept => ({
        id: `dept-${dept.id}`,
        label: dept.name,
        children: dept.teams ? dept.teams.map(team => ({
          id: `team-${team.id}`,
          label: team.name,
          children: []
        })) : []
      })) : []
    })) : []
  }));
};

export default function HierarchyAdmin({ plants: initialPlants = [] }) {
  const [plants, setPlants] = useState(initialPlants);
  const [treeItems, setTreeItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [expandedItems, setExpandedItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', type: 'plant', parentId: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const transformed = transformPlantData(plants);
    setTreeItems(transformed);
    // Auto-expand all plant nodes
    const plantIds = transformed.map(item => item.id);
    setExpandedItems(plantIds);
  }, [plants]);

  const handleAddItem = () => {
    setEditMode(false);
    setNewItem({ name: '', type: 'plant', parentId: null });
    setOpenDialog(true);
  };

  const handleEditItem = () => {
    if (selectedItems.length === 1) {
      setEditMode(true);
      setOpenDialog(true);
    }
  };

  const handleDeleteItem = () => {
    if (selectedItems.length > 0) {
      showSnackbar('Items deleted successfully', 'success');
    }
  };

  const handleSaveItem = () => {
    if (!newItem.name.trim()) {
      showSnackbar('Name is required', 'error');
      return;
    }

    showSnackbar(editMode ? 'Item updated successfully' : 'Item created successfully', 'success');
    setOpenDialog(false);
    setNewItem({ name: '', type: 'plant', parentId: null });
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ height: '100vh', p: 3 }}>
      <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Toolbar>
          <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
            Organization Hierarchy Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={handleAddItem}
            >
              Add Item
            </Button>
            <Button
              startIcon={<EditIcon />}
              variant="outlined"
              disabled={selectedItems.length !== 1}
              onClick={handleEditItem}
            >
              Edit
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              variant="outlined"
              color="error"
              disabled={selectedItems.length === 0}
              onClick={handleDeleteItem}
            >
              Delete
            </Button>
          </Box>
        </Toolbar>

        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          {treeItems.length > 0 ? (
            <RichTreeView
              items={treeItems}
              selectedItems={selectedItems}
              onSelectedItemsChange={(event, itemIds) => setSelectedItems(itemIds)}
              expandedItems={expandedItems}
              onExpandedItemsChange={(event, itemIds) => setExpandedItems(itemIds)}
              multiSelect
              checkboxSelection
              sx={{ minHeight: 200 }}
            />
          ) : (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="h6" color="textSecondary">
                No hierarchy data available
              </Typography>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={handleAddItem}
                sx={{ mt: 2 }}
              >
                Add First Plant
              </Button>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editMode ? 'Edit Item' : 'Add New Item'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={newItem.type}
                label="Type"
                onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
              >
                <MenuItem value="plant">Plant</MenuItem>
                <MenuItem value="location">Location</MenuItem>
                <MenuItem value="department">Department</MenuItem>
                <MenuItem value="team">Team</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveItem} variant="contained">
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
