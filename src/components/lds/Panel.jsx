import React from 'react';

export default class Panel extends React.Component {
    render() {
        const { children } = this.props;

        return (
            <div className="slds-panel slds-grid slds-grid--vertical slds-nowrap">
                <div className="slds-form--stacked slds-grow slds-scrollable--y">
                    {children}
                </div>
            </div>
        );
    }
}
