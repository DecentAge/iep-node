import { RouteInfo } from './sidebar.metadata';

//Sidebar menu Routes and data
export const ROUTES: RouteInfo[] = [
    // {
    //     path: '/dashboard', title: 'Dashboard', icon: 'fa fa-home', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
    // },
    {
        path: '',
        title: 'Account',
        icon: 'icon-Account',
        class: 'has-sub',
        badge: '',
        badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1',
        isExternalLink: false,
        submenu: [
            {
                path: '/account/detail',
                title: 'Account Details',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            { path: '/account/send', title: 'Send XIN', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            {
                path: '/account/receive-tab',
                title: 'Receive XIN',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                path: '/account/transactions',
                title: 'Transactions',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                path: '/account/advance',
                title: 'Advanced',
                icon: '',
                class: 'has-sub',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: [
                    {
                        path: '/account/control',
                        title: 'Control',
                        icon: '',
                        class: '',
                        badge: '',
                        badgeClass: '',
                        isExternalLink: false,
                        submenu: []
                    },
                    {
                        path: '/account/balance-lease',
                        title: 'Balance Leasing',
                        icon: '',
                        class: '',
                        badge: '',
                        badgeClass: '',
                        isExternalLink: false,
                        submenu: []
                    },
                    {
                        path: '/account/search-account',
                        title: 'Search Accounts',
                        icon: '',
                        class: '',
                        badge: '',
                        badgeClass: '',
                        isExternalLink: false,
                        submenu: []
                    },
                    {
                        path: '/account/bookmark',
                        title: 'My Bookmarks',
                        icon: '',
                        class: '',
                        badge: '',
                        badgeClass: '',
                        isExternalLink: false,
                        submenu: []
                    },
                    {
                        path: '/account/lessors',
                        title: 'Lessors',
                        icon: '',
                        class: '',
                        badge: '',
                        badgeClass: '',
                        isExternalLink: false,
                        submenu: []
                    },
                    {
                        path: '/account/properties',
                        title: 'Properties',
                        icon: '',
                        class: '',
                        badge: '',
                        badgeClass: '',
                        isExternalLink: false,
                        submenu: []
                    },
                    {
                        path: '/account/block-generation',
                        title: 'Block Generation',
                        icon: '',
                        class: '',
                        badge: '',
                        badgeClass: '',
                        isExternalLink: false,
                        submenu: []
                    },
                    {
                        path: '/account/funding-monitor',
                        title: 'Funding Monitor',
                        icon: '',
                        class: '',
                        badge: '',
                        badgeClass: '',
                        isExternalLink: false,
                        submenu: []
                    },
                    {
                        path: '/account/ledger-view',
                        title: 'Ledger View',
                        icon: '',
                        class: '',
                        badge: '',
                        badgeClass: '',
                        isExternalLink: false,
                        submenu: []
                    }
                ],
                isExpertView: true
            },
        ]
    },
    {
        path: '/messages',
        title: 'Messages',
        icon: 'icon-messages',
        class: 'has-sub',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: [
            {
                path: '/messages/show-messages',
                title: 'Show Messages',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                path: '/messages/send-message',
                title: 'Send Message',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
        ]
    },
    {
        path: '/assets',
        title: 'Assets',
        icon: 'icon-assets',
        class: 'has-sub',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: [
            {
                path: '/assets/show-assets',
                title: 'Show Assets',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                path: '/assets/my-open-orders',
                title: 'My Open Orders',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                path: '/assets/my-trades',
                title: 'My Trades',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                path: '/assets/my-transfers',
                title: 'My Transfers',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                path: '/assets/last-trades',
                title: 'Last Trades',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                path: '/assets/issue-asset',
                title: 'Issue Asset',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                path: '/assets/search-assets',
                title: 'Search Asset',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
        ],
        isSwapp: true,
        appName: 'Assets'
    },
    {
        path: '/currencies',
        title: 'Currencies',
        icon: 'icon-currencies',
        class: 'has-sub',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: [
            {
                path: '/currencies/show-currencies',
                title: 'Show Currencies',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                path: '/currencies/my-open-offers',
                title: 'My Open Offers',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                path: '/currencies/my-exchanges',
                title: 'My Exchanges',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                path: '/currencies/my-transfers',
                title: 'My Transfers',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                path: '/currencies/last-exchanges',
                title: 'Last Exchanges',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                path: '/currencies/issue-currency',
                title: 'Issue Currency',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                path: '/currencies/search-currencies',
                title: 'Search Currencies',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            }
        ],
        isSwapp: true,
        appName: 'Currencies'
    },
    {
        path: '/aliases',
        title: 'Aliases',
        icon: 'icon-Aliases',
        class: 'has-sub',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: [
            {
                path: '/aliases/show-alias',
                title: 'Show Aliases',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                path: '/aliases/my-sell-offers',
                title: 'My Sell Offers',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                path: '/aliases/buy-offers',
                title: 'Buy Offers',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                path: '/aliases/create-alias',
                title: 'Create Alias',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
        ],
        isSwapp: true,
        appName: 'Aliases'
    },
    {
        path: '/voting',
        title: 'Voting',
        icon: 'icon-Voting',
        class: 'has-sub',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: [
            {
                path: '/voting/show-polls',
                title: 'Show Polls',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                path: '/voting/create-poll',
                title: 'Create Poll',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
        ],
        isSwapp: true,
        appName: 'Voting'
    },
    {
        path: '/at',
        title: 'AT',
        icon: 'icon-AT',
        class: 'has-sub',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: [
            {
                path: '/at/show-ats',
                title: 'Show ATs',
                icon: '', class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                path: '/at/create-at',
                title: 'Create AT',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                path: '/at/workbench',
                title: 'AT Workbench',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            }
        ], appName: 'AT'
    },
    {
        path: '/crowdfunding',
        title: 'Crowdfunding',
        icon: 'icon-Crowdfunding',
        class: 'has-sub',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: [
            {
                path: '/crowdfunding/show-campaigns',
                title: 'Show Campaigns',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                path: '/crowdfunding/create-campaign',
                title: 'Create Campaign',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            }
        ],
        appName: 'Crowdfunding'
    },
    {
        path: '/subscriptions',
        title: 'Subscriptions',
        icon: 'icon-Subscription',
        class: 'has-sub',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: [
            {
                path: '/subscriptions/my-subscriptions',
                title: 'My Subscriptions',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                path: '/subscriptions/create-subscription',
                title: 'Create Subscription',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
        ],
        appName: 'Subscriptions'
    },
    {
        path: '/escrow',
        title: 'Escrow',
        icon: 'icon-Escrow',
        class: 'has-sub',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: [
            {
                path: '/escrow/my-escrow',
                title: 'My Escrow',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                path: '/escrow/create-escrow',
                title: 'Create Escrow',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            }
        ],
        appName: 'Escrow'
    },
    {
        path: '/shuffling',
        title: 'Shuffling',
        icon: 'icon-Shuffling',
        class: 'has-sub',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: [
            {
                path: '/shuffling/show-shufflings',
                title: 'Show Shufflings',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                path: '/shuffling/create-shuffling',
                title: 'Create Shuffling',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
        ],
        appName: 'Shuffling'
    },/*
    {
        path: '/wallet-settings/options',
        title: 'Options',
        icon: 'icon-options',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: []
    },*/
    {
        path: '/tools',
        title: 'Tools',
        icon: 'icon-Extensions',
        class: 'has-sub',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        isExtensionView: true,
        submenu: [
            {
                path: '/tools',
                title: 'Overview',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            // {
            //     path: '/extensions/chain-viewer',
            //     title: 'Chain Viewer',
            //     icon: '',
            //     class: '',
            //     badge: '',
            //     badgeClass: '',
            //     isExternalLink: false,
            //     submenu: []
            // },
            // {
            //     path: '/tools/macap',
            //     title: 'MaCap Viewer',
            //     icon: '',
            //     class: '',
            //     badge: '',
            //     badgeClass: '',
            //     isExternalLink: false,
            //     submenu: []
            // },
            // {
            //     path: '/tools/newsviewer',
            //     title: 'News Center',
            //     icon: '',
            //     class: '',
            //     badge: '',
            //     badgeClass: '',
            //     isExternalLink: false,
            //     submenu: []
            // },
            // {
            //     path: '/extensions/service-monitor',
            //     title: 'Service Monitor',
            //     icon: '',
            //     class: '',
            //     badge: '',
            //     badgeClass: '',
            //     isExternalLink: false,
            //     submenu: []
            // },
        ],
        isSwapp: true,
        appName: 'Tools'
    },
    {
        path: '/wallet-settings/swapps',
        title: 'SWApps',
        icon: 'icon-SWApps',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: []
    },
    // { path: '/chain-viewer', title: 'Chain Viewer', icon: 'fa fa-link', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    // { path: '/map-cap-viewer', title: 'MapCap Viewer', icon: 'fa fa-line-chart', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    // { path: '/news-center', title: 'News Center', icon: 'fa fa-newspaper-o', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    // { path: '/service-monitor', title: 'Service Monitor', icon: 'fa fa-desktop', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    // { path: '/at-workbench', title: 'At Workbench', icon: 'fa fa-gears', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] }

];
