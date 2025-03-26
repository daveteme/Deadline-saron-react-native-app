const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const config = require('./app');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
      try {
        // Find the user based on the JWT payload
        const user = await User.findById(jwt_payload.id);

        if (user) {
          return done(null, user);
        }
        
        return done(null, false);
      } catch (error) {
        console.error('Error in passport JWT strategy:', error);
        return done(error, false);
      }
    })
  );
};
