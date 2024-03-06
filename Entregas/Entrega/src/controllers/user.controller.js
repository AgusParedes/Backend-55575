import { ChangeUserRole as ChangeUserRoleService,
         GetUsers as GetUsersService,
         DeleteUser as DeleteUserService,
         CleanInactiveUsers as CleanInactiveUsersService } from "../services/user.service.js";
import CustomError from '../Errors/CustomError.js';
import EErrors from '../Errors/enums.js';
import Users from '../dao/dbManagers/users.manager.js';

const userDao = new Users();

const ChangeUserRole = async (req, res) => {
   try {
      const { uid } = req.params;
      const userRole = req.user.role; 
      if (userRole !== 'admin') {
         throw CustomError.createError({
            name: 'UserError',
            cause: 'Permission denied',
            message: 'You are not allowed to change user roles',
            code: EErrors.PERMISSION_DENIED
         });
      }
      const updatedUser = await ChangeUserRoleService(uid);
      res.send({ status: 'success', payload: updatedUser });
   } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
      req.logger.error(error.message);
   }
}

const GetUsers = async (req, res) => {
   try {
      const users = await GetUsersService();
      res.send({ status: 'success', payload: users });
   } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
      req.logger.error(error.message);
   }
}

const RenderEditUsers = async (req, res) => {
   try {
      const users = await userDao.getAll();
      res.render('editUsers', { users });
      console.log(req.user)
   } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
      req.logger.error(error.message);
   }
}

const DeleteUser = async (req, res) => {
   try {
      const userId = req.params.uid
      const result = await DeleteUserService(userId);
      res.send({ status: 'success', payload: result });
   } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
      req.logger.error(error.message);
   }
}

const CleanInactiveUsers = async (req, res) => {
   try {
      await CleanInactiveUsersService();
      res.send({ status: 'success', message: 'Usuarios inactivos eliminados correctamente' });
   } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
      req.logger.error(error.message);
   }
}

export { ChangeUserRole,
         GetUsers,
         RenderEditUsers,
         DeleteUser,
         CleanInactiveUsers};
