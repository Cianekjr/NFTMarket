import { ReactNode, useEffect, useState } from "react"

interface IProps {
  children: ReactNode
}

export const ClientOnly = (props: IProps) => {
  const { children } = props

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => setIsMounted(true), [])

  if (!isMounted) {
    return null
  }

  return <>{children}</>
}
