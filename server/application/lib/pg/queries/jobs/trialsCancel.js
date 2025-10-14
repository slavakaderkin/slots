() => {
  const now = new Date().toISOString();
  const end = lib.utils.modTime(now, 1, 'd');
  
  const builder = lib.pg.builder.build.select()
    .from('Trial')
    .where('end', '<=', now)
    .where('isActive', '=', true);

  return builder;
};
