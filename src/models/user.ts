import mongoose, { Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator';
const validRole = {
  values: ['ADMIN_ROLE','USER_ROLE'],
  message: '{VALUE} is not a valid role'
}


interface User extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  /* img? is optional */
  img?: string;
  role: string;
  /* services: { facebok?:boolean;google?:boolean}; */
  facebook?:boolean;
  google?:boolean;
  createAt: Date;
  state: boolean
}

const userSchema = new Schema({
  name: {type:  String},
  email:  {type:  String},
  password: {type:  String},
  img:  {type:  String,default:'https://res.cloudinary.com/dqhme1rod/image/upload/v1657230171/xfzbvm7rlpapsoa0dndm.png'},
  role: {type:  String, enum: validRole, default: 'ADMIN_ROLE'},
  /* services: {
    facebook: { type:Boolean, default:false},
    google: { type:Boolean,default:false }
  }, */
  facebook: {type: Boolean, default:false},
  google: {type: Boolean, default:false},
  createAt: {type:  Date, default: Date.now()},
  state:  {type:  Boolean, default: true},
},{versionKey:false})

userSchema.plugin(uniqueValidator);


userSchema.methods.toJSON = function(){
  const { password, ...user } = this.toObject();
  return user;
}

const User = mongoose.model('User',userSchema);

export default User; 
