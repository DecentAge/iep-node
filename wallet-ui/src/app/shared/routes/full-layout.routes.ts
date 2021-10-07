import { Routes, RouterModule } from '@angular/router';

// Route for content layout with sidebar, navbar and footer.

export const FULL_ROUTES: Routes = [
    {
        path: 'dashboard',
        loadChildren: './module/dashboard/dashboard.module#DashboardModule'
    },
    {
        path: 'account',
        loadChildren: './module/account/account.module#AccountModule'
    },
    {
        path: 'messages',
        loadChildren: './module/message/message.module#MessageModule'
    },
    {
        path: 'voting',
        loadChildren: './module/voting/voting.module#VotingModule'
    },
    {
        path: 'wallet-settings',
        loadChildren: './module/swapps/swapps.module#SwappsModule'
    },
    {
        path: 'assets',
        loadChildren: './module/assets/assets.module#AssetsModule'
    },
    {
        path: 'aliases',
        loadChildren: './module/aliases/aliases.module#AliasesModule'
    },
    {
        path: 'at',
        loadChildren: './module/at/at.module#AtModule'
    },
    {
        path: 'crowdfunding',
        loadChildren: './module/crowdfunding/crowdfunding.module#CrowdfundingModule'
    },
    {
        path: 'subscriptions',
        loadChildren: './module/subscriptions/subscriptions.module#SubscriptionsModule'
    },
    {
        path: 'escrow',
        loadChildren: './module/escrow/escrow.module#EscrowModule'
    },
    {
        path: 'shuffling',
        loadChildren: './module/shuffling/shuffling.module#ShufflingModule'
    },
    {
        path: 'currencies',
        loadChildren: './module/currencies/currencies.module#CurrenciesModule'
    },
    {
        path: 'tool',
        loadChildren: './module/tools-pages/tools-pages.module#ToolsPagesModule'
    },
    {
        path: 'tools',
        loadChildren: './module/extensions/extensions.module#ExtensionsModule'
    }
];
