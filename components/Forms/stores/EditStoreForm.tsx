import React, { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { CertificationStep, GalleryStep, OwnerInfoStep, StoreInfoStep } from './StoreFormSteps';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Vendor, updateVendor, fetchVendors } from '@/redux/vendorSlice';

// Alert component for error/success messages
const Alert = ({ message, type }: { message: string; type: 'error' | 'success' }) => (
    <div
        className={`p-4 rounded-md text-sm font-medium ${
            type === 'error'
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-green-50 text-green-800 border border-green-200'
        }`}
    >
        {message}
    </div>
);

interface EditStoreFormProps {
    store: Vendor;
    onClose: () => void;
}

const steps = [
    { id: 1, name: 'Store Info' },
    { id: 2, name: 'Owner Info' },
    { id: 3, name: 'Certification' },
    { id: 4, name: 'Gallery' },
];

const totalFields = 15; // Approximate total fields for progress calculation

export const EditStoreForm: React.FC<EditStoreFormProps> = ({ store, onClose }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const methods = useForm({
        mode: 'onChange',
        defaultValues: {
            storeName: store.shopName || '',
            storeEmail: store.shopEmail || '',
            storePrimaryPhone: store.shopPrimaryPhoneNumber || '',
            storeSecondaryPhone: store.shopSecondaryPhoneNumber || '',
            saleType: store.saleType || '',
            shopAddress: {
                street: (store.shopAddress as any)?.street || '',
                city: (store.shopAddress as any)?.city || '',
                state: (store.shopAddress as any)?.state || '',
                country: (store.shopAddress as any)?.country || '',
                postalCode: (store.shopAddress as any)?.postalCode || '',
                latitude: (store.shopAddress as any)?.latitude || '',
                longitude: (store.shopAddress as any)?.longitude || '',
            },
            ownerName: store.ownerName || '',
            ownerEmail: store.ownerEmail || '',
            ownerPrimaryPhone: store.ownerPrimaryPhoneNumber || '',
            ownerSecondaryPhone: store.ownerSecondaryPhoneNumber || '',
            ownerAddress: {
                street: (store.ownerAddress as any)?.street || '',
                city: (store.ownerAddress as any)?.city || '',
                state: (store.ownerAddress as any)?.state || '',
                country: (store.ownerAddress as any)?.country || '',
            },
            officialBusinessName: store.officialBusinessName || '',
            cacNumber: store.cacNumber || '',
            cacDocFile: store.cacDocFile || '',
            gallery: store.gallery || [],
        },
    });

    const { handleSubmit, watch, reset, formState: { errors: formErrors } } = methods;
    const dispatch = useAppDispatch();
    const { userId } = useAppSelector(state => state.auth);

    const onSubmit = async (data: any) => {
        // Clear previous messages
        setError(null);
        setSuccess(false);

        // Validate required fields
        if (!data.storeName) {
            const errorMsg = 'Store name is required';
            setError(errorMsg);
            return;
        }

        if (!data.shopAddress?.street || !data.shopAddress?.city || !data.shopAddress?.state || !data.shopAddress?.country || !data.shopAddress?.postalCode) {
            const errorMsg = 'All shop address fields are required';
            setError(errorMsg);
            return;
        }

        if (!data.ownerName) {
            const errorMsg = 'Owner name is required';
            setError(errorMsg);
            return;
        }

        if (!userId) {
            const errorMsg = 'User ID not found. Please log in again.';
            setError(errorMsg);
            return;
        }

        console.log('Updating Store Data:', data);

        // Transform form data to match API schema
        const storeData = {
            // Shop details
            shopName: data.storeName,
            shopAddress: data.shopAddress,
            shopEmail: data.storeEmail,
            shopPrimaryPhoneNumber: data.storePrimaryPhone,
            shopSecondaryPhoneNumber: data.storeSecondaryPhone,
            saleType: data.saleType,
            // Owner details
            ownerName: data.ownerName,
            ownerAddress: data.ownerAddress,
            ownerEmail: data.ownerEmail,
            ownerPrimaryPhoneNumber: data.ownerPrimaryPhone,
            ownerSecondaryPhoneNumber: data.ownerSecondaryPhone,
            // Business registration
            officialBusinessName: data.officialBusinessName,
            cacNumber: data.cacNumber,
            cacDocFile: data.cacDocFile || '',
            // Gallery
            gallery: data.gallery || [],
        };

        try {
            setIsLoading(true);
            const updateData = {
                userId: userId,
                shopName: storeData.shopName,
                shopAddress: storeData.shopAddress,
                shopEmail: storeData.shopEmail,
                shopPrimaryPhoneNumber: storeData.shopPrimaryPhoneNumber,
                shopSecondaryPhoneNumber: storeData.shopSecondaryPhoneNumber,
                saleType: storeData.saleType,
                ownerName: storeData.ownerName,
                ownerAddress: storeData.ownerAddress,
                ownerEmail: storeData.ownerEmail,
                ownerPrimaryPhoneNumber: storeData.ownerPrimaryPhoneNumber,
                ownerSecondaryPhoneNumber: storeData.ownerSecondaryPhoneNumber,
                officialBusinessName: storeData.officialBusinessName,
                cacNumber: storeData.cacNumber,
                cacDocFile: storeData.cacDocFile || '',
                gallery: storeData.gallery || [],
            };

            await dispatch(updateVendor(updateData as any)).unwrap();

            // Success!
            setSuccess(true);
            setIsLoading(false);

            // Close form after updating store
            setTimeout(() => {
                dispatch(fetchVendors()); // Re-fetch vendors to update the list
                onClose();
            }, 2000);
        } catch (error: any) {
            setIsLoading(false);
            const errorMsg = error?.payload?.error || error?.message || 'Failed to update store. Please try again.';
            setError(errorMsg);
            console.error('Failed to update store:', error);
        }
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
                {/* Error/Success Messages */}
                {error && <Alert message={error} type="error" />}
                {success && <Alert message="Store updated successfully!" type="success" />}

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
                                className={`whitespace-nowrap rounded-b-none! border-b-2 ${
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
                <div className="flex justify-between gap-4 pt-4 border-t">
                    <div></div>
                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                if (currentStep < steps.length) {
                                    setCurrentStep(currentStep + 1);
                                }
                            }}
                            disabled={isLoading || currentStep === steps.length || success}
                        >
                            {currentStep === steps.length ? 'Done' : 'Next'}
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSubmit(onSubmit)}
                            disabled={isLoading || success}
                            className={isLoading ? 'opacity-70 cursor-wait' : ''}
                        >
                            {isLoading ? 'Saving...' : success ? 'Saved!' : 'Save Changes'}
                        </Button>
                    </div>
                </div>
            </div>
        </FormProvider>
    );
};
