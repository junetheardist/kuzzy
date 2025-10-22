// stepSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type Step =
    | 'shopInfo'
    | 'ownerInfo'
    | 'certification'
    | 'gallery';

interface StepState {
    currentStep: Step;
}

const initialState: StepState = {
    currentStep: 'shopInfo',
};

const stepSlice = createSlice({
    name: 'step',
    initialState,
    reducers: {
        goToStep(state, action: PayloadAction<Step>) {
            state.currentStep = action.payload;
        },
        nextStep(state) {
            const steps: Step[] = ['shopInfo', 'ownerInfo', 'certification', 'gallery'];
            const idx = steps.indexOf(state.currentStep);
            if (idx < steps.length - 1) {
                state.currentStep = steps[idx + 1];
            }
        },
        prevStep(state) {
            const steps: Step[] = ['shopInfo', 'ownerInfo', 'certification', 'gallery'];
            const idx = steps.indexOf(state.currentStep);
            if (idx > 0) {
                state.currentStep = steps[idx - 1];
            }
        },
    },
});

export const {goToStep, nextStep, prevStep} = stepSlice.actions;
export default stepSlice.reducer;
