import React, { useState } from 'react'
import { toast } from 'react-toastify'
import {
  Container,
  Typography,
  Divider,
  Button,
  Box,
} from '@mui/material'
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api'
import { LatLng, getGeocode, getLatLng } from 'use-places-autocomplete'
import PlacesAutocomplete from '../Common/PlacesAutocomplete'
import { Store } from '../../schemas/store.schema'
import Utils from '../../utils'

interface Props {
  stores: Store[]
}

export default function Maps(props: Props) {
  const center = React.useMemo(() => ({ lat: -34.6208156, lng: -58.4792291 }), [])
  const [selected, setSelected] = useState<LatLng | null>(null)
  const [stores, setStores] = useState<LatLng[] | null>(null)
  const [route, setRoute] = useState<google.maps.DirectionsResult | null>(null)

  async function createStoreMarkers() {
    const geoCodes = await Promise.all(props.stores.map(store => {
      return getGeocode({ address: store.address })
    }))

    const coordinates = geoCodes.map(geoCode => {
      return getLatLng(geoCode[0])
    })

    setStores(coordinates)

    if (selected) {
      const nearestCoordinate = Utils.calculateNearestCoordinate(coordinates, selected)

      // Get route from selected place to nearest store
      const directionsService = new google.maps.DirectionsService()
      try {
        const result = await directionsService.route({
          origin: selected,
          destination: { lat: nearestCoordinate?.lat ?? 0, lng: nearestCoordinate?.lng ?? 0 },
          travelMode: google.maps.TravelMode.DRIVING
        })
  
        setRoute(result)
      } catch (error) {
        return toast.error(`Error: ${error}`)
      }
    }
  }

  return (
    <Container component="main">
      <Typography variant="h5">Maps</Typography>
      <Divider />
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '30vh',
          width: 400,
        }}
      >
        <Box sx={{ width: '100%' }}>
          <PlacesAutocomplete setSelected={setSelected} />
        </Box>
        <Box sx={{ marginTop: 3 }}>
          <Button onClick={createStoreMarkers} size="small">Calculate nearest stores</Button>
        </Box>
        {center && (
          <Box sx={{ marginTop: 3, width: '100%', height: '400px' }}>

            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={center}
              zoom={10}
            >
              {selected && <Marker position={selected} />}
              {
                stores ?
                  (
                    stores.map((store, index) => (
                      <Marker key={store.lat} label={`${index + 1}`} position={store} />
                    ))
                  ) : ''
              }
              {
                route && (
                  <DirectionsRenderer
                    options={{
                      directions: route,
                      suppressMarkers: true
                    }}
                  />
                )
              }
            </GoogleMap>
          </Box>
        )}
      </Container>
    </Container>
  )
}
