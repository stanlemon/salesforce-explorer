import React from 'react';
import Link from '../Link';

export default class GlobalNavigation extends React.Component {
    render() {
        return (
            <div className="slds-context-bar">
                <div className="slds-context-bar__primary slds-context-bar__item--divider-right">
                    <div className="slds-context-bar__item slds-context-bar__dropdown-trigger slds-dropdown-trigger slds-dropdown-trigger--click slds-no-hover">
                        <div className="slds-context-bar__icon-action">
                            <a
                                href="javascript:void(0);"
                                className="slds-icon-waffle_container slds-context-bar__button"
                            >
                                <div className="slds-icon-waffle">
                                    <div className="slds-r1" />
                                    <div className="slds-r2" />
                                    <div className="slds-r3" />
                                    <div className="slds-r4" />
                                    <div className="slds-r5" />
                                    <div className="slds-r6" />
                                    <div className="slds-r7" />
                                    <div className="slds-r8" />
                                    <div className="slds-r9" />
                                </div>
                                <span className="slds-assistive-text">
                                    Open App Launcher
                                </span>
                            </a>
                        </div>
                        <span className="slds-context-bar__label-action slds-context-bar__app-name">
                            <span
                                className="slds-truncate"
                                title="{this.props.appName}}"
                            >
                                {this.props.appName}
                            </span>
                        </span>
                    </div>
                </div>
                <nav className="slds-context-bar__secondary" role="navigation">
                    <ul className="slds-grid">
                        {this.props.menu.map(item => {
                            const handler =
                                item.handler === undefined
                                    ? () => {}
                                    : item.handler;

                            return (
                                <li
                                    key={item.label}
                                    className="slds-context-bar__item"
                                >
                                    <Link
                                        onClick={handler}
                                        className="slds-context-bar__label-action"
                                        to={item.link}
                                    >
                                        <span className="slds-truncate">
                                            {item.label}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        );
    }
}
