'use strict';

const React = require('react');

function Button({ label, onClick }) {
    return (
        <button onClick={onClick} className="slds-button slds-button--neutral slds-not-selected" aria-live="assertive">
            <span className="slds-text-not-selected">
                {label}
            </span>
        </button>
    );
}

Button.defaultProps = {
    label: '',
    onClick: () => {},
};

module.exports = Button;
