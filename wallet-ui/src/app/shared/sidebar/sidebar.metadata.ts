// Sidebar route metadata
export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    badge: string;
    badgeClass: string;
    isExternalLink: boolean;
    submenu : RouteInfo[];
    isExpertView?: boolean;
    isSwapp?: boolean, 
    appName?: string,
    isExtensionView?: boolean
}
