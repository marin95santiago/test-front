import React from 'react'
import { Card, CardMedia, CardContent, Container } from '@mui/material'
import LoginForm from '../components/Login/LoginForm'
import UserContext from '../contexts/user.context'
import { UserContextType } from '../schemas/user.schema'
import { Navigate } from 'react-router-dom'

export default function Login() {

  const { userContext } = React.useContext(
    UserContext
  ) as UserContextType

  if (userContext?.id) {
    return <Navigate to="/" replace />
  } else {
    return (
      <Container component="main" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Card sx={{ bgcolor: '#C9FF85', width: 400 }}>
          <CardMedia
            component="img"
            sx={{ height: 200, objectFit: "contained" }}
            image="https://cdn.pixabay.com/photo/2023/06/03/10/57/insect-8037418_1280.jpg"
            alt="animal"
          />
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </Container>

    )
  }
}
