import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import User from '../models/User';

const googleOauthStrategy = () => {
    return new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            callbackURL: 'http://localhost:5000/auth/google/callback',
        },
        async (accessToken: string, refreshToken: string, profile: Profile, done: Function) => {
            console.log({ accessToken, refreshToken, profile });
            try {
                // Find or create the user based on the Google profile
                let user = await User.findOne({ email: profile.emails?.[0].value });
                if (!user) {
                    // Create a new user if not found
                    user = await User.create({
                        name: profile.displayName,
                        email: profile.emails?.[0].value,
                        newUser: true,
                        // Set other user properties based on the Google profile
                    });
                }
                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }

    )
}

export default googleOauthStrategy;