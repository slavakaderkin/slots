({
  host: process.env.DB_HOST || '127.0.0.1',
  port: 5432,
  database: 'application',
  user: process.env.DB_USER || 'devuser',
  password: process.env.DB_PASSWORD || 'devpassword',
});
