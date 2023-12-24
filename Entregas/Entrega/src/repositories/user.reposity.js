export default class UserRepository {
   constructor(dao) {
      this.dao = dao;
   }

   getUserByEmail = async (email)  => {
      const user = await this.dao.getByEmail(email);
      return user;
   }

   CreateUser = async(user) => {
      const result = await this.dao.save(user)
      return result; 
   } 
}