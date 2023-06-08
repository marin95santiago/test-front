import React from 'react'
import {
  TextField,
} from '@mui/material'
import { toast } from 'react-toastify'
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
  LatLng
} from 'use-places-autocomplete'

interface Props {
  setSelected?: React.Dispatch<React.SetStateAction<LatLng | null>>
  setDescriptionAddress?: (address: string) => void
}

/**
 * Autocomplete places with google maps
 * @param props functions to handle information
 * @returns 
 */
export default function PlacesAutocomplete (props: Props) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete()

  const handleSelect = async (address: string) => {
    setValue(address, false)
    clearSuggestions()

    try {
      const results = await getGeocode({ address })
      const { lat, lng } = await getLatLng(results[0])
      if (props.setSelected) {
        props.setSelected({ lat, lng })
      }
      if (props.setDescriptionAddress) {
        props.setDescriptionAddress(address)
      }
    } catch (error) {
      return toast.error(`Error: ${error}`)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <React.Fragment>
      <TextField
        value={value}
        onChange={handleChange}
        label="Address"
        variant='standard'
        disabled={!ready}
        fullWidth
      />
      {status === 'OK' && (
        <ul>
          {data.map((suggestion: any) => (
            <li key={suggestion.place_id} onClick={() => handleSelect(suggestion.description)}>
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
    </React.Fragment>
  )
}
