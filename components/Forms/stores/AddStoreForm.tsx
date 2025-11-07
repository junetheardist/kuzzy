import React, {useMemo, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {Button} from '@/components/ui/Button';
import {CertificationStep, GalleryStep, OwnerInfoStep, StoreInfoStep,} from './StoreFormSteps';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import {createVendor, fetchVendors} from '@/redux/vendorSlice';

// Alert component for error/success messages
const Alert = ({message, type}: { message: string; type: 'error' | 'success' }) => (
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

interface AddStoreFormProps {
    onClose: () => void;
}

const steps = [
    {id: 1, name: 'Store Info'},
    {id: 2, name: 'Owner Info'},
    {id: 3, name: 'Certification'},
    {id: 4, name: 'Gallery'},
];

const totalFields = 15; // Approximate total fields for progress calculation

export const AddStoreForm: React.FC<AddStoreFormProps> = ({onClose}) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [addAnother, setAddAnother] = useState(false); // Track if user wants to add another store

    const methods = useForm({
        mode: 'onChange', // Enable real-time validation
        // You can add defaultValues here if needed
    });
    const {handleSubmit, watch, reset, formState: {errors: formErrors}} = methods;
    const dispatch = useAppDispatch();
    const {userId} = useAppSelector(state => state.auth);

    const onSubmit = async (data: any) => {
        // Clear previous messages
        setError(null);
        setSuccess(false);

        // Validate userId
        if (!userId) {
            const errorMsg = 'User ID is required. Please log in again.';
            setError(errorMsg);
            console.error(errorMsg);
            return;
        }

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

        console.log('Saving Store Data (Incomplete or Complete):', data);

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
            cacDocFile: data.cacDocFile,
            // Gallery
            gallery: data.gallery || [],
            // Metadata
            isActive: true,
        };

        const vendorData = {
            userId,
            stores: [storeData] // Add as first/additional store
        };

        console.log(vendorData)

        const dataF = {
            ...vendorData.stores[0],
            cacDocFile: "",
            gallery: [],
            userId: vendorData.userId,
        }

        console.log("daf", dataF);

        try {
            setIsLoading(true);
            await dispatch(createVendor(dataF as any)).unwrap();

            // Success!
            setSuccess(true);
            setIsLoading(false);

            if (addAnother) {
                // Reset form to add another store
                setTimeout(() => {
                    reset();
                    setCurrentStep(1);
                    setSuccess(false);
                    setAddAnother(false);
                }, 1500);
            } else {
                // Close form after adding store
                setTimeout(() => {
                    dispatch(fetchVendors()); // Re-fetch vendors to update the list
                    reset();
                    onClose();
                }, 2000);
            }
        } catch (error: any) {
            setIsLoading(false);
            const errorMsg = error?.payload?.error || error?.message || 'Failed to add vendor. Please try again.';
            setError(errorMsg);
            console.error('Failed to add vendor:', error);
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
                {error && <Alert message={error} type="error"/>}
                {success && <Alert message="Vendor profile created successfully!" type="success"/>}

                {/* Progress Indicator */}
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                        Profile Completion: {progress}%
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                            style={{width: `${progress}%`}}
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
                    {currentStep === 1 && <StoreInfoStep/>}
                    {currentStep === 2 && <OwnerInfoStep/>}
                    {currentStep === 3 && <CertificationStep/>}
                    {currentStep === 4 && <GalleryStep/>}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between gap-4 pt-4 border-t">
                    <div>
                        {success && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    reset();
                                    setSuccess(false);
                                    setCurrentStep(1);
                                    setAddAnother(false);
                                }}
                            >
                                Add Another Store
                            </Button>
                        )}
                    </div>
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
                            {isLoading ? 'Saving...' : success ? 'Saved!' : 'Save'}
                        </Button>
                    </div>
                </div>
            </div>
        </FormProvider>
    );
};
