const { execSync } = require('child_process');

console.log(`ng serve --host 0.0.0.0 --port ${parseInt(process.env.PORT)} --base-href ${process.env.PUBLIC_PATH}/ --disable-host-check`);

execSync("envsub src/env.config.js.template src/env.config.js")

execSync(`ng serve --host 0.0.0.0 --port ${parseInt(process.env.PORT)} --base-href ${process.env.PUBLIC_PATH}/ --disable-host-check`, { stdio: 'inherit' });
