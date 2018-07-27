import React from 'react';
import App from './App';

const jsforce = require('jsforce');
const keytar = require('keytar');
const { ipcRenderer } = require('electron');

const config = require('../../config.json');

const KEYTAR_SERVICE = 'Salesforce Explorer';
const KEYTAR_ACCOUNT = 'Oauth';

export default class Connection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            conn: null,
        };
    }

    componentWillMount() {
        keytar
            .getPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT)
            .then(result => {
                return JSON.parse(result);
            })
            .then(auth => {
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
                        }),
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
                <App conn={this.state.conn} />
            </div>
        );
    }
}
