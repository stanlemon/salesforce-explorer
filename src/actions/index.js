
const INCREMENT = 'INCREMENT';
const AUTHENTICATE = 'AUTHENTICATE';

module.exports = {
    INCREMENT,
    AUTHENTICATE,

    increment: () => {
        return {
            type: INCREMENT
        };
    },

    authenticate: () => {
        return {
            type: AUTHENTICATE
        };
    }
};
