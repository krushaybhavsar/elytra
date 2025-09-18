import React, { useState } from 'react';
import { TabData } from './TabViewContainer';
import { motion, Reorder } from 'motion/react';
import { CodeXml, X } from 'lucide-react';
import { TypographyHint } from '../ui/typography';

interface TabProps {
  tab: TabData;
  isActive: boolean;
  onClick: () => void;
  onClose: () => void;
  isFirst?: boolean;
}

const MotionTypographyHint = motion(TypographyHint);

const Tab = (props: TabProps) => {
  const [isDisabled, setIsDisabled] = useState(false);

  const getTabIcon = (type: string) => {
    switch (type) {
      case 'editor':
        return <CodeXml className='min-h-4 min-w-4 w-4 h-4' />;
      default:
        return <CodeXml className='min-h-4 min-w-4 w-4 h-4' />;
    }
  };

  return (
    <Reorder.Item
      value={props.tab}
      id={props.tab.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{
        opacity: props.isActive ? 1 : 0.7,
        y: 0,
        transition: { duration: 0.15 },
      }}
      exit={{ opacity: 0, y: 20, transition: { duration: 0.15 } }}
      onPointerDown={isDisabled ? (e) => e.preventDefault() : props.onClick}
      className={`w-full flex flex-row gap-2 h-full justify-between items-center !p-0 !px-2 border-x-[0.5px] flex-1 min-w-0 overflow-hidden relative cursor-pointer ${props.isFirst ? 'border-l-transparent border-r-border' : 'border-border'} ${props.isActive ? `bg-background` : 'bg-darker-background'}`}
    >
      <motion.span
        layout='position'
        className='flex-shrink flex-grow min-w-0 whitespace-nowrap [mask-image:linear-gradient(to_left,transparent_20px,#fff_40px)]'
      >
        <span className='flex items-center gap-2'>
          {getTabIcon(props.tab.metadata.type)}
          <TypographyHint className='!leading-0 !text-primary'>
            {props.tab.metadata.title}
          </TypographyHint>
        </span>
      </motion.span>
      <motion.div
        layout
        className='absolute top-0 bottom-0 right-2 flex items-center justify-end flex-shrink-0'
      >
        <motion.button
          onPointerDown={(event) => {
            setIsDisabled(true);
            event.stopPropagation();
            props.onClose();
          }}
          initial={false}
          className={`flex text-primary items-center justify-center cursor-pointer flex-shrink-0 ${props.isActive ? 'hover:bg-gray-background' : 'hover:bg-darkest-background'} rounded-sm p-0.75 transition-all duration-200`}
        >
          <X className='min-h-4 min-w-4 w-4 h-4' />
        </motion.button>
      </motion.div>
    </Reorder.Item>
  );
};

export default Tab;
