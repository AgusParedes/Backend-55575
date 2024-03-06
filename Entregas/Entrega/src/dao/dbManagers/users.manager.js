import  { usersModel } from '../dbManagers/models/user.model.js'

export default class Users {
   constructor() {
      console.log('Working users with DB');
   }

   getByEmail = async (email)  => {
      const user = await usersModel.findOne({email}).lean();
      return user;
   }

   getAll = async () => {
      const users = await usersModel.find().lean();
      return users;
   }

   save = async(user) => {
      const result = await usersModel.create(user);
      return result; 
   }

   getInactiveUsers = async() => {
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      return await usersModel.find({ last_connection: { $lt: twoDaysAgo } }).lean();
   }

   delete = async(userId) => {
      return await usersModel.findByIdAndDelete(userId);
   }

   updateLastConnection = async(userId, lastConnection) => {
      return await usersModel.findByIdAndUpdate(userId, { last_connection: lastConnection });
   }

   findInactiveUsers = async() => {
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      return await usersModel.find({ last_connection: { $lt: twoDaysAgo } }).lean();
   }
} 