import React from 'react'
import { SocketProvider } from './context/SocketContext'
import MapPage from './page/MapPage'

const App = () => {

  return (
    <SocketProvider>
    <MapPage/>
    </SocketProvider>
  )
}

export default App
