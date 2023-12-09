export type TErrorSouces = {
  path: string | number
  message: string
}[]

export type TGenericErrorResponse = {
  statusCode: number
  message: string
  errorSouces: TErrorSouces
}
