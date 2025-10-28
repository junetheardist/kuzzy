import React, {ChangeEvent} from "react";

interface Props {
    form: any;
    handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function ShopInfoComponent({form, handleChange}: Props) {
    return (
        <div className="flex flex-col gap-4">
            <input name="shopName" value={form.shopName} onChange={handleChange} placeholder="Shop Name"/>
            <input name="shopAddress" value={form.shopAddress} onChange={handleChange} placeholder="Shop Address"/>
            <input name="shopEmail" value={form.shopEmail} onChange={handleChange} placeholder="Shop Email"/>
            <input name="shopPrimaryPhoneNumber" value={form.shopPrimaryPhoneNumber} onChange={handleChange}
                   placeholder="Primary Phone"/>
            <input name="shopSecondaryPhoneNumber" value={form.shopSecondaryPhoneNumber} onChange={handleChange}
                   placeholder="Secondary Phone"/>
            <input name="saleType" value={form.saleType} onChange={handleChange} placeholder="Sale Type"/>
            <input name="discount" type="number" value={form.discount} onChange={handleChange}
                   placeholder="Discount %"/>
        </div>
    );
}
