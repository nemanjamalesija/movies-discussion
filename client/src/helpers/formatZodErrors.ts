import { ZodError } from 'zod'

export default function formatZodErrors(error: ZodError): string {
  const formattedErrors = error.format()

  const errors = Object.values(formattedErrors).map((el) => el)
  const errorString = errors
    .filter((item) => Object.prototype.hasOwnProperty.call(item, '_errors'))
    //@ts-ignore
    .map((item) => item._errors.join(', '))
    .join('; ')

  return `Invalid input data: ${errorString}`
}
