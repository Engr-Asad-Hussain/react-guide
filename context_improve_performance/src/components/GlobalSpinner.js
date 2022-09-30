import React from 'react'
import './globalSpinner.css'
import { useGlobalSpinnerContext } from '../context/GlobalSpinnerContext'

const GlobalSpinner = props => {
    console.log('App/GlobalSpinnerContextProvider/GlobalSpinner')
    const isGlobalSpinnerOn = useGlobalSpinnerContext()

    return isGlobalSpinnerOn ? (
        <div>
            <p>Loading...</p>
        </div>
    ) : null
}

export default GlobalSpinner