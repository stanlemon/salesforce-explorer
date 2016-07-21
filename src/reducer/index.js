const actions = require('../actions/');
const defaultState = {
    accessToken: null,
    instanceUrl: null,
    debugUsername: process.env.DEBUG_USERNAME,
    debugPassword: process.env.DEBUG_PASSWORD
};

const { routerReducer } = require('react-router-redux');

function app(state, action) {
    switch (action.type) {
        case actions.UNATHENTINCATE:
            return Object.assign({}, state, { accessToken: null, instanceUrl : null })
        case actions.AUTHENTICATE:
            return Object.assign({}, state, { accessToken: action.accessToken, instanceUrl: action.instanceUrl });
        default:
            return state;
    }
}
    
module.exports = (state = defaultState, action) => {
    return {
        ...app(state, action),
        routing: routerReducer(state.routing, action)
    };
};
