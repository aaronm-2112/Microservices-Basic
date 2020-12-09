// import buildClient from '../api/build-client'
import Link from 'next/link'
const LandingPage = ({ currentUser, tickets }) => {

  const ticketList = tickets.map(ticket => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`} >
            <a>View</a></Link>
        </td>
      </tr>
    )
  })

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {ticketList}
        </tbody>
      </table>
    </div>
  )

  // console.log(tickets)
  // return currentUser ? <h1>You are signed in</h1> : <h1>You are NOT signed in</h1>
}

// specific to Nextjs
// we can fetch the data this page will need during the server side rendering process using this method
// this server side rendering helper method only happens once per component
// it is used for initial rendering of our app
// get initial props is also called in the browser sometimes
// to tell if on the server or the browser use typeof window
// does not auto invoke b/c there is a getprops in the _app component
LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets')

  return { tickets: data }
}

export default LandingPage