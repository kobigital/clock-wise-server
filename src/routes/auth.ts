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
        const referer = req.headers.referer;
        const token = (req.user as any).token;
        const state = req.query.state as string;
        const extensionId = state?.slice(0, 4) === 'EXT-' ? state.slice(4) : undefined;
        if (extensionId) {
            return res.redirect(`https://${extensionId}.chromiumapp.org/login?token=${token}`)
        } else if (referer) {
            const refererUrl = new URL(referer);
            const redirectTo = `${refererUrl.protocol}//${refererUrl.host}/login?token=${token}`;
            return res.redirect(redirectTo);
        }
        res.redirect(`http://localhost:3000/login?token=${token}`);
    }
);

export default router;