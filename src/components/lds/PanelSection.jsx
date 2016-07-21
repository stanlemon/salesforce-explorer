"use strict";

const React = require('react');

module.exports = class PanelSection extends React.Component {

    render() {
        const { title, children } = this.props;

        return (
            <div className="slds-panel__section">
                <h3 className="slds-text-heading--small slds-m-bottom--medium">{title}</h3>
                {children}
            </div>
        );
    }
};
