global.window = {};
global.fetch = require('node-fetch');
const renderApp = require('./renderApp').default;

renderApp().then((result) => console.log(result));
