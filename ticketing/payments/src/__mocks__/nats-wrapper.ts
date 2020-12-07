export const natsWrapper = {
  client: {
    // we want this called as it tells us if we attempt to publish to NATS
    publish: jest.fn().mockImplementation((subject: string, data: string, callback: () => void) => {
      callback()
    })
  }
}