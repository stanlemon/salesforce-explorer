import React from 'react';

export default function Error({ message }) {
    // TODO: Style this red or something...
    return (
        <div style={{ padding: 10 }}>
            <div>
                <strong>An error has occurred:</strong>
            </div>
            <div>{message}</div>
        </div>
    );
}
