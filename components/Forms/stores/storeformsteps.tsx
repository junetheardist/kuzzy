import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { FileUpload } from '@/components/Forms/FileUpload';

// --- StoreInfoStep ---
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

// --- OwnerInfoStep ---
export const OwnerInfoStep = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-4">
      <Input label="Owner Name" {...register('owner.name')} />
      <Input label="Owner Email Address" type="email" {...register('owner.email')} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Owner's Primary Phone" {...register('owner.primaryPhone')} />
        <Input label="Owner's Secondary Phone" {...register('owner.secondaryPhone')} />
      </div>

      <h3 className="text-md font-semibold text-gray-800 pt-2 border-t mt-6">Owner Address</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Street" {...register('owner.address.street')} />
        <Input label="City" {...register('owner.address.city')} />
        <Input label="State" {...register('owner.address.state')} />
      </div>

      <Input label="Owner Discount" type="number" {...register('owner.discount', { valueAsNumber: true })} />
      <Input label="Business Bank Account Number" {...register('owner.bankAccountNumber')} />
    </div>
  );
};

// --- CertificationStep ---
export const CertificationStep = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      <Input label="Official Business Name" {...register('certification.businessName')} />
      <Input label="CAC Number" {...register('certification.cacNumber')} />

      <FileUpload label="Certificate of Incorporation" {...register('certification.incorporationCertificate')} />
      <FileUpload label="Status Report" {...register('certification.statusReport')} />
    </div>
  );
};

// --- GalleryStep ---
export const GalleryStep = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      <FileUpload label="Shop Photos and Videos" {...register('gallery.files')} multiple />
    </div>
  );
};