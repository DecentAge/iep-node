const getEnvConfig = (key) => {
    if (window['envConfig'][key]) {
        if (typeof window['envConfig'][key] !== 'string' && window['envConfig'][key].length === 0) {
            return null;
        } else if (typeof window['envConfig'][key] === 'string' && window['envConfig'][key] === '') {
            return null;
        } else {
            return window['envConfig'][key];
        }
    }
    return null;
}

export class AppConstants {

    public static languageConfig = {
        DEFAULT: 'en',
        SESSION_SELECTED_LANGUAGE_KEY: 'selected_language'
    };
    public static optionsConfig = {
        'tableOptions': 'options'
    };
    public static baseConfig = {
        'SESSION_STORAGE_NAMESPACE': 'com.client',
        // This url to access the node API is used when defined connection mode no URL is specified
        'FALLBACK_HOST_URL': getEnvConfig('FALLBACK_HOST_URL') || 'http://208.95.1.177:23457',
        'AUTO_PAGE_REFRESH_INTERVAL': 60000,
        'TOKEN_QUANTS': 100000000,
        'TX_DEADLINE': 60,
        'apiEndPoint': 'api',
        'SESSION_CURRENT_BLOCK': 'current_block',
        'SESSION_APP_OPTIONS': 'app_options',
        'SESSION_PEER_ENDPOINTS': 'peerEndpoints',
        'SESSION_MAX_RETRIES': '2',
        'SESSION_CURRENT_TRY': '0',
        'EPOCH': getEnvConfig('EPOCH'),
        'SESSION_STORAGE_EXPIRATION': getEnvConfig('SESSION_STORAGE_EXPIRATION'),
        'LEASING_OFFSET_BLOCK': getEnvConfig('LEASING_OFFSET_BLOCK'),
    };
    public static DEFAULT_OPTIONS = {
        'VERSION': getEnvConfig('RELEASE_VERSION'),
        'NETWORK_ENVIRONMENT': getEnvConfig('NETWORK_ENVIRONMENT'),
        'DEADLINE': '60',
        'REFRESH_INTERVAL_MILLI_SECONDS': '60000',
        'TX_HEIGHT': getEnvConfig('TX_HEIGHT'),
        'AUTO_UPDATE': 1,
        // Following values are supported:
         //   - AUTO            Retrieves the node to be used from /api/nodes and take one randomly from the result list or the first if RANDOMIZE_NODES=true
         //   - FOUNDATION      The API endpoint to access the mainnet. Will use the URL defined by FOUNDATION_URL.
         //   - MANUAL          Let the user manually set override API endpoint in die wallet settings (value will be stored in Session store)
         //   - LOCAL_HOST      ?
         //   - TESTNET         The API endpoint to access the testnet. Will use the URL defined by TESTNET_URL.
         //   - LOCALTESTNET    The API endpoint to access the testnet locally. Will use the URL defined by LOCALTESTNET_URL.
         //   - DEVTESTNET      The API endpoint to access the devnet. Will use the URL defined by DEVTESTNET_URL.
         //   - HTTPS           The API endpoint to securly access the mainnet with SSL.
        'CONNECTION_MODE': getEnvConfig('CONNECTION_MODE') || 'LOCALTESTNET',
        'RANDOMIZE_NODES': 1,
        'EXTENSIONS': 1,
        'USER_NODE_URL': getEnvConfig('USER_NODE_URL') || 'http://localhost:23457',
        'LOCALTESTNET_URL': getEnvConfig('LOCALTESTNET_URL') || 'http://node-1',
        'HTTPS_URL': getEnvConfig('HTTPS_URL') || 'https://ssl.infinity-economics.org',
        'FOUNDATION_URL': getEnvConfig('FOUNDATION_URL') || 'http://159.89.117.247:23457',
        'TESTNET_URL': getEnvConfig('TESTNET_URL') || 'http://168.119.228.238:9876',
        'DEVTESTNET_URL': getEnvConfig('DEVTESTNET_URL') || 'http://142.93.129.78:9876',
    };
    public static addressBookConfig = {
        'tableAddressBook': 'addressBook'
    };
    public static assetsConfig = {
        'assetsEndPoint': 'api'
    };

    public static localhostConfig = {
        'apiUrl': 'http://localhost:23457',
        'endPoint': 'api',
        'SESSION_PEER_URL_KEY': 'peerKey'
    };

    public static accountConfig = {
        'accountEndPoint': 'api'
    };

    public static crowdfundingConfig = {
        'crowdfundingEndPoint': 'api'
    };
    public static options = {
        'TX_HEIGHT': getEnvConfig('TX_HEIGHT'),
    };

    public static peerEndpointsMap =  {
        DEFAULT: getEnvConfig('PEER_ENDPOINTS_DEFAULT') || [
            'http://208.95.1.177:8888/api/nodes',
            'http://199.127.137.169:8888/api/nodes',
            'http://35.204.224.241:8888/api/nodes'
        ],
        DEVTESTNET: getEnvConfig('PEER_ENDPOINTS_DEVTESTNET') || [
            'http://185.35.138.132:9999/api/nodes',
        ],
        TESTNET: getEnvConfig('PEER_ENDPOINTS_TESTNET') || [
            'http://168.119.228.238/api/nodes'
        ],
        LOCALTESTNET: getEnvConfig('PEER_ENDPOINTS_LOCALTESTNET') || [
            'http://localhost/peerexplorer-backend/api/nodes'
        ]
    };

    public static loginConfig = {
        SESSION_ACCOUNT_DETAILS_KEY: 'account_details',
        SESSION_ACCOUNT_PRIVATE_KEY: 'account_private_key'
    };

    public static controlConfig = {
        SESSION_ACCOUNT_CONTROL_HASCONTROL_KEY: 'account_control_hascontrol',
        SESSION_ACCOUNT_CONTROL_JSONCONTROL_KEY: 'account_control_jsoncontrol'
    };

    public static dashboardConfig = {
        apiEndPoint: 'api'
    };

    public static fiatConfig = {
        btcEndpoint: getEnvConfig('BTC_ENDPOINT') || 'http://167.99.242.171:8080',
        xinEndpoint: getEnvConfig('XIN_ENDPOINT') || 'http://167.99.242.171:8080'
    };

    public static marketDataConfig = {
        baseUrl: getEnvConfig('MARKET_DATA_BASE_URL') || 'https://min-api.cryptocompare.com',
        endpoint: getEnvConfig('MARKET_DATA_ENDPOINT') || 'data'
    };

    public static exchangesConfig = {
        BLOCKR_URL_END_POINT: getEnvConfig('EXCHANGE_BLOCKR_URL_ENDPOINT') || 'https://blockexplorer.com/api/',
        BLOCKR_ADDRESS_END_POINT: getEnvConfig('EXCHANGE_BLOCKR_ADDRESS_ENDPOINT') || 'addr',
    };

    public static currenciesConfig = {
        currenciesEndPoint: 'api'
    };

    public static escrowConfig = {
        escrowEndPoint: 'api'
    };

    public static subscriptionConfig = {
        subscriptionEndPoint: 'api'
    };
    public static aliasesConfig = {
        aliasesEndPoint: 'api'
    };

    public static shufflingsConfig = {
        shufflingEndPoint: 'api',
    };
    public static ATConfig = {
        ATEndPoint: getEnvConfig('AT_ENDPOINT') || 'api',
        ATCompilerURL: getEnvConfig('AT_COMPILER_URL') || 'http://142.93.63.219:10080', // 'http://185.61.149.71:10080'
    };

    public static messagesConfig = {
        messagesEndPoint: 'api'
    };
    public static searchConfig = {
        searchEndPoint: getEnvConfig('SEARCH_ENDPOINT') || 'api',
        searchAccountString: getEnvConfig('SEARCH_ACCOUNG_STRING') || 'XIN',
        searchPeerUrl: getEnvConfig('SEARCH_PEER_URL') || 'http://168.119.228.238/api/nodes',
        searchPeerEndPoint: getEnvConfig('SEARCH_PEER_ENDPOINT') || 'api/nodes',
    };

    public static pollConfig = {
        pollEndPoint: 'api'
    };

    public static macapViewerConfig = {
        macapUrl: getEnvConfig('MACAP_URL') || 'http://167.99.242.171:8892',
        macapEndPoint: getEnvConfig('MACAP_ENDPOINT') || 'api/v1/get'
    };

    public static newsViewerConfig = {
        newsUrl: getEnvConfig('NEWS_URL') || 'http://199.127.137.169:8889',
        newsEndPoint: getEnvConfig('NEWS_ENDPOINT') || 'api/v1/news'
    };

    public static chainViewerConfig = {
        apiUrl: getEnvConfig('CHAINVIEWER_API_URL') || 'http://199.127.137.169:23457',
        peerUrl: getEnvConfig('CHAINVIEWER_PEER_URL') || 'http://199.127.137.169:8888',
        peerEndPoint: getEnvConfig('CHAINVIEWER_PEER_ENDPOINT') || 'api/nodes',
        endPoint: getEnvConfig('CHAINVIEWER_ENDPOINT') || 'api'
    };
}
