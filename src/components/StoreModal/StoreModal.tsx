import * as React from 'react'
import { toast } from 'react-toastify'
import axios, { AxiosError } from 'axios'
import {
  Modal,
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  TextField
} from '@mui/material'
import { ServerError } from '../../schemas/error.schema'
import StoreService from '../../services/store.service'
import UserContext from "../../contexts/user.context"
import { UserContextType } from "../../schemas/user.schema"
import PlacesAutocomplete from '../Common/PlacesAutocomplete'

interface Props {
  open: boolean
  handleModal: () => void
}

type State = {
  code: string
  name: string
  address: string
  state: string
  county?: string
  postalCode?: string
  list?: File
}

const initState: State = {
  name: '',
  code: '',
  address: '',
  state: ''
}

export default function PaymentAccountModal(props: Props) {

  const [state, setState] = React.useState<State>(initState)

  const { userContext } = React.useContext(
    UserContext
  ) as UserContextType

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    const { id, value } = event.target
    setState({
      ...state,
      [id]: value
    })
  }

  function handleAddress(address: string) {
    setState({
      ...state,
      address: address
    })
  }

  // Save list file in State
  function saveList(files: FileList | null) {
    const file = files?.[0]
    if (file) {
      const fileName = file.name;
      if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
        setState((prevState) => ({
          ...prevState,
          list: file,
        }))
      } else {
        // the file has incorrect format
        return toast.error('The file must have the extension ".xls" or ".xlsx')
      }
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      // validation, file is required
      if (!state.list){
        return toast.error('Require list')
      }
      const storeService = new StoreService(userContext.token ?? '')
      await storeService.save(state)
      setState(initState)
      props.handleModal()
      return toast.success(`Store created successfully`)
    } catch (error) {
      props.handleModal()
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<ServerError>
        if (serverError && serverError.response) {
          return toast.error(serverError.response.data.message || error.toString())
        }
      }
    }
  }

  return (
    <Modal
      open={props.open}
      onClose={() => props.handleModal()}
      aria-labelledby="store form"
    >
      <Container component="main" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: 500 }}>
        <form onSubmit={(e) => submit(e)}>
          <Card >
            <CardHeader
              title="New Store"
              subheader="Create a new store"
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid xs={6} sm={6} item>
                  <TextField
                    id='code'
                    label='Code'
                    placeholder='Code'
                    variant='standard'
                    value={state.code}
                    onChange={(e) => handleChange(e)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid xs={6} sm={6} item>
                  <TextField
                    id='name'
                    label='Name'
                    placeholder='Name'
                    variant='standard'
                    value={state.name}
                    onChange={(e) => handleChange(e)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid xs={12} sm={12} item>
                  <PlacesAutocomplete setDescriptionAddress={handleAddress} />
                </Grid>
                <Grid xs={6} sm={6} item>
                  <TextField
                    id='state'
                    label='State'
                    placeholder='State'
                    variant='standard'
                    value={state.state}
                    onChange={(e) => handleChange(e)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid xs={6} sm={6} item>
                  <TextField
                    id='county'
                    label='County'
                    placeholder='County'
                    variant='standard'
                    value={state.county}
                    onChange={(e) => handleChange(e)}
                    fullWidth
                  />
                </Grid>
                <Grid xs={6} sm={6} item>
                  <TextField
                    id='postalCode'
                    label='PostalCode'
                    placeholder='Postal Code'
                    variant='standard'
                    value={state.postalCode}
                    onChange={(e) => handleChange(e)}
                    fullWidth
                  />
                </Grid>

                <Grid
                  xs={6}
                  sm={6}
                  item
                  container
                  direction='row'
                  justifyContent='flex-end'
                  alignItems='flex-end'
                >
                  <label htmlFor="list">
                    <input
                      id='list'
                      type='file'
                      style={{ display: 'none' }}
                      onChange={(e) => saveList(e.target.files)}
                    />
                    <Button color={state.list ? "success" : "secondary"} variant="contained" component="span">
                      Upload list
                    </Button>
                  </label>
                </Grid>

              </Grid>
            </CardContent>
            <CardActions sx={{ marginTop: 5 }}>
              <Button type="submit" size="small">Save</Button>
            </CardActions>
          </Card>
        </form>
      </Container>
    </Modal>
  )
}
