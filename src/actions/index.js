
const INCREMENT = 'INCREMENT';
const AUTHENTICATE = 'AUTHENTICATE';
const UNATHENTINCATE = 'UNATHENTINCATE';

module.exports = {
    INCREMENT,
    AUTHENTICATE,
    UNATHENTINCATE,

    increment: () => {
        return {
            type: INCREMENT
        };
    },

    authenticate: (accessToken, instanceUrl) => {
        return {
            type: AUTHENTICATE,
            accessToken,
            instanceUrl
        };
    },

    unauthenticate: () => {
        return {
            type: UNATHENTINCATE
        };
    }
};
