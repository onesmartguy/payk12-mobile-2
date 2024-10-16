import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import React, { useState } from 'react';
import { InteractionManager } from 'react-native';
const useRunOnce = () => {
  const isFocused = useIsFocused()
  const [runOnceEvents, setRunOnceEvents] = useState<string[]>([]);
  useFocusEffect(
    React.useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setRunOnceEvents([])
      });
  
      return () => task.cancel();
    }, [])
  );
  const runOnce = (key: string, action: () => any) => {
    if(runOnceEvents.indexOf(key) == -1){
      runOnceEvents.push(key)
      action()
    }
  }
  return runOnce
}
export default useRunOnce