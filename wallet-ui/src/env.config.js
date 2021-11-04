window.envConfig = {
    RELEASE_VERSION: '',

    NETWORK_ENVIRONMENT: 'testnet',

    APP_BASE_HREF:      '' || '/wallet',

    NODE_API_URL: 	'http://localhost:23457',

    PEER_ENDPOINTS: 		['https://apps-test.infinity-economics.io/peerexplorer-backend/api/nodes'],

    XIN_ENDPOINT: 'https://apps-test.infinity-economics.io/iep-static-site/master-config',

    MARKET_DATA_BASE_URL: 'https://min-api.cryptocompare.com',

    EXCHANGE_BLOCKR_URL_ENDPOINT: 'https://blockexplorer.com/api/',

    AT_COMPILER_URL: 'http://142.93.63.219:10080',
    
    SEARCH_PEER_URL: 'http://node-1/peerexplorer-backend/api/nodes',

    SESSION_STORAGE_EXPIRATION: 60 * 60 * 1000, // 1 hour

    EPOCH: 1484046000 || 1484046000,
    TX_HEIGHT: 10080 || 7 * 1440,
    LEASING_OFFSET_BLOCK: 3000 || 3000,
}

window.XRS = {
    growl: console.info,
    getState: () => "TEST"
}
