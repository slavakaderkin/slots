async (worker = 'W1') => {
  const { id } = application.worker;
  if (id !== worker) return;

  const check = (name) => !['start', 'stop', 'parent'].includes(name)
  const jobs = Object.keys(lib.jobs).filter(check);

  for (const name of jobs) {
    //const { every } =  config.jobs[name];
    //const methodName = `lib.jobs.${name}`;
    //const task = { name, every, run: methodName };

    const runJob = async () => {
      lib.jobs[name]();
      //await application.scheduler.add(task);
      console.debug(`Job ${name} was started`);
    };

    setInterval(runJob, 1000 * 60 * 60);
  }
};
