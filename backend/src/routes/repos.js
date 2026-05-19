const express = require('express');
const router = express.Router();
const db = require('../db');

const requireAuth = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  next();
};

// Sync repos from GitHub
router.post('/sync', requireAuth, async (req, res) => {
  try {
    const response = await fetch('https://api.github.com/user/repos?per_page=50&sort=updated', {
      headers: {
        Authorization: `Bearer ${req.user.access_token}`,
        Accept: 'application/vnd.github+json'
      }
    });
    const githubRepos = await response.json();

    for (const repo of githubRepos) {
      await db.query(
        `INSERT INTO repositories (user_id, github_repo_id, name, full_name)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT DO NOTHING`,
        [req.user.id, String(repo.id), repo.name, repo.full_name]
      );
    }

    const result = await db.query('SELECT * FROM repositories WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get saved repos
router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM repositories WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get PRs for a repo
router.get('/:repoFullName/pulls', requireAuth, async (req, res) => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${req.params.repoFullName}/pulls?state=all&per_page=20`,
      {
        headers: {
          Authorization: `Bearer ${req.user.access_token}`,
          Accept: 'application/vnd.github+json'
        }
      }
    );
    const prs = await response.json();
    res.json(prs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
