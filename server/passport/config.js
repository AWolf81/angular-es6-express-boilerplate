import passport from 'passport';
import passportJwt from 'passport-jwt';
import {User} from '../models/user';
import config from '../config/token';

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const passportConfig = function(router) {
    let opts = {
        secretOrKey: config.secret,
        jwtFromRequest: ExtractJwt.fromAuthHeader(),
        passReqToCallback: true
    };

    let strategy = new JwtStrategy(opts, function(req, jwt_payload, done) {
        User.find({id: jwt_payload.id}, (err, user) => {
            if (err) {
                console.log('error from strategy');
                return done(err, false);
            }

            if (user) {
                done(null, user);
            } else {
                console.log('user not found');
                done(null, false);
            }
        });
    });

    router.use(passport.initialize());
    passport.use(strategy);
    passport.use(User.createStrategy());
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    return router;
}

export default passportConfig;