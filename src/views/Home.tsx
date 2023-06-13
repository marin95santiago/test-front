import React from 'react'
import { toast } from 'react-toastify'
import { Navigate } from 'react-router-dom'
import axios, { AxiosError } from 'axios'
import {
  Container,
  Card,
  CardHeader,
  Button,
  CardContent
} from '@mui/material'
import { ServerError } from '../schemas/error.schema'
import { Store } from '../schemas/store.schema'
import StoreService from '../services/store.service'
import DataTable from "../components/Common/DataTable"
import UserContext, { initialContextUserState } from "../contexts/user.context"
import { UserContextType } from "../schemas/user.schema"
import StoreModal from '../components/StoreModal/StoreModal'
import Maps from '../components/Home/Maps'
import Utils from '../utils'

const CALCULATE_ROUTE_PERMISSION = "calculate_route"

const columns = [
  {
    field: 'code',
    label: 'Code'
  },
  {
    field: 'name',
    label: 'Name'
  },
  {
    field: 'address',
    label: 'Address'
  },
  {
    field: 'state',
    label: 'State'
  },
  {
    field: 'county',
    label: 'County'
  },
  {
    field: 'postalCode',
    label: 'Postal Code'
  }
]

interface State {
  stores: Store[]
  showStoreModal: boolean
}

const initState: State = {
  stores: [],
  showStoreModal: false
}

export default function Home() {

  const [state, setState] = React.useState(initState)

  const { userContext, setUserContext } = React.useContext(
    UserContext
  ) as UserContextType

  React.useEffect(() => {
    loadData()
  }, [state.showStoreModal])

  async function loadData() {
    try {
      const storeService = new StoreService(userContext.token ?? '')
      const stores = await storeService.getStores()

      return setState({
        ...state,
        stores
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<ServerError>
        if (serverError && serverError.response) {
          return toast.error(serverError.response.data.message || error.toString())
        }
      }
    }
  }

  function handleModal () {
    return setState({
      ...state,
      showStoreModal: !state.showStoreModal
    })
  }

  async function downloadList(row: any) {
    try {
      const storeService = new StoreService(userContext.token ?? '')
      await storeService.getStoreList(row.code ?? '')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<ServerError>
        if (serverError && serverError.response) {
          return toast.error(serverError.response.data.message || error.toString())
        }
      }
    }
  }

  async function removeStore(row: any) {
    try {
      const storeService = new StoreService(userContext.token ?? '')
      await storeService.deleteStore(row.code ?? '')
      loadData()
      return toast.success(`Store deleted successfully`)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<ServerError>
        if (serverError && serverError.response) {
          return toast.error(serverError.response.data.message || error.toString())
        }
      }
    }
  }

  function onLogOut () {
    setUserContext(initialContextUserState)
    Utils.removeCookieAuth()
    return <Navigate to="/login" replace />
  }

  const actions = [
    {
      label: 'D', // Download
      alt: 'download',
      action: downloadList
    },
    {
      label: 'R', // Remove
      alt: 'remove',
      action: removeStore
    }
  ]

  return (
    <React.Fragment>
      <Container component="main" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Card sx={{ width: 800 }}>
          <CardHeader 
            title="Stores"
            subheader="September 25, 2023"
            action={
              <React.Fragment>
                <Button onClick={handleModal}>Add store</Button>
                <Button onClick={onLogOut}>Log out</Button>
              </React.Fragment>
            }
          />
          <CardContent>
            <Container sx={{ marginBottom: 10 }}>
              <DataTable columns={columns} rows={state.stores} actions={actions}  />
            </Container>
            {
              userContext.permissions.map(permission => (
                // protected funcionality
                permission === CALCULATE_ROUTE_PERMISSION ?
                (
                  <Container key={permission}>
                    <Maps stores={state.stores} />
                  </Container>
                ) : ''
              ))
            }
            
          </CardContent>
        </Card>
      </Container>
      <StoreModal open={state.showStoreModal} handleModal={handleModal} />
    </React.Fragment>
  )
}
