import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from 'app/context';
import { AppRoutes } from 'app/routes';

function App() {
	console.log('App: ', window.location.pathname)
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route path='/*' element={<AppRoutes />} />
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
