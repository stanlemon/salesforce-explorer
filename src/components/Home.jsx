import React from 'react';
import Header from './lds/Header';

export default class Home extends React.Component {
    render() {
        return (
            <div>
                <Header title="Salesforce Exploer" />
                <div className="padding">
                    <p>Welcome...</p>
                </div>
            </div>
        );
    }
}
