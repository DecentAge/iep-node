window.envConfig = {
    RELEASE_VERSION: '',

    NETWORK_ENVIRONMENT: 'testnet',

    APP_BASE_HREF:      '' || '/wallet',

    CONNECTION_MODE: 	'LOCALTESTNET',
    FALLBACK_HOST_URL: 	'http://localhost:23457',
    USER_NODE_URL: 		'http://localhost:23457',
    LOCALTESTNET_URL: 	'http://localhost:23457',
    HTTPS_URL: 			'http://localhost:23457',
    FOUNDATION_URL: 	'http://localhost:23457',
    TESTNET_URL: 		'http://localhost:23457',
    DEVTESTNET_URL: 	'http://localhost:23457',

    PEER_ENDPOINTS_DEFAULT: 		['https://apps-test.infinity-economics.io/peerexplorer-backend/api/nodes'],
    PEER_ENDPOINTS_DEVTESTNET: 		['https://apps-test.infinity-economics.io/peerexplorer-backend/api/nodes'],
    PEER_ENDPOINTS_TESTNET: 		['https://apps-test.infinity-economics.io/peerexplorer-backend/api/nodes'],
    PEER_ENDPOINTS_LOCALTESTNET:	['https://apps-test.infinity-economics.io/peerexplorer-backend/api/nodes'],

    BTC_ENDPOINT: 'https://apps-test.infinity-economics.io/iep-static-site/master-config',
    XIN_ENDPOINT: 'https://apps-test.infinity-economics.io/iep-static-site/master-config',

    MARKET_DATA_BASE_URL: 'https://min-api.cryptocompare.com',

    EXCHANGE_BLOCKR_URL_ENDPOINT: 'https://blockexplorer.com/api/',

    AT_COMPILER_URL: 'http://142.93.63.219:10080',
    
    SEARCH_PEER_URL: 'http://node-1/peerexplorer-backend/api/nodes',

    MACAP_URL: 'https://apps-test.infinity-economics.io//mcap-backend',

    NEWS_URL: 'http://node-1:8889',

    CHAINVIEWER_API_URL: 'http://node-1:23457',
    CHAINVIEWER_PEER_URL: 'http://199.127.137.169:8888',

    SESSION_STORAGE_EXPIRATION: 60 * 60 * 1000, // 1 hour

    EPOCH: 1484046000 || 1484046000,
    TX_HEIGHT: 10080 || 7 * 1440,
    LEASING_OFFSET_BLOCK: 3000 || 3000,
}
