"use strict";

const React = require('react');
const { Link } = require('react-router');
const { Header, DataTable } = require('./lds');

module.exports = class PushTopicView extends React.Component {

    constructor() {
        super();

        this.state = {
            messages: []
        };
    }

    componentWillMount() {
        const { id } = this.props.params;

        this.props.conn.sobject("PushTopic").retrieve(id, (error, pushTopic) => {
            if (error) {
                console.error(error);
                this.setState({
                    error
                });
                return;
            }

            this.setState({
                pushTopic
            });

            this.props.conn.streaming.topic(pushTopic.Name).subscribe((message) => {
                console.log(message);

                this.setState({
                    messages: [message, ...this.state.messages]
                });
            });
        });
    }

    render() {
        if (!this.state || !this.state.pushTopic) {
            return (
                <div><em>Loading...</em></div>
            );
        }

        if (this.state && this.state.error) {
            return (
                <div>{this.state.error}</div>
            );
        }

        const title = `PushTopic: ${this.state.pushTopic.Name}`;

        return (
            <div>
                <Header title={title} />
                <p>New events will automatically appear below as they are pushed to this topic.</p>

                {this.state.messages.map(message =>
                    <pre key={message.event.replayId}>{JSON.stringify(message, null, 2) + ''}</pre> 
                )}
            </div>
        );
    }
};
