import React from 'react';
import Error from './Error';
import Loading from './Loading';
import Header from './lds/Header';

export default class PushTopicView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [],
        };
    }
    componentDidMount() {
        this.loadPushTopic(this.props);
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
            return <Loading />;
        }

        if (this.state && this.state.error) {
            return <Error message={this.state.error} />;
        }

        return (
            <div>
                <Header
                    title={this.state.pushTopic.Name}
                    subtitle="Push Topic"
                />

                <div style={{ padding: 10 }}>
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
