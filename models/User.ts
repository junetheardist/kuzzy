import mongoose, {models, Schema} from 'mongoose';

const UserSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isVerified: {type: Boolean, default: false},
    otp: {type: String},
    otpExpiry: {type: Date},
    resetToken: {type: String},
    resetTokenExpiry: {type: Date},
    createdAt: {type: Date, default: Date.now},


    //Vendor schema
    shopName: {type: String},
    shopAddress: {type: String},
    shopEmail: {type: String},
    shopPrimaryPhoneNumber: {type: String},
    shopSecondaryPhoneNumber: {type: String},
    saleType: {type: String},
    discount: {type: String},

    ownerName: {type: String},
    ownerAddress: {type: String},
    ownerEmail: {type: String},
    ownerPrimaryPhoneNumber: {type: String},
    ownerSecondaryPhoneNumber: {type: String},
    ownerDiscount: {type: String},
    businessAccountName: {type: String},

    officialBusinessName: {type: String},
    cacNumber: {type: String},
    cacDocFile: {type: String},
    gallery: [
        {type: String},
    ]


});

export const User = models.User || mongoose.model('User', UserSchema);
