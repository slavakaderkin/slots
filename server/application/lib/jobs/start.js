async (worker = 'W1') => {
  const { id } = application.worker;
  if (id !== worker) return;

  const check = (name) => !['start', 'stop', 'parent'].includes(name)
  const jobs = Object.keys(lib.jobs).filter(check);

  for (const name of jobs) {
    const method = lib.jobs[name];

    const run = async () => {
      console.warn(`From jobs/${name} loop`)
      await method();
      console.debug(`Job ${name} was started`);
    };
    const interval = 1000 * 60 * 60;
    setInterval(run, interval);
  }
};
