const actions = require('../actions/');
const defaultState = {
    auth: false,
    counter: 0,
    debugUsername: process.env.DEBUG_USERNAME,
    debugPassword: process.env.DEBUG_PASSWORD
};

module.exports = (state = defaultState, action) => {
    switch (action.type) {
        case actions.AUTHENTICATE:
            return Object.assign({}, state, { auth: true });
        case actions.INCREMENT:
            return { counter: state.counter+1 };
        default:
            return state;
    }
};
