import React from 'react';

export function TypographyH1(props: React.HTMLProps<HTMLHeadingElement>) {
  const styles =
    'leading-[1] tracking-[-1.92px] scroll-m-20 text-[84px] font-roobert font-light text-foreground ';
  return (
    <h1 {...props} className={styles + props.className}>
      {props.children}
    </h1>
  );
}

export function TypographyH2(props: React.HTMLProps<HTMLHeadingElement>) {
  const styles = 'leading-[1.25] scroll-m-20 text-[40px] font-roobert text-foreground font-[400] ';
  return (
    <h2 {...props} className={styles + props.className}>
      {props.children}
    </h2>
  );
}

export function TypographyH3(props: React.HTMLProps<HTMLHeadingElement>) {
  const styles = 'scroll-m-20 text-2xl font-normal font-roobert text-foreground ';
  return (
    <h3 {...props} className={styles + props.className}>
      {props.children}
    </h3>
  );
}

export function TypographyH4(props: React.HTMLProps<HTMLHeadingElement>) {
  const styles = 'scroll-m-20 text-xl font-normal font-roobert text-foreground ';
  return (
    <h4 {...props} className={styles + props.className}>
      {props.children}
    </h4>
  );
}

export function TypographyH5(props: React.HTMLProps<HTMLHeadingElement>) {
  const styles = 'scroll-m-20 text-lg font-roobert text-foreground ';
  return (
    <h5 {...props} className={styles + props.className}>
      {props.children}
    </h5>
  );
}

export function TypographyP(props: React.HTMLProps<HTMLHeadingElement>) {
  const styles = 'font-motreal text-foreground/75 text-[16px] leading-[1.25] ';
  return (
    <p {...props} className={styles + props.className}>
      {props.children}
    </p>
  );
}

export function TypographyHint(props: React.HTMLProps<HTMLHeadingElement>) {
  const styles = 'font-montreal text-foreground/60 font-normal text-[14px] leading-[1.25] ';
  return (
    <p {...props} className={styles + props.className}>
      {props.children}
    </p>
  );
}
