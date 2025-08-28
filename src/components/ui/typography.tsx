import React from 'react';

export function TypographyH1(props: React.HTMLProps<HTMLHeadingElement>) {
  const styles = 'leading-[1.25] scroll-m-20 text-4xl font-family text-primary ';
  return (
    <h1 {...props} className={styles + props.className}>
      {props.children}
    </h1>
  );
}

export function TypographyH2(props: React.HTMLProps<HTMLHeadingElement>) {
  const styles = 'leading-[1.25] scroll-m-20 text-[40px] font-family text-primary font-[400] ';
  return (
    <h2 {...props} className={styles + props.className}>
      {props.children}
    </h2>
  );
}

export function TypographyH3(props: React.HTMLProps<HTMLHeadingElement>) {
  const styles = 'scroll-m-20 text-2xl font-normal font-family text-primary ';
  return (
    <h3 {...props} className={styles + props.className}>
      {props.children}
    </h3>
  );
}

export function TypographyH4(props: React.HTMLProps<HTMLHeadingElement>) {
  const styles = 'scroll-m-20 text-xl font-normal font-family text-primary ';
  return (
    <h4 {...props} className={styles + props.className}>
      {props.children}
    </h4>
  );
}

export function TypographyH5(props: React.HTMLProps<HTMLHeadingElement>) {
  const styles = 'scroll-m-20 text-lg font-family text-primary ';
  return (
    <h5 {...props} className={styles + props.className}>
      {props.children}
    </h5>
  );
}

export function TypographyP(props: React.HTMLProps<HTMLHeadingElement>) {
  const styles = 'font-lausanne text-lighter-text font-[200] text-[14px] leading-[1.5] ';
  return (
    <p {...props} className={styles + props.className}>
      {props.children}
    </p>
  );
}

export function TypographyHint(props: React.HTMLProps<HTMLHeadingElement>) {
  const styles = 'font-lausanne text-lighter-text font-[200] text-[14px] leading-[1.25] ';
  return (
    <p {...props} className={styles + props.className}>
      {props.children}
    </p>
  );
}
