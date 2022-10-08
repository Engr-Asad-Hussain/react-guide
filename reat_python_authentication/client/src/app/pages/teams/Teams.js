import { useEffect, useState } from 'react';
import { useAuthState } from 'app/hooks';
import { employees } from 'app/callbacks';
import axios from 'app/callbacks/axios';
import { useRefreshToken } from 'app/hooks';

export function Teams() {
    console.log('Page: Teams: ', window.location.pathname)
    const authState = useAuthState();
    const refresh = useRefreshToken();

    const [users, setUsers] = useState();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController()

        const getUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/users', {
                    signal: controller.signal
                });
                console.log('response', response.data)
                isMounted && setUsers(response.data)
            } catch (error) {
                console.error(error)
            }
        }
        getUsers()

        // UseEffect cleanup function
        // Cleanun function runs as the component unmount
        return () => {
            isMounted = false
            controller.abort()
        }
    }, [])
    return (
        <section>
            <button onClick={() => refresh() }>Button</button>
            {users?.length ? (
                <ul>
                    {users.map((user, index) => {
                        <li key={index}>{user?.username}</li>
                    })}
                </ul>
            ) : (
                <p>No users to display</p>
            )}
        </section>
    )
}