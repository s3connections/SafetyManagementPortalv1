import React, { useState } from 'react';
import { ObservationFormData, ObservationType, Priority, CreateObservationDto } from '../types/Observation';
import { ObservationService } from '../services/ObservationService';
import { useNotification } from '../hooks/useNotification';
import { useAppSelector } from '../store';

interface ObservationFormProps {
  initialData?: Partial<ObservationFormData>;
  mode?: 'create' | 'edit';
  onSave?: (observation: any) => void;
  onCancel?: () => void;
}

const ObservationForm: React.FC<ObservationFormProps> = ({
  initialData = {},
  mode = 'create',
  onSave,
  onCancel,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const { showSuccess, showError } = useNotification();
  
  const [formData, setFormData] = useState<ObservationFormData>({
    title: '',
    description: '',
    observationType: ObservationType.Safety,
    priority: Priority.Medium,
    location: '',  // ✅ FIXED: Always string, not optional
    dueDate: '',
    assignedToUserId: undefined,
    plantId: undefined,
    departmentId: undefined,
    ...initialData,
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ FIXED: File handling corrected
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.; // ✅ FIXED: Use  instead of item()
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'create') {
        // Ensure observationType is defined before creating
        if (!formData.observationType) {
          throw new Error('Observation type is required');
        }

        // ✅ FIXED: Ensure location is always a string
        const createData: CreateObservationDto = {
          title: formData.title,
          description: formData.description,
          observationType: formData.observationType,
          priority: formData.priority,
          location: formData.location || '', // ✅ FIXED: Ensure it's never undefined
          dueDate: formData.dueDate,
          reportedByUserId: user?.id || 1, // Use current user ID
          assignedToUserId: formData.assignedToUserId,
          plantId: formData.plantId,
          departmentId: formData.departmentId,
        };

        const response = await ObservationService.createObservation(createData, imageFile || undefined);
        if (response.success && response.data) {
          setSuccess(`Observation created successfully! Ticket: ${response.data.ticketNumber}`);
          onSave?.(response.data);
          
          // Reset form
          setFormData({
            title: '',
            description: '',
            observationType: ObservationType.Safety,
            priority: Priority.Medium,
            location: '',
            dueDate: '',
            assignedToUserId: undefined,
            plantId: undefined,
            departmentId: undefined,
          });
          setImageFile(null);
          
          showSuccess('Success', `Observation created successfully! Ticket: ${response.data.ticketNumber}`);
        } else {
          throw new Error(response.error || 'Failed to create observation');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      showError('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {mode === 'create' ? 'Create New Observation' : 'Edit Observation'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter observation title"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe the observation in detail"
          />
        </div>

        {/* Type and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="observationType" className="block text-sm font-medium text-gray-700 mb-2">
              Type *
            </label>
            <select
              id="observationType"
              name="observationType"
              value={formData.observationType}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select type</option>
              {Object.values(ObservationType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
              Priority *
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(Priority)
                .filter(([key, value]) => typeof value === 'number')
                .map(([key, value]) => (
                <option key={value} value={value}>
                  {key} ({value})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location and Due Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter location"
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
            Attach Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {imageFile && (
            <p className="mt-2 text-sm text-gray-600">Selected: {imageFile.name}</p>
          )}
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : mode === 'create' ? 'Create Observation' : 'Update Observation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ObservationForm;