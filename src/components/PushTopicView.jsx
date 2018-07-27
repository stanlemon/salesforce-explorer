import React from 'react';
import Header from './lds/Header';

export default class PushTopicView extends React.Component {
    constructor() {
        super();

        this.state = {
            messages: [],
        };
    }

    componentWillMount() {
        this.loadPushTopic(this.props);
    }

    componentWillReceiveProps(props) {
        this.loadPushTopic(props);
    }

    loadPushTopic(props) {
        const { conn, route } = props;
        const { params } = route;
        const { id } = params;

        if (!conn) return;

        conn.sobject('PushTopic').retrieve(id, (error, pushTopic) => {
            if (error) {
                console.error(error);
                this.setState({
                    error,
                });
                return;
            }

            this.setState({
                pushTopic,
            });

            conn.streaming.topic(pushTopic.Name).subscribe(message => {
                console.log(message);

                this.setState({
                    messages: [message, ...this.state.messages],
                });
            });
        });
    }

    render() {
        if (!this.state || !this.state.pushTopic) {
            return (
                <div className="padding">
                    <em>Loading...</em>
                </div>
            );
        }

        if (this.state && this.state.error) {
            return <div className="padding">{this.state.error}</div>;
        }

        return (
            <div>
                <Header
                    title={this.state.pushTopic.Name}
                    subtitle="Push Topic"
                />

                <div className="padding">
                    <p>
                        New events will automatically appear below as they are
                        pushed to this topic.
                    </p>

                    {this.state.messages.map(message => (
                        <pre key={message.event.replayId}>
                            {JSON.stringify(message, null, 2) + ''}
                        </pre>
                    ))}
                </div>
            </div>
        );
    }
}
