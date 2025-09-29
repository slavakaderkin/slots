({
  host: '0.0.0.0',
  //balancer: 8000,
  protocol: process.env.PROTOCOL || 'http',
  ports: [8000, 8001, 8002, 8443],
  nagle: false,
  timeouts: {
    bind: 2000,
    start: 30000,
    stop: 5000,
    request: 30000,
    watch: 1000,
    test: 60000,
  },
  queue: {
    concurrency: 1000,
    size: 2000,
    timeout: 3000,
  },
  scheduler: {
    concurrency: 1000,
    size: 50000,
    timeout: 30000,
  },
  workers: {
    pool: 2,
    wait: 2000,
    timeout: 5000,
  },
  cors: {
    origin: '*',
  },
});
