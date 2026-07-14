const routes = require('./audit/routes.json');

module.exports = {
  ci: {
    collect: {
      url: routes.map((route) => `http://127.0.0.1:1313${route}`),
      numberOfRuns: 3,
      startServerCommand: 'node scripts/serve-audit.mjs',
      startServerReadyPattern: 'Audit server ready',
      settings: {
        preset: 'desktop',
        chromeFlags: '--headless=new --no-sandbox',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 1 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: 'test-results/lighthouse',
    },
  },
};
