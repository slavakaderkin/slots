async (worker = 'W1') => {
  const { id } = application.worker;
  if (id !== worker) return;

  const check = (name) => !['start', 'stop', 'parent'].includes(name)
  const jobs = Object.keys(lib.jobs).filter(check);

  for (const name of jobs) {
    const { every, interval } =  config.jobs[name];
    //const methodName = `lib.jobs.${name}`;
    //const task = { name, every, run: methodName };

    const runJob = async () => {
      lib.jobs[name]();
      //await application.scheduler.add(task);
      console.debug(`Job ${name} was started`);
    };

    setInterval(runJob, interval);
  }
};
