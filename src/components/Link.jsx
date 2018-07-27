import React from 'react';
import { Link } from 'react-router-dom';

export default function({ className, onClick, to, children }) {
    return (
        <Link className={className} onClick={onClick} to={to}>
            {children}
        </Link>
    );
}
