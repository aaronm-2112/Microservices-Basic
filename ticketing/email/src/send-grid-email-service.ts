import sgMail from '@sendgrid/mail'


// set the API key for the service
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

// export the send grid mail object with the set API key
export default sgMail 