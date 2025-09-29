import { useState, useCallback, useEffect } from 'react';

export default () => {
  const [isFocus, setIsFocus] = useState(false);
  const [focusedInputs, setFocusedInputs] = useState(new Set());
  
  const handleFocus = useCallback((name) => {
    setFocusedInputs(prev => {
      const newSet = new Set(prev);
      newSet.add(name);
      return newSet;
    });
  }, []);

  const handleBlur = useCallback((name) => {
    setFocusedInputs(prev => {
      const newSet = new Set(prev);
      newSet.delete(name);
      return newSet;
    });
  }, []);

  useEffect(() => {
    setIsFocus(focusedInputs.size > 0);
  }, [focusedInputs]);

  return {
    isFocus,
    focusedInputs,
    handleFocus,
    handleBlur
  };
};