/* eslint max-classes-per-file: 0 */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["beforeShow", "next", "prev"] }] */

import { containerErrorsStore } from '../store'
import { validateContext } from '../utils'
import type { DetailFieldDescription } from '../../admin/fields/FieldDescription'
import type { WizardStepButtonDescription } from '../buttons'
import { getDefaultButtons } from '../buttons'
import type { Accessor } from '../../typing'

type WizardState = Promise<string>

type WizardPayload = { [key: string]: any }

const defaultLayout = { x: 1, y: 1, xs: 12 }

abstract class BaseWizardStep {
  title: string

  resourceName?: string

  forwardStepLabel?: string = 'Далее'

  backStepLabel?: string = 'Назад'

  requireValidation?: boolean = true

  buttons: WizardStepButtonDescription[] = getDefaultButtons(this)

  abstract widgets: DetailFieldDescription[]

  constructor(title: string, resourceName?: string | undefined) {
    this.title = title
    this.resourceName = resourceName
  }

  getButtons(_: WizardPayload): WizardStepButtonDescription[] {
    return this.buttons
  }

  beforeShow(_: WizardPayload): void {}

  next(_: WizardPayload): WizardState {
    return Promise.resolve('forward')
  }

  prev(_: WizardPayload): WizardState {
    return Promise.resolve('back')
  }

  validatedNext(props: WizardPayload): WizardState {
    validateContext(this.widgets, props.mainWizardObject)

    if (containerErrorsStore.getState().length > 0) {
      return Promise.resolve('invalid_form')
    }

    return this.next(props)
  }
}

abstract class BaseWizard {
  title: string

  layout?: object = defaultLayout

  allowToggle?: Accessor<boolean>

  isExpanded?: Accessor<boolean>

  abstract stateWidgetMapping: { [key: string]: BaseWizardStep }

  abstract machine: { [key: string]: object | string }

  constructor(title: string, allowToggle?: Accessor<boolean>, isExpanded?: Accessor<boolean>) {
    this.title = title
    this.allowToggle = allowToggle
    this.isExpanded = isExpanded
  }

  transition(currentState: string, action: string): string {
    const state = this.machine[currentState]

    return state[action as keyof typeof state]
  }
}

export { BaseWizardStep, WizardState, BaseWizard, WizardPayload }
