import { usersModel } from '../dao/dbManagers/models/user.model.js'; 
import CustomError from '../Errors/CustomError.js';
import EErrors from '../Errors/enums.js'; 
import UserRepository from '../repositories/user.reposity.js';
import Users from '../dao/dbManagers/users.manager.js';

const userDao = new Users();
const userRepository = new UserRepository(userDao);

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

const GetUsers = async () => {
   try {
      const users = userRepository.GetAllUsers();
      return users
   } catch (error) {
      throw CustomError.createError({
         name: 'Users not found',
         cause: 'Error dont found users',
         message: `Users not found: ${error.message}`,
         code: EErrors.USER_NOT_FOUND
      });
   }
}

const updateLastConnection = async (userId, lastConnection) => {
   try {
      await userDao.updateLastConnection(userId, lastConnection);
   } catch (error) {
      throw new CustomError({
         name: 'UpdateLastConnectionError',
         message: `Error al actualizar la última conexión del usuario: ${error.message}`,
         code: EErrors.INTERNAL_SERVER_ERROR
      });
   }
}

const DeleteUser = async (userId) => {
      const result = await userRepository.DeleteUser(userId);
      return result;
}

const CleanInactiveUsers = async () => {
   try {
      const inactiveUsers = await userRepository.FindInactiveUsers(); 
      inactiveUsers.forEach(async (user) => {
         await userRepository.DeleteUser(user._id);
      });
   } catch (error) {
      throw new CustomError({
         name: 'CleanInactiveUsersError',
         message: `Error al limpiar usuarios inactivos: ${error.message}`,
         code: EErrors.INTERNAL_SERVER_ERROR
      });
   }
}

export { ChangeUserRole,
         GetUsers,
         updateLastConnection,
         DeleteUser,
         CleanInactiveUsers};
