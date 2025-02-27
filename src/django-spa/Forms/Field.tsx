import React, { ElementType, RefObject, useCallback, useRef } from 'react'
import { ControlRefProps, useField, useFieldValidation, ValidationResult, Validator } from '@cdk/Forms'
import { makeWithLayout, PropsWithDefaultLayout } from '@cdk/Layouts'

import type { NodeProps } from './types'
import { Simple } from './Layouts'

export const Field = makeWithLayout(({ name, as, validator, ...other }: FieldProps<unknown, ControlProps<unknown>>) => {
  const controlRef = useRef<ControlRefProps>(null)
  const { value, onChange } = useField(name, controlRef)
  const { errors, validate } = useFieldValidation(name, value, validator || defaultValidator)

  const handleChange = useCallback(
    async (v: unknown) => {
      await validate(v)
      onChange(v)
    },
    [onChange, validate]
  )

  // Don't found why, but type declaration necessary here https://github.com/microsoft/TypeScript/issues/28631#issuecomment-477240245
  const Component: ElementType = as
  return {
    Control: <Component ref={controlRef} value={value} onChange={handleChange} {...other} />,
    Errors: errors && errors.length ? errors[0].message : '',
  }
}, Simple) as <T, P extends ControlProps<T>>(
  props: PropsWithDefaultLayout<FieldProps<T, P>, { Control: JSX.Element }>
) => JSX.Element

function defaultValidator(): Promise<ValidationResult> {
  return Promise.resolve({ success: true })
}

interface ControlProps<T> {
  value: T
  onChange: (val: T) => void
  ref: RefObject<ControlRefProps | undefined>
}

interface BaseFieldProps<T, P> extends NodeProps {
  as: ElementType<P & ControlProps<T>>
  validator?: Validator
}

type FieldProps<T, P> = BaseFieldProps<T, P> & Omit<P, keyof BaseFieldProps<T, P> | keyof ControlProps<T>>
