const express = require('express');
const passport = require('passport');
const router = express.Router();
require('dotenv').config();

router.get('/github', passport.authenticate('github', { scope: ['user', 'repo'] }));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: `${process.env.CLIENT_URL}/login` }),
  (req, res) => res.redirect(`${process.env.CLIENT_URL}/dashboard`)
);

router.get('/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  res.json({ user: req.user });
});

router.post('/logout', (req, res) => {
  req.logout(() => res.json({ message: 'Logged out' }));
});

module.exports = router;
