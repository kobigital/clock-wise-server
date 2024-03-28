import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/?error=failureRedirect' }),
    function (req, res) {
        const token = (req.user as any).token;
        res.redirect(`http://localhost:3000/?token=${token}`);
    }
);

export default router;