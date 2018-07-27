import React from 'react';
import Error from './Error';
import Loading from './Loading';
import Header from './lds/Header';
import DataTable from './lds/DataTable';

export default class PushTopicList extends React.Component {
    componentDidMount() {
        this.loadPushTopics(this.props);
    }

    loadPushTopics(props) {
        const { conn } = props;

        if (!conn) return;

        conn.sobject('PushTopic')
            .find()
            .execute((error, records) => {
                if (error) {
                    console.error(error);
                    this.setState({
                        error,
                    });
                    return;
                }

                this.setState({
                    records,
                });
            });
    }

    render() {
        if (!this.state || !this.state.records) {
            return <Loading />;
        }

        if (this.state && this.state.error) {
            return <Error message={this.state.error} />;
        }

        const headers = ['Id', 'Name', 'Query'];

        return (
            <div>
                <Header title="Push Topics" />
                <DataTable
                    headers={headers}
                    records={this.state.records}
                    onClick={record => {
                        console.log(record);
                        this.props.router.push(`/push/${record.Id}`);
                    }}
                />
            </div>
        );
    }
}
