import express, { query } from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/google', function (req, res, next) {
    const state = req.query.state as string;
    const authenticator = passport.authenticate('google', { scope: ['profile', 'email'], state });
    authenticator(req, res, next);
});

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/?error=failureRedirect' }),
    function (req, res) {
        const token = (req.user as any).token;
        const state = req.query.state as string;
        const extensionId = state?.slice(0, 4) === 'EXT-' ? state.slice(4) : undefined;
        if (extensionId) {
            return res.redirect(`https://${extensionId}.chromiumapp.org/login?token=${token}`)
        }
        res.redirect(`http://localhost:3000/login?token=${token}`);
    }
);

export default router;