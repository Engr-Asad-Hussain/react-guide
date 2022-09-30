import React, { useState, createContext, useReducer, useContext } from 'react'

export const GlobalSpinnerContext = createContext()
export const GlobalSpinnerActionsContext = createContext()

export const useGlobalSpinnerContext = () => useContext(GlobalSpinnerContext)
export const useGlobalSpinnerActionsContext = () => useContext(GlobalSpinnerActionsContext)

const Reducer = (state, action) => {
    console.log('App/Reducer')
    switch (action.type) {
        case "TRUE": {
            return true
        }
        case "FALSE": {
            return false
        }
        default:
            throw new Error(`Mismatch action type: ${action.type}`);
    }
};

const GlobalSpinnerContextProvider = (props) => {
    console.log('App/GlobalSpinnerContextProvider')
    // const [isGlobalSpinnerOn, setGlobalSpinner] = useReducer(Reducer, false)
    const [isGlobalSpinnerOn, setGlobalSpinner] = useState(false)

    return (
        <GlobalSpinnerContext.Provider value={isGlobalSpinnerOn}>
            <GlobalSpinnerActionsContext.Provider value={setGlobalSpinner}>
                {props.children}
            </GlobalSpinnerActionsContext.Provider>
        </GlobalSpinnerContext.Provider>
    )
}

export default GlobalSpinnerContextProvider