"use client"

import React, { useRef, useEffect, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { RawSignal } from './types'

interface MapComponentProps {
  data: RawSignal[];
  map: React.MutableRefObject<maplibregl.Map | null>
  setMarkers: (markers: Record<string, maplibregl.Marker>) => void
}

export default function MapComponent({ data, map }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [lng, setLng] = useState(-70.9)
  const [lat, setLat] = useState(42.35)
  const [zoom, setZoom] = useState(9)

  useEffect(() => {
    if (map.current) return // initialize map only once

    map.current = new maplibregl.Map({
      container: mapContainer.current!,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [lng, lat],
      zoom: zoom
    })

    map.current.on('move', () => {
      if (map.current) {
        setLng(parseFloat(map.current.getCenter().lng.toFixed(4)))
        setLat(parseFloat(map.current.getCenter().lat.toFixed(4)))
        setZoom(parseFloat(map.current.getZoom().toFixed(2)))
      }
    })

    // Add navigation control (zoom buttons)
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right')
  }, [])

  useEffect(() => {
    if (!map.current || !data.length) return

    // Remove existing markers
    const existingMarkers = document.getElementsByClassName('maplibregl-marker')
    while (existingMarkers[0]) {
      existingMarkers[0].parentNode?.removeChild(existingMarkers[0])
    }

    // let markers: Record<string, maplibregl.Marker> = {}

    // Add new markers
    data.forEach((signal) => {
      if (signal.position) {
        const [lat, lng] = signal.position.LatLng.split(',').map(parseFloat)
        const marker = new maplibregl.Marker()
          .setLngLat([lng, lat])
          .addTo(map.current!)
        // markers[signal.position.LatLng + signal.position.timestamp] = marker
        // Add popup
        const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
          `<strong>Time:</strong> ${new Date(signal.position.timestamp).toLocaleString()}<br>
           <strong>Accuracy:</strong> ${signal.position.accuracyMeters} meters<br>
           <strong>Altitude:</strong> ${signal.position.altitudeMeters.toFixed(2)} meters<br>
           <strong>Speed:</strong> ${signal.position.speedMetersPerSecond.toFixed(2)} m/s`
        )

        marker.setPopup(popup)
      }
    })

    // Fit bounds to markers
    if (data.length > 0) {
      const bounds = new maplibregl.LngLatBounds()
      data.forEach((signal) => {
        if (signal.position) {
          const [lat, lng] = signal.position.LatLng.split(',').map(parseFloat)
          bounds.extend([lng, lat])
        }
      })
      map.current.fitBounds(bounds, { padding: 50 })
    }
    // setMarkers(markers)
  }, [data])

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute top-0 right-0 left-0 bottom-0" />
      <div className="absolute top-0 left-0 m-2 bg-white bg-opacity-80 p-2 rounded">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
    </div>
  )
}