import React from 'react';
import { LoaderCircle } from 'lucide-react';
import { TypographyP } from './ui/typography';
import ElytraLogo from '@/assets/logos/black-tbg.png';

type LoadingViewProps = {
  message?: string;
  containerClassName?: string;
  spinnerSize?: number;
  strokeWidth?: number;
  strokeColor?: string;
  showlogo?: boolean;
};

export const LoadingView = (props: LoadingViewProps) => {
  return (
    <div
      className={
        'w-full h-full flex flex-col bg-background items-center justify-center gap-2 ' +
        props.containerClassName
      }
    >
      <div className='relative'>
        <LoaderCircle
          className={'animate-spin !duration-500 stroke-foreground/40 ' + props.strokeColor}
          size={props.spinnerSize || 64}
          strokeWidth={props.strokeWidth || 0.5}
        />
        <img
          src={ElytraLogo}
          alt='Logo'
          className={`${props.showlogo ? 'flex' : 'hidden'} w-12 h-12 absolute top-1/2 left-1/2 translate-[-50%] object-contain opacity-100`}
          width={props.spinnerSize ? props.spinnerSize - 76 : 64}
        />
      </div>
      {props.message && (
        <TypographyP className='!text-[14px] text-foreground'>{props.message}</TypographyP>
      )}
    </div>
  );
};

export const LoadingScreen = () => {
  return (
    <div className='w-full h-full flex flex-col bg-background items-center justify-center'>
      <div className='relative w-fit h-fit flex flex-col items-center justify-center opacity-50'>
        <LoadingView
          containerClassName='!h-fit'
          spinnerSize={100}
          strokeWidth={0.3}
          strokeColor='!stroke-foreground'
          message='Starting Elytra'
          showlogo={true}
        />
      </div>
    </div>
  );
};
