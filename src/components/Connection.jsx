import React from 'react';
import Loading from './Loading';
import App from './App';

const jsforce = require('jsforce');
const keytar = require('keytar');
const { ipcRenderer } = require('electron');

const KEYTAR_SERVICE = 'Salesforce Explorer';
const KEYTAR_ACCOUNT = 'Oauth';

export default class Connection extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            conn: null,
        };
    }

    componentDidMount() {
        keytar
            .getPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT)
            .then(result => {
                return JSON.parse(result);
            })
            .then(auth => {
                if (auth == null) {
                    throw new Error('Unable to load connection information');
                }

                this.setState({
                    conn: new jsforce.Connection({
                        instanceUrl: auth.instance_url,
                        accessToken: auth.access_token,
                    }),
                });
            });
    }

    logout() {
        console.log('Attempting to logout...');
        ipcRenderer.send('salesforce-logout', 'logout');
    }

    render() {
        if (!this.state.conn) {
            return <Loading />;
        }
        return (
            <div>
                <App conn={this.state.conn} logout={this.logout} />
            </div>
        );
    }
}
