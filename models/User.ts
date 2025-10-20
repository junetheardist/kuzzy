import mongoose, {models, Schema} from 'mongoose';

const UserSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isVerified: {type: Boolean, default: false},
    otp: {type: String},
    otpExpiry: {type: Date},
    resetToken: {type: String},
    resetTokenExpiry: {type: Date},
    createdAt: {type: Date, default: Date.now}
});

export const User = models.User || mongoose.model('User', UserSchema);
