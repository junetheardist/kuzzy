import React, {useState} from 'react';
import {useFormContext} from 'react-hook-form';
import {Input} from '@/components/ui/input';
import {AddressAutocomplete} from '@/components/Forms/AddressAutocomplete';
import {FileUpload} from '@/components/Forms/FileUpload';
import {useGeolocation} from '@/hooks/useGeolocation';

// --- StoreInfoStep ---
export const StoreInfoStep = () => {
    const {register, formState: {errors}, setValue, watch} = useFormContext();
    const {loading: geoLoading, error: geoError, getLocation} = useGeolocation();
    const [shopGeoMessage, setShopGeoMessage] = useState<string | null>(null);
    const [shopAddressQuery, setShopAddressQuery] = useState('');

    const handleGetShopLocation = async () => {
        setShopGeoMessage(null);
        const addressData = await getLocation();

        if (addressData) {
            // Populate all shop address fields
            setValue('shopAddress.street', addressData.street);
            setValue('shopAddress.city', addressData.city);
            setValue('shopAddress.state', addressData.state);
            setValue('shopAddress.country', addressData.country);
            setValue('shopAddress.postalCode', addressData.postalCode);
            setValue('shopAddress.latitude', addressData.latitude);
            setValue('shopAddress.longitude', addressData.longitude);

            setShopGeoMessage(`✅ Location set: ${addressData.street}, ${addressData.city}`);

            // Clear message after 3 seconds
            setTimeout(() => setShopGeoMessage(null), 3000);
        } else if (geoError) {
            setShopGeoMessage(`❌ ${geoError}`);
        }
    };

    const handleShopAddressSuggestion = (suggestion: any) => {
        // Parse the suggestion and populate address fields
        const parts = (suggestion.place_name || suggestion.text).split(',').map((p: string) => p.trim());

        setValue('shopAddress.street', parts[0] || '');
        if (parts.length > 1) setValue('shopAddress.city', parts[1]);
        if (parts.length > 2) setValue('shopAddress.state', parts[2]);
        if (parts.length > 3) setValue('shopAddress.country', parts[3]);

        // Set coordinates from suggestion
        if (suggestion.geometry?.coordinates) {
            const [lng, lat] = suggestion.geometry.coordinates;
            setValue('shopAddress.longitude', lng);
            setValue('shopAddress.latitude', lat);
        }
    };

    return (
        <div className="space-y-4 relative ">
            <div>
                <Input
                    label="Store Name *"
                    {...register('storeName', {required: 'Store name is required'})}
                    aria-invalid={errors.storeName ? 'true' : 'false'}
                />
                {errors.storeName && <p className="text-red-500 text-xs mt-1">{(errors.storeName as any).message}</p>}
            </div>

            <Input label="Store Email Address" type="email" {...register('storeEmail')} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Primary Phone" {...register('storePrimaryPhone')} />
                <Input label="Secondary Phone" {...register('storeSecondaryPhone')} />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sales Type *</label>
                <select
                    {...register('saleType', {required: 'Sales type is required'})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option value="">Select sales type...</option>
                    <option value="retail">Retail</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="both">Both</option>
                </select>
                {(errors.saleType as any)?.message && (
                    <p className="text-red-500 text-xs mt-1">{(errors.saleType as any).message}</p>
                )}
            </div>

            <h3 className="text-md font-semibold text-gray-800 pt-2 border-t mt-6">Shop Address</h3>

            {/* Address Autocomplete with Generate Button */}
            <AddressAutocomplete
                label="Search Address"
                placeholder="Type to search for address..."
                value={shopAddressQuery}
                onChange={setShopAddressQuery}
                onSelectSuggestion={handleShopAddressSuggestion}
                onGenerateLocation={handleGetShopLocation}
                isGenerating={geoLoading}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Street *"
                    {...register('shopAddress.street', {required: 'Street is required'})}
                    aria-invalid={(errors.shopAddress as any)?.street ? 'true' : 'false'}
                />
                <Input
                    label="City *"
                    {...register('shopAddress.city', {required: 'City is required'})}
                    aria-invalid={(errors.shopAddress as any)?.city ? 'true' : 'false'}
                />
                <Input
                    label="State *"
                    {...register('shopAddress.state', {required: 'State is required'})}
                    aria-invalid={(errors.shopAddress as any)?.state ? 'true' : 'false'}
                />
                <Input
                    label="Country *"
                    {...register('shopAddress.country', {required: 'Country is required'})}
                    aria-invalid={(errors.shopAddress as any)?.country ? 'true' : 'false'}
                />
                <Input
                    label="Postal Code *"
                    {...register('shopAddress.postalCode', {required: 'Postal code is required'})}
                    aria-invalid={(errors.shopAddress as any)?.postalCode ? 'true' : 'false'}
                />
                <Input
                    label="Latitude"
                    type="number"
                    step="any"
                    {...register('shopAddress.latitude', {valueAsNumber: true})}
                />
                <Input
                    label="Longitude"
                    type="number"
                    step="any"
                    {...register('shopAddress.longitude', {valueAsNumber: true})}
                />
            </div>
            {errors.shopAddress && <p className="text-red-500 text-xs mt-1">Please fill all required address fields</p>}

            {shopGeoMessage && (
                <p className={`text-xs text-center ${geoError ? 'text-red-500' : 'text-green-600'}`}>
                    {shopGeoMessage}
                </p>
            )}
        </div>
    );
};

// --- OwnerInfoStep ---
export const OwnerInfoStep = () => {
    const {register, formState: {errors}, setValue} = useFormContext();
    const [ownerAddressQuery, setOwnerAddressQuery] = useState('');

    const handleOwnerAddressSuggestion = (suggestion: any) => {
        // Parse the suggestion and populate address fields
        const parts = (suggestion.place_name || suggestion.text).split(',').map((p: string) => p.trim());

        setValue('ownerAddress.street', parts[0] || '');
        if (parts.length > 1) setValue('ownerAddress.city', parts[1]);
        if (parts.length > 2) setValue('ownerAddress.state', parts[2]);
        if (parts.length > 3) setValue('ownerAddress.country', parts[3]);
    };

    return (
        <div className="space-y-4">
            <div>
                <Input
                    label="Owner Name *"
                    {...register('ownerName', {required: 'Owner name is required'})}
                    aria-invalid={errors.ownerName ? 'true' : 'false'}
                />
                {errors.ownerName && <p className="text-red-500 text-xs mt-1">{(errors.ownerName as any).message}</p>}
            </div>

            <Input label="Owner Email Address" type="email" {...register('ownerEmail')} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Owner's Primary Phone" {...register('ownerPrimaryPhone')} />
                <Input label="Owner's Secondary Phone" {...register('ownerSecondaryPhone')} />
            </div>

            <h3 className="text-md font-semibold text-gray-800 pt-2 border-t mt-6">Owner Address</h3>

            {/* Address Autocomplete */}
            <AddressAutocomplete
                label="Search Address"
                placeholder="Type to search for address..."
                value={ownerAddressQuery}
                onChange={setOwnerAddressQuery}
                onSelectSuggestion={handleOwnerAddressSuggestion}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Street"
                    {...register('ownerAddress.street')}
                />
                <Input
                    label="City"
                    {...register('ownerAddress.city')}
                />
                <Input
                    label="State"
                    {...register('ownerAddress.state')}
                />
                <Input
                    label="Country"
                    {...register('ownerAddress.country')}
                />
            </div>
        </div>
    );
};

// --- CertificationStep ---
export const CertificationStep = () => {
    const {register} = useFormContext();

    return (
        <div className="space-y-6">
            <Input label="Official Business Name" {...register('officialBusinessName')} />
            <Input label="CAC Number" {...register('cacNumber')} />

            <FileUpload label="CAC Document" {...register('cacDocFile')} />
        </div>
    );
};

// --- GalleryStep ---
export const GalleryStep = () => {
    const {register} = useFormContext();

    return (
        <div className="space-y-6">
            <FileUpload label="Shop Photos and Videos" {...register('gallery')} multiple/>
        </div>
    );
};
