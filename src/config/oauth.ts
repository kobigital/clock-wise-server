import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const googleOauthStrategy = () => {
    return new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
        },
        async (accessToken: string, refreshToken: string, profile: Profile, done: Function) => {
            try {
                // Find or create the user based on the Google profile
                const email = profile.emails?.[0].value
                const picture = profile.photos?.[0]?.value
                let user = await User.findOne({ email });
                if (!user) {
                    // Create a new user if not found
                    user = await User.create({
                        name: profile.displayName,
                        email,
                        picture,
                        providerId: profile.id,
                        newUser: true,
                        // Set other user properties based on the Google profile
                    });
                } else if (picture !== user.picture) {
                    user = await User.findOneAndUpdate(
                        { email },
                        { picture },
                        { new: true }
                    );
                }

                if (!user) {
                    throw new Error('user undefined')
                }

                // Generate a JWT token
                const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || '');
                done(null, { user, token });
            } catch (error) {
                done(error, null);
            }
        }
    );
};

const jwtStrategy = () => {
    return new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || '',
        },
        async (payload: any, done: Function) => {
            try {
                const user = await User.findById(payload.userId);
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            } catch (error) {
                done(error, false);
            }
        }
    );
};

export { googleOauthStrategy, jwtStrategy };