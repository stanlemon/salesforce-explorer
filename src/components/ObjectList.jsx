import React from 'react';
import Header from './lds/Header';
import DataTable from './lds/DataTable';

export default class ObjectList extends React.Component {
    componentWillMount() {
        this.loadDescribeGlobal(this.props);
    }

    componentWillReceiveProps(props) {
        this.loadDescribeGlobal(props);
    }

    loadDescribeGlobal(props) {
        const { conn } = props;

        if (!conn) return;

        conn.describeGlobal((error, res) => {
            if (error) {
                console.error(error);
                this.setState({
                    error,
                });
                return;
            }

            this.setState({
                objects: res.sobjects,
            });
        });
    }

    render() {
        if (this.state && this.state.error) {
            return <div>{this.state.error.message}</div>;
        }

        if (!this.state || !this.state.objects) {
            return (
                <div className="padding">
                    <em>Loading objects...</em>
                </div>
            );
        }

        return (
            <div>
                <Header title="Objects" />
                <DataTable
                    headers={['keyPrefix', 'name', 'label', 'custom']}
                    records={this.state.objects}
                    onClick={record => {
                        this.props.history.push(`/objects/${record.name}`);
                    }}
                />
            </div>
        );
    }
}
