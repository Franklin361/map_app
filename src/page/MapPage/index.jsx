import React from 'react'
import { useSocketMapBox } from '../../hooks/useSocketMapBox';

import './style.css'

const puntoInit = {
    lng: -100.1679,
    lat: 25.8974,
    zoom: 15
}

const index = () => {


    const {mapaDiv,lat, lng, zoom,} = useSocketMapBox(puntoInit);

    return (
        <>
            <div className="info">
                <p>Longitud: {lng}</p> 
                <p>Latitud: {lat}</p>
                <p>Zoom: {zoom}</p>
            </div>
            <div ref={mapaDiv} className="mapContainer" />
        </>
    )
}


export default index
