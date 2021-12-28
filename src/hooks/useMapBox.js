import { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl';
import { v4 } from "uuid";
import { Subject } from 'rxjs'

mapboxgl.accessToken = 'pk.eyJ1IjoiZnJhbmtvMzYxIiwiYSI6ImNraXBjdXQ2YzA1MGcydGw3OTNta3lkNWgifQ.dDooExcrHvZCnS45LzXOkg';


export const useMapBox = (puntoInit) => {

    const mapaDiv = useRef();
    const mapa = useRef();
    const [cords, setCords] = useState(puntoInit);
    const marcadores = useRef({});

    const movimientoMarcador = useRef(new Subject());
    const nuevoMarcador = useRef(new Subject());

    const agregarMarcador = useCallback((e, id) => {
        const { lng, lat } = e.lngLat || e;
        const marker = new mapboxgl.Marker();
        marker.id = id ?? v4();

        marker.setLngLat([lng, lat]).addTo(mapa.current).setDraggable(true);

        marcadores.current[marker.id] = marker;

        if (!id) {
            nuevoMarcador.current.next({
                id: marker.id,
                lng, lat
            })
        }

        marker.on('drag', ({ target }) => {
            const { id } = target
            const { lng, lat } = target.getLngLat();

            movimientoMarcador.current.next({ id, lng, lat })
        });

    }, [])

    const actualizarUbicacion = useCallback(({id, lng, lat}) => {
        
        marcadores.current[id].setLngLat([ lng, lat ]);

    }, [])

    useEffect(() => {

        const map = new mapboxgl.Map({
            container: mapaDiv.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [puntoInit.lng, puntoInit.lat],
            zoom: puntoInit.zoom
        });

        mapa.current = map;

    }, []);

    useEffect(() => {

        mapa.current?.on('move', () => {

            const { lng, lat } = mapa.current.getCenter()
            setCords({
                lng: lng.toFixed(4),
                lat: lat.toFixed(4),
                zoom: mapa.current.getZoom().toFixed(2)

            })
        });

        return () => {
            mapa.current?.off('move')
        }

    }, [])

    useEffect(() => {

        mapa.current?.on('click', agregarMarcador)

    }, [])

    return {
        ...cords,
        mapaDiv,
        marcadores,
        agregarMarcador,
        nuevoMarcador$: nuevoMarcador.current,
        movimientoMarcador$: movimientoMarcador.current,
        actualizarUbicacion
    }
}
