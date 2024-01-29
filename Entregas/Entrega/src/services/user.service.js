import { usersModel } from '../dao/dbManagers/models/user.model.js'; 
import CustomError from '../Errors/CustomError.js';
import EErrors from '../Errors/enums.js'; 

const ChangeUserRole = async (userId) => {
   try {
      const user = await usersModel.findById(userId);

      if (!user) {
         throw CustomError.createError({
            name: 'UserError',
            cause: 'User not found',
            message: 'User not found with the provided ID',
            code: EErrors.USER_NOT_FOUND
         });
      }

      user.role = (user.role === 'user') ? 'premium' : 'user';


      await user.save();

      return user; 
   } catch (error) {
      throw CustomError.createError({
         name: 'DatabaseError',
         cause: 'Error changing user role',
         message: `Error changing user role: ${error.message}`,
         code: EErrors.DATABASE_ERROR
      });
   }
}

export { ChangeUserRole };
