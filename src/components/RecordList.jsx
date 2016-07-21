"use strict";

const React = require('react');
const { Header, DataTable } = require('./lds');

module.exports = class RecordList extends React.Component {

    componentWillMount() {
        const { name } = this.props.params;

        this.props.conn.sobject(name).find().execute((error, records) => {
            if (error) {
                console.error(error);
                this.setState({
                    error
                });
                return;
            }

            this.setState({
                records
            });
        });
    }

    render() {
        if (!this.state || !this.state.records) {
            return (
                <div><em>Loading...</em></div>
            );
        }

        const { name } = this.props.params;

        const headers = ['Id', 'Name'].concat(Object.keys(this.state.records[0]).filter((v) =>
            v !== 'attributes' && v !== 'Id' && v !== 'Name'
        ).sort());

        return (
            <div>
                <Header title={name} />
                <DataTable
                    headers={headers}
                    records={this.state.records}
                    onClick={(record) => {
                        console.log(record);
                        this.props.router.push(`/records/${name}/${record.Id}`)
                    }}
                />
            </div>
        );
    }
};
