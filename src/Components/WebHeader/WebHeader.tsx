import React from 'react';
import { Link } from 'react-router-dom';

export const WebHeader = () => {
    return (
        <div className="web-header">
            <div className="text-wrapper">Buy</div>
            <div className="div">Rent</div>
            <div className="text-wrapper-2">Sell</div>
            <Link to="/comingsoon" className="text-wrapper-3">Advertise</Link>
            <div className="text-wrapper-4">Sign In</div>
            <div className="text-wrapper-5">Daobitat</div>
        </div>
    );
};