import React from 'react';
import Link from '../Link';

export default class GlobalNavigation extends React.Component {
    render() {
        const nodragCss = {
            userSelect: 'none',
            WebkitAppRegion: 'drag',
        };

        return (
            <div className="slds-context-bar" style={nodragCss}>
                <div className="slds-context-bar__primary">
                    <div className="slds-context-bar__item slds-context-bar__dropdown-trigger slds-dropdown-trigger slds-dropdown-trigger_click slds-no-hover">
                        <div className="slds-context-bar__icon-action">
                            <button
                                className="slds-button slds-icon-waffle_container slds-context-bar__button"
                                title="Description of the icon when needed"
                            >
                                <span className="slds-icon-waffle">
                                    <span className="slds-r1" />
                                    <span className="slds-r2" />
                                    <span className="slds-r3" />
                                    <span className="slds-r4" />
                                    <span className="slds-r5" />
                                    <span className="slds-r6" />
                                    <span className="slds-r7" />
                                    <span className="slds-r8" />
                                    <span className="slds-r9" />
                                </span>
                                <span className="slds-assistive-text">
                                    Open App Launcher
                                </span>
                            </button>
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
                <nav className="slds-context-bar__secondary">
                    <ul className="slds-grid">
                        {this.props.menu.map(item => {
                            const handler =
                                item.handler === undefined
                                    ? () => {}
                                    : item.handler;

                            // TODO: Check path against the menu item to see if it is active and add this class: slds-is-active
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
