import React, { useContext } from 'react'
import axios, { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  Avatar,
  CardActions,
  Button
} from '@mui/material'
import UserService from '../../services/user.service'
import UserContext from "../../contexts/user.context"
import { UserContextType } from "../../schemas/user.schema"
import { ServerError } from '../../schemas/error.schema'

type State = {
  user: string,
  password: string
}

const initState: State = {
  user: '',
  password: ''
}

export default function LoginForm() {

  const [state, setState] = React.useState<State>(initState)
  const navigate = useNavigate()

  const { setUserContext } = useContext(
    UserContext
  ) as UserContextType

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    const { id, value } = event.target
    setState({
      ...state,
      [id]: value
    })
  }

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      const userService = new UserService()
      const user = await userService.login(state.user, state.password)
      if (user) {
        setUserContext(user)
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<ServerError>
        if (serverError && serverError.response) {
          return toast.error(serverError.response.data.message)
        }
      }
    }
    return navigate('/')
  }

  return (
    <form onSubmit={login}>
      <Card >
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "#ECF89E"}} aria-label="recipe">
              S
            </Avatar>
          }
          title="Inicio de sesión"
          subheader="version 1.0.0"
        />
        <CardContent>
          <Grid container spacing={1}>
            <Grid xs={12} sm={12} item>
              <TextField
                id='user'
                label='Username'
                placeholder='Username'
                variant='standard'
                value={state.user}
                onChange={(e) => handleChange(e)}
                fullWidth
                required
              />
            </Grid>
            <Grid xs={12} sm={12} item>
              <TextField
                id='password'
                label='Password'
                placeholder='Password'
                variant='standard'
                value={state.password}
                onChange={(e) => handleChange(e)}
                type='password'
                fullWidth
                required
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ marginTop: 5 }}>
          <Button type="submit" size="small">Login</Button>
        </CardActions>
      </Card>
    </form>
  )
}
