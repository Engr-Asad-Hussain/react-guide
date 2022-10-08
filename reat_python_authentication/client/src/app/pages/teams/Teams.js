import { useEffect, useState } from 'react';
import { useAxiosPrivate } from 'app/hooks';
import { useNavigate, useLocation } from 'react-router-dom';

export function Teams() {
    console.log('Page: Teams: ', window.location.pathname)
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    const [users, setUsers] = useState();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController()

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('http://localhost:5000/users', {
                    signal: controller.signal,

                });
                console.log('response', response.data)
                isMounted && setUsers(response.data.users)
            } catch (error) {
                console.error(error)
                if (error?.response?.status == 400) {
                    // Refresh token expires, Refresh token missing, Refresh token tempered
                    alert('Cookie is missing ...')
                    navigate('/login', { state: { from: location }, replace: true })
                }
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
            {users?.length ? (
                <table style={{ border: '1px solid black', width: '500px' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black', textAlign: 'left' }}>User Id</th>
                            <th style={{ border: '1px solid black', textAlign: 'left' }}>Email Address</th>
                            <th style={{ border: '1px solid black', textAlign: 'left' }}>Roles</th>
                        </tr>
                    </thead>
                    {users.map((user, index) => {
                        return (
                            <tbody key={index}>
                                <tr>
                                    <td style={{ border: '1px solid black' }}>{user.userId}</td>
                                    <td style={{ border: '1px solid black' }}>{user.username}</td>
                                    <td style={{ border: '1px solid black' }}>{user.role}</td>
                                </tr>
                            </tbody>
                        );
                    })}
                </table>
            ) : (
                <p>No users to display</p>
            )}
        </section>
    )
}