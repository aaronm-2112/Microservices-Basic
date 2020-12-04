import { Publisher, Subjects, ExpirationCompleteEvent } from '@ecomtickets/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
}