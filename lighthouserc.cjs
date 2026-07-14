const routes = require('./audit/routes.json');

module.exports = {
  ci: {
    collect: {
      url: routes.map((route) => `http://127.0.0.1:1313${route}`),
      numberOfRuns: 3,
      startServerCommand: 'hugo server --buildFuture --port 1313 --baseURL http://127.0.0.1:1313/ --appendPort=false',
      startServerReadyPattern: 'Web Server is available',
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
