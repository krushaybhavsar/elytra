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
    <div className='flex h-full w-18 bg-sidebar'>
      <div className='flex flex-col w-full h-full items-center px-2 py-4 gap-4'>
        {Object.keys(NavigationBarMap).map((tabScreenName) => {
          const navTab = NavigationBarMap[tabScreenName as NavigationBarTabs];
          const isActive = props.activeTabScreen === tabScreenName;
          return (
            <Tooltip key={tabScreenName}>
              <TooltipTrigger>
                <Button
                  asChild
                  variant='ghost'
                  size='icon'
                  className={`disabled:opacity-100 transition-all hover:bg-sidebar-accent ${isActive ? 'hover:bg-sidebar-primary/10 bg-sidebar-primary/10' : ''}`}
                  onClick={() => props.setActiveTabScreen(tabScreenName as NavigationBarTabs)}
                  disabled={isActive}
                >
                  <div>
                    {createElement(navTab.icon, {
                      className: `!size-5 ${isActive ? 'text-primary' : 'text-sidebar-foreground'}`,
                    })}
                  </div>
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
