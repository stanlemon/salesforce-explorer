"use strict";

const React = require('react');
const { Link } = require('react-router');

class Header extends React.Component {

    render() {
        const { title, subtitle, menu } = this.props;

        return (
            <div className="slds-page-header" role="banner">
                <div className="slds-grid">
                    <div className="slds-col slds-has-flexi-truncate">
                        <div className="slds-media slds-no-space slds-grow">
                            <div className="slds-media__figure">
                                <svg aria-hidden="true" className="slds-icon slds-icon-standard-user">
                                </svg>
                            </div>
                            <div className="slds-media__body">
                                <p className="slds-text-title--caps slds-line-height--reset">{subtitle}</p>
                                <h1 className="slds-page-header__title slds-m-right--small slds-align-middle slds-truncate" title="this should match the Record Title">{title}</h1>
                            </div>
                        </div>
                    </div>
                    <div className="slds-col slds-no-flex slds-grid slds-align-top">
                        {this.props.menu.map((item) => {
                            const handler = item.handler === undefined ? () => {} : item.handler;

                            return (
                                <div className="slds-button-group" role="group">
                                    <Link className="slds-button slds-button--neutral" to={item.link}>
                                        {item.label}
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

        );
    }
};

Header.defaultProps = {
    title: '',
    subtitle: '',
    menu: [],
};

module.exports = Header;