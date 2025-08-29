import React, { useState } from 'react';
import { Resizable } from 'react-resizable';

type ResizablePanelProps = {
  children?: React.ReactNode;
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  className?: string;
};

const CustomResizeHandle = React.forwardRef<HTMLDivElement, any>((props, ref) => {
  const { handleAxis, ...restProps } = props;
  return (
    <div
      className='absolute right-0 top-0 bottom-0 w-0.75 cursor-col-resize bg-transparent hover:bg-border active:bg-border transition-all duration-200'
      ref={ref}
      {...restProps}
    />
  );
});

const ResizablePanel = (props: ResizablePanelProps) => {
  const { children, initialWidth = 250, minWidth = 200, maxWidth = 400, className = '' } = props;

  const [width, setWidth] = useState(initialWidth);

  const onResize = (
    event: React.SyntheticEvent,
    { size }: { size: { width: number; height: number } },
  ) => {
    setWidth(size.width);
  };

  return (
    <Resizable
      width={width}
      height={Infinity}
      onResize={onResize}
      axis='x'
      resizeHandles={['e']}
      minConstraints={[minWidth, 0]}
      maxConstraints={[maxWidth, Infinity]}
      handle={<CustomResizeHandle />}
      className={`relative overflow-hidden ${className}`}
    >
      <div className={'h-full overflow-hidden relative'} style={{ width: `${width}px` }}>
        {children}
      </div>
    </Resizable>
  );
};

export default ResizablePanel;
