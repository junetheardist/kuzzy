import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export const StoreInfoStep = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
      <Input
        label="Store Name"
        {...register('storeName', { required: 'Store name is required' })}
      />
      {errors.storeName && <p className="text-red-500 text-xs">{(errors.storeName as any).message}</p>}

      <Input label="Store Email Address" type="email" {...register('storeEmail')} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Primary Phone" {...register('storePrimaryPhone')} />
        <Input label="Secondary Phone" {...register('storeSecondaryPhone')} />
      </div>

      <h3 className="text-md font-semibold text-gray-800 pt-2 border-t mt-6">Address</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Street" {...register('address.street', { required: true })} />
        <Input label="City" {...register('address.city', { required: true })} />
        <Input label="State" {...register('address.state', { required: true })} />
      </div>

      <Select label="Sales Type" {...register('salesType')}>
        <option value="retail">Retail</option>
        <option value="wholesale">Wholesale</option>
        <option value="both">Both</option>
      </Select>
      <Input label="Discount Amount" type="number" {...register('discount', { valueAsNumber: true })} />
    </div>
  );
};