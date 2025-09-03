import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  Checkbox,
  Divider,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormLabel
} from '@mui/material';
import {
  Save,
  CheckCircle,
  Warning,
  Assignment
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

interface AuditQuestion {
  id: string;
  questionText: string;
  answerType: 'Yes/No' | 'Available/NotAvailable' | 'Ok/NotGood' | 'Custom' | 'Text';
  customOptions?: string[];
  isRequired: boolean;
  dependsOn?: string;
  dependsOnValue?: string;
}

interface AuditResponse {
  questionId: string;
  answer: string;
  remarks?: string;
  createObservation?: boolean;
  assignedTo?: string;
}

interface AuditSession {
  auditId: string;
  auditName: string;
  department: string;
  questions: AuditQuestion[];
  responses: Record<string, AuditResponse>;
}

const ConductAudit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [auditSession, setAuditSession] = useState<AuditSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showObservationDialog, setShowObservationDialog] = useState(false);
  const [selectedQuestionForObservation, setSelectedQuestionForObservation] = useState<string | null>(null);
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      loadAuditSession(id);
      loadEmployees();
    }
  }, [id]);

  const loadAuditSession = async (auditId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/audit/${auditId}/start`);
      if (response.ok) {
        const session = await response.json();
        setAuditSession(session);
      }
    } catch (error) {
      console.error('Error loading audit session:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await fetch('/api/employee');
      if (response.ok) {
        const employees = await response.json();
        setEmployees(employees);
      }
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    if (!auditSession) return;

    setAuditSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        responses: {
          ...prev.responses,
          [questionId]: {
            ...prev.responses[questionId],
            questionId,
            answer
          }
        }
      };
    });
  };

  const handleRemarksChange = (questionId: string, remarks: string) => {
    if (!auditSession) return;

    setAuditSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        responses: {
          ...prev.responses,
          [questionId]: {
            ...prev.responses[questionId],
            questionId,
            remarks
          }
        }
      };
    });
  };

  const handleCreateObservation = (questionId: string) => {
    setSelectedQuestionForObservation(questionId);
    setShowObservationDialog(true);
  };

  const handleObservationAssignment = (assignedTo: string) => {
    if (!auditSession || !selectedQuestionForObservation) return;

    setAuditSession(prev => {
      if (!prev || !selectedQuestionForObservation) return prev;
      return {
        ...prev,
        responses: {
          ...prev.responses,
          [selectedQuestionForObservation]: {
            ...prev.responses[selectedQuestionForObservation],
            createObservation: true,
            assignedTo
          }
        }
      };
    });

    setShowObservationDialog(false);
    setSelectedQuestionForObservation(null);
  };

  const shouldShowQuestion = (question: AuditQuestion): boolean => {
    if (!question.dependsOn || !auditSession) return true;
    
    const dependentResponse = auditSession.responses[question.dependsOn];
    return dependentResponse?.answer === question.dependsOnValue;
  };

  const getVisibleQuestions = (): AuditQuestion[] => {
    if (!auditSession) return [];
    return auditSession.questions.filter(shouldShowQuestion);
  };

  const calculateProgress = (): number => {
    if (!auditSession) return 0;
    
    const visibleQuestions = getVisibleQuestions();
    const answeredQuestions = visibleQuestions.filter(q => 
      auditSession.responses[q.id]?.answer
    ).length;
    
    return (answeredQuestions / visibleQuestions.length) * 100;
  };

  const getComplianceScore = (): number => {
    if (!auditSession) return 0;
    
    const visibleQuestions = getVisibleQuestions();
    const positiveAnswers = visibleQuestions.filter(q => {
      const response = auditSession.responses[q.id];
      return response?.answer === 'Yes' || 
             response?.answer === 'Available' || 
             response?.answer === 'Ok';
    }).length;
    
    return Math.round((positiveAnswers / visibleQuestions.length) * 100);
  };

  const isNegativeResponse = (question: AuditQuestion, answer: string): boolean => {
    return answer === 'No' || answer === 'NotAvailable' || answer === 'NotGood';
  };

  const handleSubmitAudit = async () => {
    if (!auditSession) return;

    setSubmitting(true);
    try {
      const auditData = {
        auditId: auditSession.auditId,
        responses: Object.values(auditSession.responses),
        complianceScore: getComplianceScore(),
        status: 'Completed'
      };

      const response = await fetch(`/api/audit/${auditSession.auditId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(auditData)
      });

      if (response.ok) {
        navigate('/audits');
      }
    } catch (error) {
      console.error('Error submitting audit:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !auditSession) {
    return <LinearProgress />;
  }

  const visibleQuestions = getVisibleQuestions();
  const currentQuestion = visibleQuestions[currentQuestionIndex];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Conduct Audit: {auditSession.auditName}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate('/audits')}
        >
          Back to Audits
        </Button>
      </Box>

      {/* Progress */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Progress: {currentQuestionIndex + 1} of {visibleQuestions.length}
            </Typography>
            <Typography variant="h6" color="primary">
              Compliance: {getComplianceScore()}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={calculateProgress()} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        </CardContent>
      </Card>

      {/* Current Question */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Question {currentQuestionIndex + 1}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem' }}>
            {currentQuestion.questionText}
          </Typography>

          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <RadioGroup
              value={auditSession.responses[currentQuestion.id]?.answer || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            >
              {currentQuestion.answerType === 'Yes/No' && (
                <>
                  <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </>
              )}
              {currentQuestion.answerType === 'Available/NotAvailable' && (
                <>
                  <FormControlLabel value="Available" control={<Radio />} label="Available" />
                  <FormControlLabel value="NotAvailable" control={<Radio />} label="Not Available" />
                </>
              )}
              {currentQuestion.answerType === 'Ok/NotGood' && (
                <>
                  <FormControlLabel value="Ok" control={<Radio />} label="Ok" />
                  <FormControlLabel value="NotGood" control={<Radio />} label="Not Good" />
                </>
              )}
              {currentQuestion.answerType === 'Custom' && currentQuestion.customOptions?.map((option) => (
                <FormControlLabel 
                  key={option} 
                  value={option} 
                  control={<Radio />} 
                  label={option} 
                />
              ))}
            </RadioGroup>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Remarks (Optional)"
            value={auditSession.responses[currentQuestion.id]?.remarks || ''}
            onChange={(e) => handleRemarksChange(currentQuestion.id, e.target.value)}
            sx={{ mb: 3 }}
          />

          {/* Show observation button for negative responses */}
          {auditSession.responses[currentQuestion.id]?.answer &&
           isNegativeResponse(currentQuestion, auditSession.responses[currentQuestion.id].answer) && (
            <Alert 
              severity="warning" 
              action={
                <Button 
                  color="inherit" 
                  size="small"
                  onClick={() => handleCreateObservation(currentQuestion.id)}
                  startIcon={<Assignment />}
                >
                  Create Observation
                </Button>
              }
              sx={{ mb: 3 }}
            >
              This response indicates a potential issue. Consider creating an observation ticket.
            </Alert>
          )}

          {auditSession.responses[currentQuestion.id]?.createObservation && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Observation ticket will be created and assigned to: {auditSession.responses[currentQuestion.id].assignedTo}
            </Alert>
          )}

          <Divider sx={{ my: 3 }} />

          <Box display="flex" justifyContent="space-between">
            <Button
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
            >
              Previous
            </Button>
            
            <Box>
              {currentQuestionIndex === visibleQuestions.length - 1 ? (
                <LoadingButton
                  variant="contained"
                  loading={submitting}
                  onClick={handleSubmitAudit}
                  startIcon={<CheckCircle />}
                >
                  Complete Audit
                </LoadingButton>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  disabled={!auditSession.responses[currentQuestion.id]?.answer}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Observation Assignment Dialog */}
      <Dialog
        open={showObservationDialog}
        onClose={() => setShowObservationDialog(false)}
      >
        <DialogTitle>Assign Observation</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Select a responsible engineer to assign this observation to:
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <FormLabel>Assign To</FormLabel>
            <RadioGroup>
              {employees.filter(emp => emp.role === 'ResponsibleEngineer').map((employee) => (
                <FormControlLabel
                  key={employee.id}
                  value={employee.name}
                  control={<Radio />}
                  label={`${employee.name} - ${employee.department}`}
                  onClick={() => handleObservationAssignment(employee.name)}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowObservationDialog(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConductAudit;