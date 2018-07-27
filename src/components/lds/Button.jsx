import React from 'react';

function Button({ label, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="slds-button slds-button--neutral slds-not-selected"
            aria-live="assertive"
        >
            <span className="slds-text-not-selected">{label}</span>
        </button>
    );
}

Button.defaultProps = {
    label: '',
    onClick: () => {},
};

export default Button;
