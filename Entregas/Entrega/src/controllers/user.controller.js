import { ChangeUserRole as ChangeUserRoleService } from "../services/user.service.js";
import CustomError from '../Errors/CustomError.js';
import EErrors from '../Errors/enums.js';

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

export { ChangeUserRole };
