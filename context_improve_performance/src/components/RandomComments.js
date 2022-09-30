import React from 'react'
import { useGlobalSpinnerActionsContext } from '../context/GlobalSpinnerContext'

const RandomComments = props => {
    console.log('App/GlobalSpinnerContextProvider/RandomComments')
    const setGlobalSpinner = useGlobalSpinnerActionsContext()

    const handleSpinnerTrue = () => {
        // setGlobalSpinner({ type: 'TRUE' })
        setGlobalSpinner(true)
    }
    const handleSpinnerFalse = () => {
        // setGlobalSpinner({ type: 'FALSE' })
        setGlobalSpinner(false)
    }

    return (
        <div>
            <button onClick={handleSpinnerTrue}>
                Toggle Global Spinner - ture
            </button>
            <button onClick={handleSpinnerFalse}>
                Toggle Global Spinner - false
            </button>
        </div>
    )
}

export default RandomComments