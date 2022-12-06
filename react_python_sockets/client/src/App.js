import { useEffect } from 'react';
import { io } from 'socket.io-client';

const notificationBaseURL = 'http://localhost:5000'
export const socket = io(notificationBaseURL, {
	autoConnect: true,
	reconnection: true,
	reconnectionAttempts: 10,
	reconnectionDelay: 10000,
});

function App() {
	socket.on('connect', (socket) => {
		console.log('Payload: ', socket);
	});

	const handleSendNotification = () => {
		socket.emit('recipient', 'Client says ...')
	};

	// socket.on('connect', () => {
	// 	socket.emit('json', { "token": 'accessToken' })
	// });

	const handleSendJSON = () => {
	};

	useEffect(() => {
		socket.on('provider', (payload) => {
			console.log('Server is sending ... ', payload)
		});

		return () => {
			socket.off('provider')
		}
	}, []);

	return (
		<div>
			<button onClick={handleSendNotification}>Send Notification Message</button>
			<button onClick={handleSendJSON}>Send Notification JSON</button>
		</div>
	);
}

export default App;
