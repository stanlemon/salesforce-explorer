import React from 'react';
import Loading from './Loading';
import Error from './Error';
import Header from './lds/Header';
import DataTable from './lds/DataTable';
import { isEmpty } from 'lodash';

export default class ObjectList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            objects: [],
        };
    }

    componentDidMount() {
        this.loadDescribeGlobal(this.props);
    }

    loadDescribeGlobal(props) {
        const { conn } = props;

        if (!conn) {
            console.log(
                'Failing to load describe call because a connection is not set.',
                conn
            );
            return;
        }

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
        if (isEmpty(this.state.objects)) {
            return <Loading />;
        }

        if (this.state && this.state.error) {
            return <Error message={this.state.error.message} />;
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
