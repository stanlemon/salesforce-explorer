import React from 'react';
import Header from './lds/Header';
import DataTable from './lds/DataTable';
import Alert from './lds/Alert';
import Button from './lds/Button';

export default class SoqlView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            query: '',
            error: null,
            total: 0,
            records: [],
        };
    }

    handleQuery(event) {
        this.setState({
            query: event.target.value,
        });
    }

    handleSoql() {
        if (this.state.query.length === 0) {
            return;
        }

        this.props.conn.query(this.state.query, (error, result) => {
            if (error) {
                console.error({ error });
                this.setState({ error });
            } else {
                this.setState({
                    error: null,
                    total: result.totalSize,
                    records: result.records,
                });
            }
        });
    }

    render() {
        const headers =
            this.state.records.length === 0
                ? []
                : [].concat(
                      Object.keys(this.state.records[0])
                          .filter(v => v !== 'attributes')
                          .sort()
                  );

        const textareaCss = {
            outline: 'none',
            borderTop: 'none',
            borderRight: 'none',
            borderLeft: 'none',
            borderBottom: '1px solid #d8dde6',
            padding: 10,
            fontFamily: "'Monaco', 'Courier New', 'Courier'",
            width: '100%',
            height: '5em',
        };

        // TODO: Add loading and error components

        return (
            <div>
                <Header title="SOQL" subtitle="Query reocrds" menu={[]} />
                {this.state.error && (
                    <Alert
                        type="error"
                        message={`${this.state.error.name}: ${
                            this.state.error.message
                        }`}
                    />
                )}
                <textarea
                    value={this.state.query}
                    onChange={this.handleQuery.bind(this)}
                    style={textareaCss}
                    placeholder="SELECT Id, Name, CreatedDate FROM Account ORDER BY Name LIMIT 10"
                />
                <div style={{ padding: 10 }}>
                    <Button
                        label="Query"
                        onClick={this.handleSoql.bind(this)}
                    />
                </div>
                {this.state.records.length > 0 && (
                    <DataTable
                        headers={headers}
                        records={this.state.records}
                        onClick={record => {
                            // TODO: If the table's results include id we can link directly to a view of the full record
                        }}
                    />
                )}
            </div>
        );
    }
}
