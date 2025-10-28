import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { FileUpload } from '@/components/Forms/FileUpload';

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