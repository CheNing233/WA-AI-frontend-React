import {useWebSocketStore} from "@/store/websocket";
import {backendWsUrl} from "@/config/serviceUrl";
import {useEffect} from "react";
import Sockette from "sockette";
import eventbus from "@/eventbus";
import cookie from 'react-cookies'


const Websocket = () => {
    const [ws, setWs] = useWebSocketStore((state) => {
        return [state.ws, state.setWs]
    })

    const handleInitWs = () => {
        const token = cookie.load('token')
        if (!token) {
            console.log('WebSocket token', token);
            return null
        }

        const newWs = new Sockette(`${backendWsUrl}/${token}`, {
            timeout: 5000,
            maxAttempts: 10,
            onopen: (e) => {
                console.log('WebSocket Connected', e);
                eventbus.emit('websocket.connected', e)
            },
            onmessage: (e) => {
                console.log('WebSocket Message', e);
                eventbus.emit('websocket.message', e)
            },
            onreconnect: (e) => {
                console.log('WebSocket Reconnecting', e);
                eventbus.emit('websocket.reconnect', e)
            },
            onclose: (e) => {
                console.warn('WebSocket Closed', e);
                eventbus.emit('websocket.close', e)
            },
            onerror: (e) => {
                console.error('WebSocket Error', e);
                eventbus.emit('websocket.error', e)
            },
            onmaximum: (e) => {
                console.error('WebSocket Maximum Attempts Reached', e);
                eventbus.emit('websocket.maximum', e)
            }
        })

        console.log('WebSocket init', `${backendWsUrl}/${token}`)
        // newWs.send('WebSocket init')
        setWs(newWs)

        return () => {
            newWs?.close()
            setWs(null)
        }
    }

    useEffect(() => {
        let releaseFunc = null

        const timer = setInterval(() => {
            releaseFunc = handleInitWs()
            if (releaseFunc !== null)
                clearInterval(timer)
        }, 3000)

        return () => {
            releaseFunc?.()
            clearInterval(timer)
        }
    }, []);

    return null
}

export default Websocket