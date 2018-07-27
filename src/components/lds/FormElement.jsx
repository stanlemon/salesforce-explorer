import React from 'react';

export default class FormElement extends React.Component {
    render() {
        const { label, children } = this.props;

        return (
            <div className="slds-form-element slds-hint-parent slds-has-divider--bottom">
                <span className="slds-form-element__label">{label}</span>
                <div className="slds-form-element__control">
                    <span className="slds-form-element__static">
                        {children}
                    </span>
                </div>
            </div>
        );
    }
}
