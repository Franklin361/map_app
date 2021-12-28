import { useContext, useEffect } from "react"
import { SocketContext } from "../context/SocketContext";
import { useMapBox } from "./useMapBox";


export const useSocketMapBox = (puntoInit) => {

    const {
        mapaDiv, 
        lat, lng, zoom,
        nuevoMarcador$, 
        movimientoMarcador$, 
        agregarMarcador,
        actualizarUbicacion} = useMapBox(puntoInit);

    const { socket } = useContext(SocketContext);

    useEffect(() => {
        socket.on('marcadores-activos', marcadores => {
            for (const key of Object.keys(marcadores)) {
                agregarMarcador( marcadores[key], key )
            }
        })
    }, [])

    useEffect(() => {
        
        nuevoMarcador$.subscribe( marcador =>{
            socket.emit('marcador-nuevo', marcador )
            
        })

    }, [nuevoMarcador$, socket])


    useEffect(() => {
        
        movimientoMarcador$.subscribe( marcador => {
            socket.emit('marcador-actualizado', marcador)

        })

    }, [movimientoMarcador$,socket]);

    useEffect(() => {
        socket.on('marcador-actualizado', (marcador)=>{
            actualizarUbicacion(marcador)
        })
    }, [socket])

    useEffect(() => {
        socket.on('marcador-nuevo',(marcador)=>{
            agregarMarcador(marcador, marcador.id)
        })
    }, [socket])


    return {
        mapaDiv, 
        lat, lng, zoom,
    }
}
