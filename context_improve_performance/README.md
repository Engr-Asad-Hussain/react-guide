# Improved performance strategy when using useContext with useReducer or useContext with useState
This project will instruct the proformance optimization of react application when dealing with useContext...

## Guide
I have followed this guide to understand the performance difference of react application using ContextAPI
https://www.telerik.com/blogs/how-to-use-context-api-with-hooks-efficiently-while-avoiding-performance-bottlenecks

## Observation
- Option 2 will increase your react performance.

#### Option 1
```js
import React, { useState, createContext, useContext } from 'react'

export const GlobalSpinnerContext = createContext()
export const GlobalSpinnerActionsContext = createContext()

export const useGlobalSpinnerContext = () => useContext(GlobalSpinnerContext)
export const useGlobalSpinnerActionsContext = () => useContext(GlobalSpinnerActionsContext)

const GlobalSpinnerContextProvider = (props) => {
    console.log('App/GlobalSpinnerContextProvider')
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
```

#### Option 2
```js
import React, { useState, createContext, useContext } from 'react'

export const GlobalSpinnerContext = createContext()

export const useGlobalSpinnerContext = () => useContext(GlobalSpinnerContext)

const GlobalSpinnerContextProvider = (props) => {
    console.log('App/GlobalSpinnerContextProvider')
    const [isGlobalSpinnerOn, setGlobalSpinner] = useState(false)

    return (
        <GlobalSpinnerContext.Provider value={{isGlobalSpinnerOn, setGlobalSpinner}}>
            {props.children}
        </GlobalSpinnerContext.Provider>
    )
}

export default GlobalSpinnerContextProvider
```

