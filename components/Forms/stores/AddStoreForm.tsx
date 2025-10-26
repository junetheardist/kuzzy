import React, { useState, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '../../ui/Button';
import {
  StoreInfoStep,
  OwnerInfoStep,
  CertificationStep,
  GalleryStep,
} from '@/components/Forms/stores/storeformsteps';

interface AddStoreFormProps {
  onClose: () => void;
}

const steps = [
  { id: 1, name: 'Store Info' },
  { id: 2, name: 'Owner Info' },
  { id: 3, name: 'Certification' },
  { id: 4, name: 'Gallery' },
];

const totalFields = 15; // Approximate total fields for progress calculation

export const AddStoreForm: React.FC<AddStoreFormProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const methods = useForm({
    // You can add defaultValues here if needed
  });
  const { handleSubmit, watch } = methods;

  const onSubmit = (data: any) => {
    console.log('Saving Store Data (Incomplete or Complete):', data);
    // Here you would typically handle the form submission, e.g., API call.
    // The data is saved regardless of which step the user is on.
    onClose();
  };

  const watchedValues = watch();
  const filledFields = useMemo(() => {
    return Object.values(watchedValues).filter(
      (value) => value !== '' && value !== undefined && value !== null
    ).length;
  }, [watchedValues]);

  const progress = Math.round((filledFields / totalFields) * 100);

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        {/* Progress Indicator */}
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">
            Profile Completion: {progress}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {steps.map((step) => (
              <Button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(step.id)}
                variant="ghost"
                className={`whitespace-nowrap !rounded-b-none border-b-2 ${
                  currentStep === step.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300'
                }`}
              >
                {step.name}
              </Button>
            ))}
          </nav>
        </div>

        {/* Form Content */}
        <div className="min-h-[300px]">
          {currentStep === 1 && <StoreInfoStep />}
          {currentStep === 2 && <OwnerInfoStep />}
          {currentStep === 3 && <CertificationStep />}
          {currentStep === 4 && <GalleryStep />}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="button" onClick={handleSubmit(onSubmit)}>Save</Button>
        </div>
      </div>
    </FormProvider>
  );
};