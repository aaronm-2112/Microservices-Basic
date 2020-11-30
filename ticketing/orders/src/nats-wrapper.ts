import nats, { Stan } from 'node-nats-streaming'

// A singleton of nats client
class NatsWrapper {
  private _client?: Stan // tell ts this will be undefined for some time

  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting')
    }

    return this._client
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url })

    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS')
        resolve()
      })

      this.client.on('error', (err) => {
        reject(err)
      })
    })
  }

}

// a single instance of natsWrapper class that any module can import
export const natsWrapper = new NatsWrapper()