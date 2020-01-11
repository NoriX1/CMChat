import React from 'react';
import { ToastsContainer, ToastsStore } from 'react-toasts';

const Toasts = () => {

    return (
        <div>
            <ToastsContainer store={ToastsStore} />
        </div>
    );

}

export default Toasts;