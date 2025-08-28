import { BotMessageSquare, ChartColumn, Database, LucideProps } from 'lucide-react';

export class AppMapRoute {
  slug: string;
  windowTitle: string;
  children: { [key: string]: AppMapRoute };
  authProtected: boolean;
  titleBarSettings: {
    showTitleBar: boolean;
    showTitleText: boolean;
    titleBarColor: string;
    titleTextColor: string;
    additionalStyles?: string;
  };

  constructor({
    slug,
    windowTitle,
    children,
    authProtected = false,
    titleBarSettings = {},
  }: {
    slug: string;
    windowTitle: string;
    children: { [key: string]: AppMapRoute };
    authProtected?: boolean;
    titleBarSettings?: {
      showTitleBar?: boolean;
      showTitleText?: boolean;
      titleBarColor?: string;
      titleTextColor?: string;
      additionalStyles?: string;
    };
  }) {
    const {
      showTitleBar = true,
      showTitleText = true,
      titleBarColor = 'darker-background',
      titleTextColor = 'lighter-text',
      additionalStyles = 'relative',
    } = titleBarSettings;
    this.slug = slug;
    this.windowTitle = windowTitle;
    this.children = children;
    this.authProtected = authProtected;
    this.titleBarSettings = {
      showTitleBar,
      showTitleText,
      titleBarColor,
      titleTextColor,
      additionalStyles,
    };
  }
}

export class NavigationBarMapTab {
  title: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;

  constructor({
    title,
    icon,
  }: {
    title: string;
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
    >;
  }) {
    this.title = title;
    this.icon = icon;
  }
}

export enum AppScreens {
  MAIN = '/',
}

export const AppMap: Record<AppScreens, AppMapRoute> = {
  [AppScreens.MAIN]: new AppMapRoute({
    slug: AppScreens.MAIN,
    windowTitle: 'Elytra',
    authProtected: true,
    children: {},
  }),
};

export enum NavigationBarTabs {
  WORKSPACE = 'Workspace',
  DASHBOARD = 'Dashboard',
  CHAT = 'Chat',
}

export const NavigationBarMap: Record<NavigationBarTabs, NavigationBarMapTab> = {
  [NavigationBarTabs.WORKSPACE]: new NavigationBarMapTab({
    title: 'Workspace',
    icon: Database,
  }),
  [NavigationBarTabs.DASHBOARD]: new NavigationBarMapTab({
    title: 'Dashboard',
    icon: ChartColumn,
  }),
  [NavigationBarTabs.CHAT]: new NavigationBarMapTab({
    title: 'Chat',
    icon: BotMessageSquare,
  }),
};
