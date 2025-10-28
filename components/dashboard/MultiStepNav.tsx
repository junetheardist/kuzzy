import React, {ChangeEvent, FormEvent, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import {goToStep, nextStep, prevStep} from "@/redux/stepSlice";
import ShopInfoComponent from "@/components/dashboard/ShopInfoComponent";
import OwnerInfoComponent from "@/components/dashboard/OwnerInfoComponent";
import CertificationComponent from "@/components/dashboard/CertificationComponent";
import GalleryComponent from "@/components/dashboard/GalleryComponent";
import {createVendor} from "@/redux/vendorSlice";
import {useAppSelector} from "@/redux/hooks";
import Cookies from "js-cookie";
// import { RootState, AppDispatch } from "../store";
// import { nextStep, prevStep, goToStep } from "../stepSlice";

export default function MultiStepNav() {
    const dispatch = useDispatch<AppDispatch>();
    const currentStep = useSelector((state: RootState) => state.step.currentStep);

    const {loading, error, vendor} = useAppSelector((s) => s.vendor);

    const [form, setForm] = useState({
        userId: "",
        shopName: "",
        shopAddress: "",
        shopEmail: "",
        shopPrimaryPhoneNumber: "",
        shopSecondaryPhoneNumber: "",
        saleType: "",
        discount: 0,
        ownerName: "",
        ownerAddress: "",
        ownerEmail: "",
        ownerPrimaryPhoneNumber: "",
        ownerSecondaryPhoneNumber: "",
        ownerDiscount: 0,
        businessAccountName: "",
        officialBusinessName: "",
        cacNumber: "",
    });

    const [cacDocFile, setCacDocFile] = useState<File | null>(null);
    const [gallery, setGallery] = useState<File[]>([]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setForm((prev) => ({
            ...prev,
            [name]:
                name === "discount" || name === "ownerDiscount" ? Number(value) : value,
        }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setCacDocFile(e.target.files[0]);
        }
    };

    const handleGalleryChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setGallery(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const userId = Cookies.get("kuzzy-id");

        // Convert to a form data payload (especially if handling files)
        const payload = {
            ...form,
            cacDocFile: cacDocFile ? cacDocFile.name : undefined,
            gallery: gallery.map((f) => f.name),
            userId: userId!,
        };

        try {
            await dispatch(createVendor(payload)).unwrap();
            alert("Vendor created successfully!");
        } catch (err: any) {
            console.error("Vendor creation failed:", err);
        }
    };

    const tabNames = [
        {name: "Shop info", value: "shopInfo"},
        {name: "Owner info", value: "ownerInfo"},
        {name: "Certification", value: "certification"},
        {name: "Gallery", value: "gallery"},
    ];

    const renderComponent = () => {
        switch (currentStep) {
            case "shopInfo":
                return <ShopInfoComponent form={form} handleChange={handleChange}/>;
            case "ownerInfo":
                return <OwnerInfoComponent form={form} handleChange={handleChange}/>;
            case "certification":
                return <CertificationComponent form={form} handleChange={handleChange}
                                               handleFileChange={handleFileChange}/>;
            case "gallery":
                return <GalleryComponent handleGalleryChange={handleGalleryChange} gallery={gallery}
                                         handleSubmit={handleSubmit} loading={loading} error={error}/>;
            default:
                return null;
        }
    };
    return (
        <div className={'h-full w-full'}>
            <div className={'gap-4 flex items-center justify-center'}>
                {tabNames.map((tab) => (
                    <button
                        key={tab.value}
                        disabled={currentStep === tab.value}
                        onClick={() => dispatch(goToStep(tab.value as any))}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>
            <div>
                <button onClick={() => dispatch(prevStep())}>Previous</button>
                <button onClick={() => dispatch(nextStep())}>Next</button>
            </div>
            <div className={'h-full w-full flex-1 '}>{renderComponent()}</div>
        </div>
    );
}
