import React from 'react';
import Loading from './Loading';
import Header from './lds/Header';
import DataTable from './lds/DataTable';

export default class RecordList extends React.Component {
    componentDidMount() {
        this.loadSObjects(this.props);
    }

    loadSObjects(props) {
        const { conn, route } = props;
        const { params } = route;
        const { name } = params;

        if (!conn) return;

        conn.sobject(name)
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

        const { route } = this.props;
        const { name } = route.params;

        const headers = ['Id', 'Name'].concat(
            Object.keys(this.state.records[0])
                .filter(v => v !== 'attributes' && v !== 'Id' && v !== 'Name')
                .sort()
        );

        return (
            <div>
                <Header title={name} subtitle="Records" />
                <DataTable
                    headers={headers}
                    records={this.state.records}
                    onClick={record => {
                        this.props.history.push(
                            `/records/${name}/${record.Id}`
                        );
                    }}
                />
            </div>
        );
    }
}
