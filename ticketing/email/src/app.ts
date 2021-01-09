// Plan:
//    1. Create two models: Orders and tickets   [Finished]
//    2. Add email to Orders in all services and in Common for all Order Events
//    3. Create the listener in Email service that listens for OrderComplete 
//       -Send an email to the user with the ticket and order information
//    3.5: Create testes to ensure the listener is functioning properly 
//    4. Allow a user to manually resend a verification email to themselves using the Email service 
//    4.5: Create tests to ensure a user is able to properly manually resend a verificvation email
//    5. Create the infra files
//    6. Add to Skaffold?
//    7. Add service to the CI/CD pipeline 
