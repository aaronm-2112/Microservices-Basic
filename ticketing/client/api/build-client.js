import axios from 'axios'

// Purpose: Build an axios client that is configured to make api calls
//          One configuration is for api calls from the server side
//          The second config is for api calls made form the browser
export default ({ req }) => {
  if (typeof window === 'undefined') {
    // we are on the server

    return axios.create({
      baseURL: 'http://ticketing-dev-ingress-nginx-controller.default.svc.cluster.local',
      headers: req.headers
    })
  } else {
    // we must be on the browser
    return axios.create({
      baseURL: '/'
    })
  }
}

// A good summary of what is happening above

// if (typeof window === 'undefined') {
//   // we are on the server
//   // requests should be made to http://SERVICENAME.NAMESPACE.svc.cluster.local
//   const { data } = await axios.get(
//     'http://ticketing-dev-ingress-nginx-controller.default.svc.cluster.local/api/users/currentuser', {
//     // headers: {
//     //   Host: 'ticketing.dev' // tell ingress-nginx what domain this route is looking for
//     // }
//     headers: req.headers // similar to above, except we now include all of the incoming request headers in the new request
//   }
//   )

//   return data
// } else {
//   // we are on the browser
//   // requests can be made with a base url of '' [browser will put the base domain for us]
//   const { data } = await axios.get('/api/users/currentuser')
//   // {currentUser: {}}
//   return response.data
// }