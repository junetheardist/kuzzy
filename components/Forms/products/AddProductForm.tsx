import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/Forms/FileUpload';

interface AddProductFormProps {
  onClose: () => void;
}

export const AddProductForm: React.FC<AddProductFormProps> = ({ onClose }) => {
  const methods = useForm();
  const { register, handleSubmit, formState: { errors } } = methods;

  const onSubmit = (data: any) => {
    console.log('New Product Data:', data);
    // Here you would typically handle the form submission, e.g., API call.
    onClose();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Product Name"
          {...register('name', { required: 'Product name is required' })}
        />
        {errors.name && <p className="text-red-500 text-xs">{(errors.name as any).message}</p>}

        <Input label="Category" {...register('category', { required: 'Category is required' })} />
        {errors.category && <p className="text-red-500 text-xs">{(errors.category as any).message}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Price" type="number" {...register('price', { required: 'Price is required', valueAsNumber: true })} />
          <Input label="Stock" type="number" {...register('stock', { required: 'Stock is required', valueAsNumber: true })} />
        </div>

        <FileUpload label="Product Image" {...register('imageUrl')} />

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Add Product</Button>
        </div>
      </form>
    </FormProvider>
  );
};