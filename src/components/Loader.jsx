import React from 'react';
import { HashLoader } from 'react-spinners';

const Loader = () => {
    const loaderColor = "#00CED1"; // Dark Cyan/Teal color

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
            <HashLoader color={loaderColor} size={60} />
        </div>
    );
};

export default Loader;
