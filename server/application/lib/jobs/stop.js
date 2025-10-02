async (worker = 'W1') => {
  if (application.worker.id !== worker) return;

  const jobs = Object.keys(lib.jobs).filter(
    (name) => !['start', 'stop', 'parent'].includes(name),
  );

  for (const name of jobs) {
    //application.scheduler.stop(name);
    console.debug(`Job ${name} was stopped`);
  }
};
