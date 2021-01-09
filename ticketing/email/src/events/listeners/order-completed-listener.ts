// import the OrderCompleted event
// import the stan client 

// import the queuegroupname 

// setup the listener 
//    extract the orderid, email, and status of the completed order
//    query for the completed order with mongoose
//    mark the order as complete 
//       save the order
//    query for the ticket with the associated orderid and version 
//    create an email data object 
//    provide the email to sendgrid and send the email  