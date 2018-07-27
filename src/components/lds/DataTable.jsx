import React from 'react';

export default class DataTable extends React.Component {
    handleClick(record, headers) {
        if (this.props.onClick) {
            this.props.onClick.apply(null, [record, headers]);
        }
    }

    renderValue(value) {
        if (value === null || value === undefined) {
            return '';
        }

        if (typeof value === 'object') {
            return JSON.stringify(value);
        }

        return value + '';
    }

    render() {
        let { headers, records } = this.props;

        if (!records) {
            records = [];
        }

        if (!headers) {
            headers = Object.keys(records[0]);
        }

        // TODO: Table headers should be fixed at the top

        return (
            <table className="slds-table slds-table--bordered slds-table--cell-buffer">
                <thead>
                    <tr className="slds-text-heading--label">
                        {headers.map((header, i) => (
                            <th
                                key={'header-' + i}
                                scope="col"
                                title="{header}"
                            >
                                <div className="slds-truncate">{header}</div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {records.map((record, i) => (
                        <tr
                            key={'row' + i}
                            onClick={this.handleClick.bind(
                                this,
                                record,
                                headers
                            )}
                        >
                            {headers.map(key => (
                                <td
                                    key={'col-' + i + '-' + key}
                                    data-label={key}
                                >
                                    <div className="slds-truncate">
                                        {this.renderValue(record[key])}
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
}
