'use strict';

const { omit } = require('react');
const React = require('react');

module.exports = class Panel extends React.Component {

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
};
