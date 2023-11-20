import passport from "passport";
import local from "passport-local";
import GitHubStrategy from 'passport-github2';
import usersModel from "../dao/dbManagers/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy

const initializePassport = () => {
   passport.use('register', new LocalStrategy({
      passReqToCallback: true,
      usernameField: 'email',
   }, async (req, username, password, done) => {
      try {
         const { first_name, last_name, age } = req.body;
         const user = await usersModel.findOne({ email: username });
         console.log(user);
         if(user){
            return done(null, false);
         }
         const userToSave = {
            first_name,
            last_name,
            email: username,
            age,
            password: createHash(password)
         }

         const result = await usersModel.create(userToSave)
         return done(null, result)
      } catch (error) {
         return done("incorrect credentials")
      }
   }));


   passport.use('login', new LocalStrategy({
      usernameField: 'email'
   }, async (username, password, done) => {
      try {
         const user = await usersModel.findOne({ email: username });

            if(!user || !isValidPassword(password, user.password)) {
               return done(null, false)
            }

            return done(null, user);
      } catch (error) {
         return done("incorrect credentials")
      }
   }));


   passport.use('github', new GitHubStrategy({
      clientID: 'Iv1.ae005cda25b5b655',
      clientSecret: 'ae9c3657b1893dd8494b4367050a532be38262ef',
      callbackURL: 'http://localhost:8080/api/sessions/github-callback',
      scope: ['user:email']
}, async (accessToken, refreshToken, profile, done) => {
      try {
         console.log(profile);
         const email = profile.emails[0].value;
         const user = await usersModel.findOne({ email });

         if(!user) {
            const newUser = {
                  first_name: profile._json.name,
                  last_name: '',
                  age: '',
                  email,
                  password: ''
            }

            const result = await usersModel.create(newUser);
            return done(null, result);
         } else {
            return done(null, user);
         }
      } catch (error) {
         return done(`Incorrect credentials`)
      }
   }));

   passport.serializeUser((user, done) => {
      done(null, user._id)
   });

   passport.deserializeUser(async(id, done) => {
      const user = await usersModel.findById(id)
      done(null, user);
   })

}

export {
   initializePassport
}