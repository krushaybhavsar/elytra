import React, { createElement } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { TypographyHint } from './ui/typography';
import { Button } from './ui/button';
import { NavigationBarMap, NavigationBarTabs } from '@/types/navigation.types';

type NavigationBarProps = {
  activeTabScreen: NavigationBarTabs;
  setActiveTabScreen: React.Dispatch<React.SetStateAction<NavigationBarTabs>>;
};

const NavigationBar = (props: NavigationBarProps) => {
  return (
    <div className='h-full w-18 bg-darker-background'>
      <div className='flex flex-col w-full h-full items-center px-2 py-4 gap-4'>
        {Object.keys(NavigationBarMap).map((tabScreenName) => {
          const navTab = NavigationBarMap[tabScreenName as NavigationBarTabs];
          const isActive = props.activeTabScreen === tabScreenName;
          return (
            <Tooltip key={tabScreenName}>
              <TooltipTrigger>
                <Button
                  asChild
                  variant='icon'
                  size='icon'
                  className={`disabled:opacity-100 transition-all hover:bg-darkest-background ${isActive ? 'bg-darkest-background shadow-sm' : ''}`}
                  onClick={() => props.setActiveTabScreen(tabScreenName as NavigationBarTabs)}
                  disabled={isActive}
                >
                  {createElement(navTab.icon, {
                    className: `size-5 ${isActive ? 'text-primary' : 'text-lighter-text'}`,
                  })}
                </Button>
              </TooltipTrigger>
              <TooltipContent side='right' align='center' sideOffset={12}>
                <TypographyHint>{navTab.title}</TypographyHint>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default NavigationBar;
