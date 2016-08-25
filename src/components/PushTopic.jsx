"use strict";

const React = require('react');
const { Link } = require('react-router');
const { Header, DataTable } = require('./lds');

module.exports = class PushTopic extends React.Component {

    componentWillMount() {
        console.log("Streaming topic...", this.props.conn.streaming);
        this.props.conn.streaming.topic("FoobarTopic").subscribe((message) => {
            this.setState({
                messages: this.state.messages.concat([message])
            });
            console.log(message, this.state.messages);
        });
    }

    render() {
        if (!this.state || !this.state.messages) {
            return (
                <div><em>Loading messages...</em></div>
            );
        }

        return (
            <div>
                <Header title="PushTopic"/>
                {this.state.messages.map((message) =>
                    <div>
                        {message + ''}
                    </div> 
                )}
            </div>
        );
    }
};
