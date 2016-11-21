'use strict';

const jsforce = require('jsforce');
const React = require('react');
const { Link } = require('react-router');
const keytar = require('keytar');
const { ipcRenderer } = require('electron');
const GlobalNavigation = require('./lds/GlobalNavigation');

const config = require('../../config.json');

const KEYTAR_SERVICE = 'Salesforce Explorer';
const KEYTAR_ACCOUNT = 'Oauth';

module.exports = class App extends React.Component {

    componentWillMount() {
        const auth = JSON.parse(keytar.getPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT));

        if (auth !== null) {
            this.conn = new jsforce.Connection({
                oauth2: {
                    clientId: config.client_id,
                    clientSecret: config.client_secret,
                    redirectUri: config.redirect_uri,
                },
                instanceUrl: auth.instance_url,
                accessToken: auth.access_token,
                refreshToken: auth.refresh_token,
            });
        } // else throw an error!
    }

    logout() {
        ipcRenderer.send('logout', '');
    }

    render() {
        return (
            <div>
                <div className="titlebar" />

                <div className="menubar">
                    <GlobalNavigation appName="Explorer" menu={[
                        {
                            label: 'Home',
                            link: '/',
                            handler: () => {},
                        },
                        {
                            label: 'Object',
                            link: '/objects',
                            handler: () => {},
                        },
                        {
                            label: 'SOQL',
                            link: '/soql',
                            handler: () => {},
                        },
                        {
                            label: 'Push Topics',
                            link: '/push',
                            handler: () => {},
                        },
                        {
                            label: 'Logout',
                            link: '',
                            handler: () => {
                                this.logout();
                            }
                        }
                    ]} />
                </div>

                <div className="content">
                    {React.cloneElement(
                        this.props.children,
                        Object.assign({}, this.props, { conn: this.conn })
                    )}
                </div>
            </div>
        );
    }
};
