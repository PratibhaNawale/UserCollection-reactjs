import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = () => {
    return (
        <tr>
            <td><div className="skeleton skeleton-text"></div></td>
            <td><div className="skeleton skeleton-text"></div></td>
            <td><div className="skeleton skeleton-text"></div></td>
            <td><div className="skeleton skeleton-text"></div></td>
        </tr>
    );
};

export default SkeletonLoader;
