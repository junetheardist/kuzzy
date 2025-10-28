import React, {ChangeEvent} from "react";

interface Props {
    form: any;
    handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function CertificationComponent({form, handleChange, handleFileChange}: Props) {
    return (
        <div className="flex flex-col gap-4">
            <input name="businessAccountName" value={form.businessAccountName} onChange={handleChange}
                   placeholder="Business Account Name"/>
            <input name="officialBusinessName" value={form.officialBusinessName} onChange={handleChange}
                   placeholder="Official Business Name"/>
            <input name="cacNumber" value={form.cacNumber} onChange={handleChange} placeholder="CAC Number"/>
            <input type="file" accept=".pdf,.jpg,.png" onChange={handleFileChange}/>
        </div>
    );
}
