const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const db = require('./db');
require('dotenv').config();

const app = express();

app.set('trust proxy', 1);

app.use(cors({ 
  origin: process.env.CLIENT_URL, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: true,
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000 
  }
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const existing = await db.query('SELECT * FROM users WHERE github_id = $1', [String(profile.id)]);
    if (existing.rows.length > 0) {
      await db.query('UPDATE users SET access_token = $1 WHERE github_id = $2', [accessToken, String(profile.id)]);
      return done(null, { ...existing.rows[0], access_token: accessToken });
    }
    const result = await db.query(
      'INSERT INTO users (github_id, username, avatar_url, access_token) VALUES ($1, $2, $3, $4) RETURNING *',
      [String(profile.id), profile.username, profile.photos?.[0]?.value, accessToken]
    );
    return done(null, result.rows[0]);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});

app.use('/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/repos', require('./routes/repos'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
