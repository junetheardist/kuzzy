import mongoose, {models, Schema} from 'mongoose';

const AddressSchema = new Schema({
    street: {type: String},
    city: {type: String},
    state: {type: String},
    country: {type: String},
    postalCode: {type: String},
    latitude: {type: Number},
    longitude: {type: Number},
}, {_id: false});

const StoreSchema = new Schema({
    // Shop details
    shopName: {type: String, required: true},
    shopAddress: AddressSchema,
    shopEmail: {type: String},
    shopPrimaryPhoneNumber: {type: String},
    shopSecondaryPhoneNumber: {type: String},
    saleType: {type: String},
    discount: {type: String},

    // Owner details
    ownerName: {type: String},
    ownerAddress: AddressSchema,
    ownerEmail: {type: String},
    ownerPrimaryPhoneNumber: {type: String},
    ownerSecondaryPhoneNumber: {type: String},
    ownerDiscount: {type: String},
    businessAccountName: {type: String},

    // Business registration
    officialBusinessName: {type: String},
    cacNumber: {type: String},
    cacDocFile: {type: String},
    
    // Gallery
    gallery: [
        {type: String},
    ],
    
    // Metadata
    createdAt: {type: Date, default: Date.now},
    isActive: {type: Boolean, default: true},
}, {_id: true});

const UserSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isVerified: {type: Boolean, default: false},
    otp: {type: String},
    otpExpiry: {type: Date},
    resetToken: {type: String},
    resetTokenExpiry: {type: Date},
    createdAt: {type: Date, default: Date.now},

    // Multiple stores support
    stores: [StoreSchema],
    
    // Legacy single store (deprecated - kept for backwards compatibility)
    shopName: {type: String},
    shopAddress: AddressSchema,
    shopEmail: {type: String},
    shopPrimaryPhoneNumber: {type: String},
    shopSecondaryPhoneNumber: {type: String},
    saleType: {type: String},
    discount: {type: String},
    category: {type: String}, // Store category (electronics, clothing, food, etc.)

    ownerName: {type: String},
    ownerAddress: AddressSchema,
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
