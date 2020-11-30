import 'bootstrap/dist/css/bootstrap.css'

import buildClient from '../api/build-client'
import Header from '../components/header'

// define a custom app component - which Next uses to wrap all of our custom components - so we can include global bootstrap css for all of our components
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  )
}

// appContext is different than using getInitialProps in Pages

AppComponent.getInitialProps = async (appContext) => {
  // get a configured axios instance
  const client = buildClient(appContext.ctx)

  const { data } = await client.get('/api/users/currentuser')

  let pageProps = {}
  // check if the page has a getInitialProps
  if (appContext.Component.getInitialProps) {
    // manually execute getInitialProps for the individual pages
    // Recall this no longer auto invokes when we use get props in _app
    pageProps = await appContext.Component.getInitialProps(appContext.ctx)
  }

  return {
    pageProps,
    currentUser: data.currentUser
  }

}

export default AppComponent
