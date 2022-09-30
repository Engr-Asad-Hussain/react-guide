import React, { useReducer } from 'react';

const Reducers = (state, action) => {
    switch (action.type) {
        case "TRUE": {
            return {
                ...state,
                status: true
            }
        }
        case "FALSE": {
            return {
                ...state,
                status: false
            }
        }
        default:
            throw new Error(`Mismatch action type: ${action.type}`);
    }
};

export function Reducer() {
    console.log('App/Reducer')

    const [state, dispatch] = useReducer(Reducers, {
        status: false,
        auth: null,
    });

    const handleFlagTrue = () => {
        dispatch({ type: 'TRUE' })
    }
    const handleFlagFalse = () => {
        dispatch({ type: 'FALSE' })
    }
    return (
        <div>
            <h3>Hook - useReducer - {JSON.stringify(state.status)}</h3>
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
