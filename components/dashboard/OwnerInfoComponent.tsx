import React, {ChangeEvent} from "react";

interface Props {
    form: any;
    handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function OwnerInfoComponent({form, handleChange}: Props) {
    return (
        <div className="flex flex-col gap-4">
            <input name="ownerName" value={form.ownerName} onChange={handleChange} placeholder="Owner Name"/>
            <input name="ownerEmail" value={form.ownerEmail} onChange={handleChange} placeholder="Owner Email"/>
            <input name="ownerAddress" value={form.ownerAddress} onChange={handleChange} placeholder="Owner Address"/>
            <input name="ownerPrimaryPhoneNumber" value={form.ownerPrimaryPhoneNumber} onChange={handleChange}
                   placeholder="Primary Phone"/>
            <input name="ownerSecondaryPhoneNumber" value={form.ownerSecondaryPhoneNumber} onChange={handleChange}
                   placeholder="Secondary Phone"/>
            <input name="ownerDiscount" type="number" value={form.ownerDiscount} onChange={handleChange}
                   placeholder="Owner Discount %"/>
        </div>
    );
}
