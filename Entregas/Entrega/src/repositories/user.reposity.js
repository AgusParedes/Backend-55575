import UserDto from "../DTOs/user.dto.js";
export default class UserRepository {
   constructor(dao) {
      this.dao = dao;
   }

   GetUserByEmail = async (email)  => {
      const user = await this.dao.getByEmail(email);
      return user;
   }

   GetAllUsers = async () => {
      const users = await this.dao.getAll();
      const usersDto = users.map(user => new UserDto(user));
      return usersDto;
   }

   CreateUser = async(user) => {
      const result = await this.dao.save(user);
      return result; 
   }
   
   DeleteUser = async(userId) => {
      const result = await this.dao.delete(userId);
      return result;
   }

   FindInactiveUsers = async() => {
      const result = await this.dao.findInactiveUsers();
      return result;
   }
}