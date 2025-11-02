import React, {useState} from 'react';
import {useFormContext} from 'react-hook-form';
import {Input} from '@/components/ui/input';
import {Select} from '@/components/ui/Select';
import {useGeolocation} from '@/hooks/useGeolocation';

export const StoreInfoStep = () => {
    const {register, formState: {errors}, setValue} = useFormContext();
    const {loading, error: geoError, getLocation} = useGeolocation();
    const [geolocationMessage, setGeolocationMessage] = useState<string | null>(null);

    const handleGetCurrentLocation = async () => {
        setGeolocationMessage(null);
        const addressData = await getLocation();

        if (addressData) {
            // Populate all address fields
            setValue('address.street', addressData.street);
            setValue('address.city', addressData.city);
            setValue('address.state', addressData.state);
            setValue('address.country', addressData.country);
            setValue('address.postalCode', addressData.postalCode);
            setValue('address.latitude', addressData.latitude);
            setValue('address.longitude', addressData.longitude);

            setGeolocationMessage(`✅ Location set: ${addressData.street}, ${addressData.city}`);

            // Clear message after 3 seconds
            setTimeout(() => setGeolocationMessage(null), 3000);
        } else if (geoError) {
            setGeolocationMessage(`❌ ${geoError}`);
        }
    };

    return (
        <div className="space-y-4">
            <Input
                label="Store Name"
                {...register('storeName', {required: 'Store name is required'})}
            />
            {errors.storeName && <p className="text-red-500 text-xs">{(errors.storeName as any).message}</p>}

            <Input label="Store Email Address" type="email" {...register('storeEmail')} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Primary Phone" {...register('storePrimaryPhone')} />
                <Input label="Secondary Phone" {...register('storeSecondaryPhone')} />
            </div>

            <h3 className="text-md font-semibold text-gray-800 pt-2 border-t mt-6">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Street *" {...register('address.street', {required: 'Street is required'})} />
                <Input label="City *" {...register('address.city', {required: 'City is required'})} />
                <Input label="State *" {...register('address.state', {required: 'State is required'})} />
                <Input label="Country *" {...register('address.country', {required: 'Country is required'})} />
                <Input
                    label="Postal Code *" {...register('address.postalCode', {required: 'Postal code is required'})} />
                <Input label="Latitude" type="number"
                       step="any" {...register('address.latitude', {valueAsNumber: true})} />
                <Input label="Longitude" type="number"
                       step="any" {...register('address.longitude', {valueAsNumber: true})} />
            </div>

            <div className="space-y-2">
                <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-gray-100 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                    {loading ? 'Getting Location...' : '📍 Use Current Location'}
                </button>
                {geolocationMessage && (
                    <p className={`text-xs text-center ${geoError ? 'text-red-500' : 'text-green-600'}`}>
                        {geolocationMessage}
                    </p>
                )}
            </div>

            <Select label="Sales Type" {...register('salesType')}>
                <option value="retail">Retail</option>
                <option value="wholesale">Wholesale</option>
                <option value="both">Both</option>
            </Select>
            <Input label="Discount Amount" type="number" {...register('discount', {valueAsNumber: true})} />
        </div>
    );
};
