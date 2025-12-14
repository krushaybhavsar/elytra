import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';
import { Resizable } from 'react-resizable';

type ResizablePanelProps = {
  children?: React.ReactNode;
  axis: 'x' | 'y';
  resizeHandles: ('s' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne')[];
  initialWidth?: number;
  initialHeight?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  className?: string;
  showThumb?: boolean;
  height?: number;
  onHeightChange?: (height: number) => void;
};

const CustomResizeHandle = React.forwardRef<HTMLDivElement, any>((props, ref) => {
  const {
    handleAxis,
    showThumb,
    setWidth,
    setHeight,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    width,
    height,
    ...restProps
  } = props;
  const getPositionClasses = () => {
    switch (handleAxis) {
      case 'n':
        return 'left-0 right-0 top-0 h-2 cursor-ns-resize';
      case 's':
        return 'left-0 right-0 bottom-0 h-2 cursor-ns-resize';
      case 'e':
        return 'right-0 top-0 bottom-0 w-2 cursor-ew-resize';
      case 'w':
        return 'left-0 top-0 bottom-0 w-2 cursor-ew-resize';
      default:
        return 'right-0 top-0 bottom-0 w-2 cursor-ew-resize';
    }
  };
  return (
    <div
      className={`absolute ${getPositionClasses()} transition-all duration-200 z-10`}
      ref={ref}
      {...restProps}
    >
      {showThumb && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (handleAxis === 'x') {
              if (width > minWidth) {
                setWidth(minWidth);
              } else {
                setWidth(0.75 * maxWidth);
              }
            } else {
              if (height > minHeight) {
                setHeight(minHeight);
              } else {
                setHeight(0.75 * maxHeight);
              }
            }
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onMouseMove={(e) => {
            e.stopPropagation();
          }}
          className={`bg-background absolute border-border border-[1px] !cursor-pointer flex justify-center items-center ${
            handleAxis === 'n' ? 'h-4 w-8 left-1/2 -translate-x-1/2 bottom-2 rounded-t-md' : 'todo'
          }`}
        >
          {handleAxis === 'n' &&
            (height > minHeight ? (
              <ChevronDown className='stroke-outline' strokeWidth={1} size={20} />
            ) : (
              <ChevronUp className='stroke-muted' strokeWidth={1} size={20} />
            ))}
        </div>
      )}
    </div>
  );
});

const ResizablePanel = (props: ResizablePanelProps) => {
  const {
    children,
    axis,
    resizeHandles,
    initialWidth = 250,
    initialHeight = 250,
    minWidth = 200,
    maxWidth = 400,
    minHeight = 250,
    maxHeight = 400,
    className = '',
    showThumb = false,
    height: controlledHeight,
    onHeightChange,
  } = props;

  const [internalWidth, setInternalWidth] = useState(initialWidth);
  const [internalHeight, setInternalHeight] = useState(initialHeight);

  // Use controlled height if provided, otherwise use internal state
  const width = axis === 'x' && controlledHeight === undefined ? internalWidth : internalWidth;
  const height = axis === 'y' && controlledHeight !== undefined ? controlledHeight : internalHeight;

  const setWidth = (newWidth: number) => {
    setInternalWidth(newWidth);
  };

  const setHeight = (newHeight: number) => {
    if (onHeightChange) {
      onHeightChange(newHeight);
    } else {
      setInternalHeight(newHeight);
    }
  };

  const onResize = (
    event: React.SyntheticEvent,
    { size }: { size: { width: number; height: number } },
  ) => {
    if (axis === 'x') {
      setWidth(size.width);
    } else {
      setHeight(size.height);
    }
  };

  return (
    <Resizable
      width={axis == 'x' ? width : Infinity}
      height={axis == 'x' ? Infinity : height}
      onResize={onResize}
      axis={axis}
      resizeHandles={resizeHandles}
      minConstraints={axis == 'x' ? [minWidth, 0] : [0, minHeight]}
      maxConstraints={axis == 'x' ? [maxWidth, Infinity] : [Infinity, maxHeight]}
      handle={
        <CustomResizeHandle
          handleAxis={axis}
          showThumb={showThumb}
          setWidth={setWidth}
          setHeight={setHeight}
          minWidth={minWidth}
          maxWidth={maxWidth}
          minHeight={minHeight}
          maxHeight={maxHeight}
          width={width}
          height={height}
        />
      }
      className={`relative overflow-visible ${className}`}
    >
      <div
        className={
          axis == 'x' ? 'h-full overflow-hidden relative' : ' w-full overflow-hidden relative'
        }
        style={axis == 'x' ? { width: `${width}px` } : { height: `${height}px` }}
      >
        {children}
      </div>
    </Resizable>
  );
};

export default ResizablePanel;
