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

    constructor(props) {
        super(props);
        this.state = {
            conn: null
        };
    }

    componentWillMount() {
        keytar.getPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT).then((result) => {
            return JSON.parse(result);
        }).then((auth) => {
            if (auth !== null) {
                this.setState({
                    conn: new jsforce.Connection({
                        oauth2: {
                            clientId: config.client_id,
                            clientSecret: config.client_secret,
                            redirectUri: config.redirect_uri,
                        },
                        instanceUrl: auth.instance_url,
                        accessToken: auth.access_token,
                        refreshToken: auth.refresh_token,
                    })
                });
            } // else throw an error!
        });
    }

    logout() {
        console.log('Attempting to logout...');
        ipcRenderer.send('salesforce-logout', 'logout');
    }

    render() {
        return (
            <div>
                <div className="titlebar" style={{ "WebkitAppRegion": "drag" }} />

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
                        Object.assign({}, this.props, { conn: this.state.conn })
                    )}
                </div>
            </div>
        );
    }
};
