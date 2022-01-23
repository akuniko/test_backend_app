import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

export interface UserDocument extends Document {
    username: string;
    password: string;
}

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    }
});

UserSchema.plugin(passportLocalMongoose, {
    usernameUnique: true,
    saltField: 'salt'
});
export default mongoose.model<UserDocument>('User', UserSchema);
