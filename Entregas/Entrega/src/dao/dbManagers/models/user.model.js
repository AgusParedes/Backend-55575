import mongoose from 'mongoose';

const usersCollection = 'users';

const usersSchema = new mongoose.Schema({
   first_name: {
      type: String,
      required: true
   },
   last_name: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true,
      unique: true
   },
   password: {
      type: String,
      required: true
   },
   role: {
      type: String,
      required: true,
      default: 'user'
   },
   cart: {
         type: mongoose.Schema.Types.ObjectId,
         ref : "carts"
   },
   age: {
      type: Number,
      require: true,
   },
   last_connection: {
      type: Date,
      default: Date.now
   }
});

export const usersModel = mongoose.model(usersCollection, usersSchema);
