const actions = require('../actions/');

const { routerReducer } = require('react-router-redux');

function app(state, action) {
    switch (action.type) {
        default:
            return state;
    }
}

module.exports = (state = {}, action) => {
    return {
        ...app(state, action),
        routing: routerReducer(state.routing, action)
    };
};
