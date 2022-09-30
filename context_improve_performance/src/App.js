import React from 'react';
import GlobalSpinner from './components/GlobalSpinner'
import RandomComments from './components/RandomComments'
import PageA from './components/PageA'
import GlobalSpinnerContextProvider from './context/GlobalSpinnerContext';

function App() {
	console.log('App')
	return (
		<GlobalSpinnerContextProvider>
			<div>
				<GlobalSpinner />
				<RandomComments />
				<PageA />
			</div>
		</GlobalSpinnerContextProvider>
	);
}

export default App;