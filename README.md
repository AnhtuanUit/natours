## Natours Web App

### Overview

Welcome to the Natours web application! This project is based on the skills you've gained from completing the Udemy course: [Node.js, Express, MongoDB & More: The Complete Bootcamp 2024](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/). The course covers the entire modern back-end stack, and you've learned to build a complete, beautiful, and real-world application, featuring both an API and a server-side rendered website.

### GitHub Repository

Explore the source code and contribute to the project on GitHub: [Natours GitHub](https://github.com/AnhtuanUit/natours)

### Video Demo and Live Application

[![Watch the Demo Video](https://img.youtube.com/vi/jo0hrj23-i8/0.jpg)](https://youtu.be/jo0hrj23-i8)

Click on the image above or use this [link](https://www.youtube.com/watch?v=jo0hrj23-i8) to watch the demo video.

Explore the live demo of the Natours web application: [Natours Demo](https://natours-8ogu.onrender.com/)

**Note:** The live demo is hosted on a free hosting service, and it may take about 1 or 2 minutes for the server to wake up if it's in a sleeping state.


### What You've Learned

- **Mastered the Entire Modern Back-End Stack:**
  - Node.js, Express, MongoDB, and Mongoose (MongoDB JS driver).

- **Built a Complete, Beautiful & Real-World Application:**
  - From start to finish, including both an API and a server-side rendered website.

- **Built a Fast, Scalable, Feature-Rich RESTful API:**
  - Includes filters, sorts, pagination, and many more advanced features.

- **Learned How Node Really Works Behind the Scenes:**
  - Explored the event loop, blocking vs non-blocking code, streams, modules, etc.

- **CRUD Operations with MongoDB and Mongoose:**
  - Acquired proficiency in handling database operations.

- **Deep Dive into Mongoose:**
  - Explored all advanced features of Mongoose.

- **Worked with Data in NoSQL Databases:**
  - Included handling geospatial data.

- **Advanced Authentication and Authorization:**
  - Implemented advanced security features, including password reset functionality.

- **Security Measures:**
  - Covered encryption, sanitization, rate limiting, and other security practices.

- **Server-Side Website Rendering with Pug Templates:**
  - Utilized Pug templates for server-side rendering.

- **Credit Card Payments with Stripe:**
  - Integrated payment processing using Stripe.

- **Sending Emails & Uploading Files:**
  - Implemented features for sending emails and handling file uploads.

- **Deployment to Production:**
  - Deployed the final application to production, including a Git crash-course.

### Test Accounts

Feel free to use the following test accounts to explore the application:

1. **Admin Account**
   - Username: sophie@example.com
   - Password: "test1234"

2. **User Account**
   - Username: sophie@example.com
   - Password: "test1234"

### Setup

Follow these steps to set up the Natours web application on your local machine:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/AnhtuanUit/natours.git
   cd natours
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Install Nodemon (if not already installed globally):**
   ```bash
   npm install nodemon --global
   ```

4. **Create `config.env` File:**
   Create a `config.env` file in the root of the project and add the necessary configuration (refer to the previous README for details).

   ```env
   NODE_ENV=development
   PORT=3000

   DATABASE=mongodb+srv://your-username:your-password@cluster0.your-mongodb.net/natours?retryWrites=true&w=majority
   DATABASE_PASSWORD=your-database-password

   JWT_SECRET=this-is-my-jsonwebtoken-secret-32
   JWT_EXPIRES_IN=90d
   JWT_COOKIE_EXPIRES_IN=90

   # Mailhog
   MAIL_HOG_HOST=localhost
   MAIL_HOG_PORT=1025

   # Uncomment and fill in the following details for other mail services if needed
   # MAILTRAP_HOST='smtp.mailtrap.io'
   # MAILTRAP_PORT=587
   # MAILTRAP_PASSWORD=your-mailtrap-password
   # MAILTRAP_USERNAME=your-mailtrap-username
   # GMAIL_HOST='smtp.gmail.com'
   # GMAIL_PORT=465
   # GMAIL_PASSWORD='your-gmail-password'
   # GMAIL_USERNAME='your-gmail-username@gmail.com'
   # MJ_APIKEY_PUBLIC=your-mailjet-public-key
   # MJ_APIKEY_PRIVATE=your-mailjet-private-key

   EMAIL_FROM=your-email@example.com

   STRIPE_SECRET_KEY=your-stripe-secret-key
   STRIPE_PUBLIC_KEY=your-stripe-public-key
   ```

5. **Import Test Data:**
   ```bash
   npm run data:import
   ```

6. **Start the Application:**
   ```bash
   npm start
   ```

7. **Access the Application:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Note

- This application is optimized for desktop usage.
- For any issues or contributions, please visit the [GitHub repository](https://github.com/AnhtuanUit/natours).

Thank you for using Natours! 😄


