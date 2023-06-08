import React from 'react'
import { Navigate } from 'react-router-dom'
import UserContext from '../../contexts/user.context'
import { UserContextType } from '../../schemas/user.schema'

/**
 * Validation of token
 * @param props 
 * @returns 
 */
export default function ProtectRoute(props: any) {

  const { userContext } = React.useContext(
    UserContext
  ) as UserContextType

  if (userContext.id) {
    return props.children
  } else {
    return <Navigate to="/login" replace />
  }
}
