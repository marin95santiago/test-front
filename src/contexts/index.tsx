import * as React from 'react'
import { UserContextProvider } from './user.context'

export default function GlobalProvider(props: any) {
  return (
    <UserContextProvider>
      {props.children}
    </UserContextProvider>
  )
}