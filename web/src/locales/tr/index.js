const modules =  import.meta.glob('./*.js', {
  import: 'default',
  eager: true,
});

const translation = Object.entries(modules)
  .reduce((acc, [name, module]) => {
    const key = name.slice(2, -3);
    acc[key] = module;
    return acc 
  }, {});

export default { translation };