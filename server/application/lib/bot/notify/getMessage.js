async (path, args, lng = 'ru') => { // en
  try {
    let current = lib.messages[lng];
    if (!lib.messages[lng]) current = lib.messages['ru'] // en
    const pathParts = path.split('.');
   
    
    for (const part of pathParts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
        if (typeof current === 'function') {
          current = await current(args);
        }
      } else {
        return null;
      }
    }
    
    return current;
  } catch (error) {
    console.error('Error getting message:', error);
    return null;
  }
};