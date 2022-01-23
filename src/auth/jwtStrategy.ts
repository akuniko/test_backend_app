import config from '../config/config';
import jwt from 'jsonwebtoken';
import {ExtractJwt, Strategy as JwtStrategy, StrategyOptions} from 'passport-jwt';
import User from '../models/User';

export const createTokenForUser = async (userId: string) => {
    console.log(`Creating token for user ${userId}`);
    const { secret, issuer, audience } = config.credentials.token;

    if (!secret) {
        throw new Error('Token secret is missing in env!');
    }
    const payload = {
        sub: userId,
        iss: issuer,
        aud: audience
    };

    return jwt.sign(payload, secret);
};

const jwtFromRequest = ExtractJwt.fromExtractors([
  ExtractJwt.fromAuthHeaderAsBearerToken(),
  ExtractJwt.fromUrlQueryParameter(config.credentials.token.queryParameterName) // TODO remove
]);

const jwtOpts: StrategyOptions = {
  secretOrKey: config.credentials.token.secret,
  issuer: config.credentials.token.issuer,
  audience: config.credentials.token.audience,
  ignoreExpiration: true,
  jwtFromRequest
};

export const jwtStrategy = new JwtStrategy(jwtOpts, async (payload, done) => {
  try {
    const user = await User.findOne({ userId: payload.sub });
    if (!user) {
      return done(null, false);
    }
    return done(null, { id: user.id });
  } catch (err) {
    return done(err, false);
  }
});
