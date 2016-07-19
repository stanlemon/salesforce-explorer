"use strict";

const React = require('react');

module.exports = class Header extends React.Component {

    render() {
        const { title, subtitle } = this.props;

        return (
            <div className="slds-page-header" role="banner">
                <div className="slds-media slds-media--center">
                    <div className="slds-media__body">
                        <p className="slds-page-header__title slds-truncate slds-align-middle" title={title}>{title}</p>
                        {subtitle && 
                            <p className="slds-text-body--small page-header__info">{subtitle}</p>
                        }
                    </div>
                </div>
            </div>
        );
    }
};
