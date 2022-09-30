# Re-rendering difference between useState and useReducer
This repository contains code that reflects the rendering diff between useState and useReducer ...

## Observations
React version: 18.2.0
- useState: 
  - If we try to change the state in useState, the entire component will re-renders.
  - What if we try the change the state in useState using onClick function (setState) but this time onClick function is returning the state's previous value? The entire component will **not** re-render again and again.

- useReducer: 
  - If we try to change the state in useReducer, the entire component will re-renders.
  - What if we try the change the state in useReducer using onClick function (dispatch) but this time onClick function is returning the state's previous value? The entire component will re-render again and again.

## Project
- Clone the repository
- Install dependencies
- Start the react application
- Observe the instructions presented in the browser and keep an eye on the console.