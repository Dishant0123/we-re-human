import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { 
    type: String, 
    enum: ['volunteer', 'ngo_admin', 'platform_admin'], 
    default: 'volunteer' 
  },
  skills: [{ type: String }],
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.pre('save', async function () {
  // If password is not modified, just return and let Mongoose continue natively
  if (!this.isModified('password')) {
    return;
  }

  // Await the hashing process. If it fails, the async function automatically 
  // throws an error that Mongoose catches.
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to verify password during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;