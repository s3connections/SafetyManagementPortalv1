import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Toolbar,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Grid,
  FormControlLabel,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  QuestionAnswer as QuestionIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

const questionTypes = [
  'Yes/No',
  'Multiple Choice',
  'Text',
  'Number',
  'Date',
  'File Upload'
];

const auditCategories = [
  'Safety Management',
  'Risk Assessment',
  'Training & Competency',
  'Emergency Preparedness',
  'Incident Investigation',
  'Documentation',
  'Equipment Safety',
  'Environmental Compliance'
];

const sampleQuestions = [
  {
    id: 1,
    category: 'Safety Management',
    question: 'Is there a documented safety policy in place?',
    type: 'Yes/No',
    required: true,
    active: true,
    created: '2025-01-15',
    lastModified: '2025-02-20'
  },
  {
    id: 2,
    category: 'Risk Assessment',
    question: 'How many risk assessments were completed in the last quarter?',
    type: 'Number',
    required: true,
    active: true,
    created: '2025-01-20',
    lastModified: '2025-02-18'
  },
  {
    id: 3,
    category: 'Training & Competency',
    question: 'What percentage of staff completed safety training?',
    type: 'Number',
    required: false,
    active: true,
    created: '2025-02-01',
    lastModified: '2025-02-15'
  },
  {
    id: 4,
    category: 'Emergency Preparedness',
    question: 'When was the last emergency drill conducted?',
    type: 'Date',
    required: true,
    active: true,
    created: '2025-02-05',
    lastModified: '2025-02-10'
  }
];

export default function AuditQAdmin() {
  const [questions, setQuestions] = useState(sampleQuestions);
  const [filteredQuestions, setFilteredQuestions] = useState(sampleQuestions);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    category: '',
    question: '',
    type: 'Yes/No',
    required: false,
    active: true,
    options: []
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    if (filterCategory === 'All') {
      setFilteredQuestions(questions);
    } else {
      setFilteredQuestions(questions.filter(q => q.category === filterCategory));
    }
  }, [questions, filterCategory]);

  const handleAddQuestion = () => {
    setEditMode(false);
    setNewQuestion({
      category: '',
      question: '',
      type: 'Yes/No',
      required: false,
      active: true,
      options: []
    });
    setOpenDialog(true);
  };

  const handleEditQuestion = (question) => {
    setEditMode(true);
    setCurrentQuestion(question);
    setNewQuestion({
      category: question.category,
      question: question.question,
      type: question.type,
      required: question.required,
      active: question.active,
      options: question.options || []
    });
    setOpenDialog(true);
  };

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
    showSnackbar('Question deleted successfully', 'success');
  };

  const handleSaveQuestion = () => {
    if (!newQuestion.category || !newQuestion.question.trim()) {
      showSnackbar('Category and question text are required', 'error');
      return;
    }

    if (editMode) {
      setQuestions(questions.map(q => 
        q.id === currentQuestion.id 
          ? { ...q, ...newQuestion, lastModified: new Date().toISOString().split('T')[0] }
          : q
      ));
      showSnackbar('Question updated successfully', 'success');
    } else {
      const newId = Math.max(...questions.map(q => q.id)) + 1;
      setQuestions([...questions, {
        id: newId,
        ...newQuestion,
        created: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0]
      }]);
      showSnackbar('Question created successfully', 'success');
    }
    setOpenDialog(false);
  };

  const toggleQuestionStatus = (id) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, active: !q.active } : q
    ));
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getQuestionsByCategory = () => {
    const grouped = {};
    auditCategories.forEach(category => {
      grouped[category] = questions.filter(q => q.category === category);
    });
    return grouped;
  };

  return (
    <Box sx={{ height: '100vh', p: 3 }}>
      <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Toolbar>
          <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
            Audit Questions Management
          </Typography>
          <FormControl sx={{ minWidth: 120, mr: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={filterCategory}
              label="Category"
              onChange={(e) => setFilterCategory(e.target.value)}
              size="small"
            >
              <MenuItem value="All">All Categories</MenuItem>
              {auditCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={handleAddQuestion}
          >
            Add Question
          </Button>
        </Toolbar>

        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          <Grid container spacing={3}>
            {/* Statistics Cards */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Total Questions
                      </Typography>
                      <Typography variant="h4">
                        {questions.length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Active Questions
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        {questions.filter(q => q.active).length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Categories
                      </Typography>
                      <Typography variant="h4" color="info.main">
                        {auditCategories.length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Required Questions
                      </Typography>
                      <Typography variant="h4" color="warning.main">
                        {questions.filter(q => q.required).length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            {/* Questions by Category */}
            <Grid item xs={12}>
              {filterCategory === 'All' ? (
                // Show grouped by category
                <Box>
                  {Object.entries(getQuestionsByCategory()).map(([category, categoryQuestions]) => (
                    <Accordion key={category} defaultExpanded>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">
                          {category} ({categoryQuestions.length})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Question</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Required</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Created</TableCell>
                                <TableCell>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {categoryQuestions.map((question) => (
                                <TableRow key={question.id}>
                                  <TableCell sx={{ maxWidth: 300 }}>
                                    {question.question}
                                  </TableCell>
                                  <TableCell>
                                    <Chip label={question.type} size="small" />
                                  </TableCell>
                                  <TableCell>
                                    {question.required ? (
                                      <CheckIcon color="error" />
                                    ) : (
                                      <CancelIcon color="disabled" />
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Chip 
                                      label={question.active ? 'Active' : 'Inactive'}
                                      color={question.active ? 'success' : 'error'}
                                      size="small"
                                    />
                                  </TableCell>
                                  <TableCell>{question.created}</TableCell>
                                  <TableCell>
                                    <IconButton 
                                      onClick={() => toggleQuestionStatus(question.id)}
                                      color={question.active ? 'error' : 'success'}
                                      title={question.active ? 'Deactivate' : 'Activate'}
                                    >
                                      {question.active ? <CancelIcon /> : <CheckIcon />}
                                    </IconButton>
                                    <IconButton onClick={() => handleEditQuestion(question)}>
                                      <EditIcon />
                                    </IconButton>
                                    <IconButton 
                                      onClick={() => handleDeleteQuestion(question.id)}
                                      color="error"
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              ) : (
                // Show filtered questions in table
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Question</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Required</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredQuestions.map((question) => (
                        <TableRow key={question.id}>
                          <TableCell sx={{ maxWidth: 400 }}>
                            {question.question}
                          </TableCell>
                          <TableCell>
                            <Chip label={question.type} size="small" />
                          </TableCell>
                          <TableCell>
                            {question.required ? (
                              <CheckIcon color="error" />
                            ) : (
                              <CancelIcon color="disabled" />
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={question.active ? 'Active' : 'Inactive'}
                              color={question.active ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{question.created}</TableCell>
                          <TableCell>
                            <IconButton 
                              onClick={() => toggleQuestionStatus(question.id)}
                              color={question.active ? 'error' : 'success'}
                              title={question.active ? 'Deactivate' : 'Activate'}
                            >
                              {question.active ? <CancelIcon /> : <CheckIcon />}
                            </IconButton>
                            <IconButton onClick={() => handleEditQuestion(question)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              onClick={() => handleDeleteQuestion(question.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Add/Edit Question Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? 'Edit Audit Question' : 'Add New Audit Question'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={newQuestion.category}
                label="Category"
                onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
              >
                {auditCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              label="Question Text"
              value={newQuestion.question}
              onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
              fullWidth
              required
              multiline
              rows={3}
            />
            
            <FormControl fullWidth>
              <InputLabel>Question Type</InputLabel>
              <Select
                value={newQuestion.type}
                label="Question Type"
                onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
              >
                {questionTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={newQuestion.required}
                  onChange={(e) => setNewQuestion({ ...newQuestion, required: e.target.checked })}
                />
              }
              label="Required Question"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={newQuestion.active}
                  onChange={(e) => setNewQuestion({ ...newQuestion, active: e.target.checked })}
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveQuestion} variant="contained">
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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