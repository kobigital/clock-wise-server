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
                } else {
                    user = await User.findOneAndUpdate(
                        { email },
                        { picture },
                        { new: true }
                    );
                    console.log('user - update picture', user);
                }
                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }

    )
}

export default googleOauthStrategy;