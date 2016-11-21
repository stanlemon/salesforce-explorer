'use strict';

const React = require('react');

function Alert({ type, message }) {
    return (
        <div className={`slds-notify slds-notify--alert slds-theme--${type} slds-theme--alert-texture`} role="alert">
            <h2>{message}</h2>
        </div>
    );
}

Alert.defaultProps = {
    type: 'error',
    message: '',
};

module.exports = Alert;
