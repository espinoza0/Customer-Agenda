import { createContext, useState } from "react"

const AuthContext = createContext()

const AuthProvider = ({children}) =>  {
  const [hasAcces, setHasAccess] = useState(false)

  return (
    <AuthContext.Provider value={{hasAcces, setHasAccess}}>
      {children}
    </AuthContext.Provider>
  )
}

export {AuthContext, AuthProvider}
