import mongoose from 'mongoose';
import { isEmail } from 'validator';
import passportLocalMongoose from 'passport-local-mongoose';

// import bcrypt from 'bcrypt';

let Schema = mongoose.Schema;

let UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    displayName: String  
});

// whitelist (remove hash & salt)
UserSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        var retJson = {
            _id: ret._id,
            email: ret.email,
            username: ret.username,
        };
        //console.log('getting transformed user data', ret);
        return retJson;
    }
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);

export {User, UserSchema};