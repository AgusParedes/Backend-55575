import passport from "passport";
import local from "passport-local";
import GitHubStrategy from 'passport-github2';
import { usersModel } from "../dao/dbManagers/models/user.model.js";
import configs from "./config.js";
import jwt from 'passport-jwt';


const JWTSrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;


const initializePassport = () => {
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


   passport.use('jwt', new JWTSrategy({
      jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
      secretOrKey: configs.privateKeyJwt
   }, async(jwt_payload, done) => {
         try {
            return done(null, jwt_payload.user);
         } catch (error) {
            return done(error);
         }
      }))
};

const cookieExtractor = req => {
   let token = null;
   if(req && req.cookies) {
      token = req.cookies['coderCookieToken'];
   }
   return token;
}

const passportCall = (strategy) => {
   return async(req, res, next) => {
      passport.authenticate(strategy, { session: false }, function(err, user, info) {
            if(err) return next(err);
            if(!user) {
               return res.status(401).send({ status: 'error', error: info.messages ? info.messages : info.toString() })
            }
            req.user = user;
            next();
      })(req, res, next);
   }
}

export {
   initializePassport,
   passportCall
}