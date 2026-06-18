
Register takes 2 props: name and options. option uses the registerOptions which is given below.

Register have a bunch of validation, if we dont use zod schema, we can use those validations.

Also the registerOptions have the value Transformation. Because everything rhf takes is in the string form. If we want to inforce the value as number or date , then we can use the transformation.



type RegisterOptions = {
  // validation
  required?: boolean | string
  min?: number | { value: number, message: string }
  max?: number | { value: number, message: string }
  minLength?: number | { value: number, message: string }
  maxLength?: number | { value: number, message: string }
  pattern?: RegExp | { value: RegExp, message: string }
  validate?: (value) => boolean | string

  // transformation
  valueAsNumber?: boolean
  valueAsDate?: boolean
  setValueAs?: (value) => any

  // other
  disabled?: boolean
  onChange?: (e) => void
  onBlur?: (e) => void
  value?: unknown
}