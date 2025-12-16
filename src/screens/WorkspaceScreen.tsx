import TabViewContainer from '@/components/tabs/TabViewContainer';
import React, { forwardRef } from 'react';

interface WorkspaceScreenProps {}

const WorkspaceScreen = forwardRef<
  { newTab: (connectionId?: string) => void },
  WorkspaceScreenProps
>((props, ref) => {
  return (
    <div className='w-full h-full relative'>
      <TabViewContainer ref={ref} />
    </div>
  );
});

WorkspaceScreen.displayName = 'WorkspaceScreen';

export default WorkspaceScreen;
