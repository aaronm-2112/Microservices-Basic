import buildClient from '../api/build-client'

const LandingPage = ({ currentUser }) => {
  return currentUser ? <h1>You are signed in</h1> : <h1>You are NOT signed in</h1>
}

// specific to Nextjs
// we can fetch the data this page will need during the server side rendering process using this method
// this server side rendering helper method only happens once per component
// it is used for initial rendering of our app
// get initial props is also called in the browser sometimes
// to tell if on the server or the browser use typeof window
// does not auto invoke b/c there is a getprops in the _app component
LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context)
  // get a configured axios instance
  const { data } = await client.get('/api/users/currentuser')

  return data
}

export default LandingPage