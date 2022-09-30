import React, { useState } from 'react';

export function State() {
    console.log('App/State')

    const [flag, setFlag] = useState(false);

    const handleFlagTrue = () => {
        setFlag(true)
    }
    const handleFlagFalse = () => {
        setFlag(false)
    }
    return (
        <div>
            <h3>Hook - useState - {JSON.stringify(flag)}</h3>
            <p>Note: Click button multiple times and check the console</p>
            <button onClick={handleFlagTrue}>
                Flag - True
            </button>
            <button onClick={handleFlagFalse}>
                Flag - False
            </button>
        </div>
    );
}
