export interface IMarketItem {
  tokenId: string
  price: string
  owner: string
  name: string
  imageUrl: string
  description: string
  isListed: boolean
}

export interface ITokenUri {
  name: string
  imageUrl: string
  description: string
}

type AsyncReturnType<T> = T extends (...args: any[]) => Promise<infer R> ? R : any

type Filter<T, U> = T extends U ? T : never

export type InferNextProps<T> = Filter<AsyncReturnType<T>, { props: any }>["props"]
