import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import {goToStep, nextStep, prevStep} from "@/redux/stepSlice";
import ShopInfoComponent from "@/components/dashboard/ShopInfoComponent";
import OwnerInfoComponent from "@/components/dashboard/OwnerInfoComponent";
import CertificationComponent from "@/components/dashboard/CertificationComponent";
import GalleryComponent from "@/components/dashboard/GalleryComponent";
// import { RootState, AppDispatch } from "../store";
// import { nextStep, prevStep, goToStep } from "../stepSlice";

export default function MultiStepNav() {
    const dispatch = useDispatch<AppDispatch>();
    const currentStep = useSelector((state: RootState) => state.step.currentStep);

    const tabNames = [
        {name: "Shop info", value: "shopInfo"},
        {name: "Owner info", value: "ownerInfo"},
        {name: "Certification", value: "certification"},
        {name: "Gallery", value: "gallery"},
    ];

    const renderComponent = () => {
        switch (currentStep) {
            case "shopInfo":
                return <ShopInfoComponent/>;
            case "ownerInfo":
                return <OwnerInfoComponent/>;
            case "certification":
                return <CertificationComponent/>;
            case "gallery":
                return <GalleryComponent/>;
            default:
        }
    }

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
