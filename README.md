## Form Builder

A full-stack application that allows admins to generate custom forms, manage questions, and publish them to the world to collect responses.

## Feature

*   **Form** **Generation**:click-to-add interface for building forms.
    
*   **Publishing**:Generate public links for forms to share and collect responses.
    
*   **Response** **Collection**: Collect and view user submissions in real-time.
    
*   **Authentication**: Google Login support for easy sign-ins.
    
*   **Media** **Support**: Image handling via Cloudinary for form media.
    

## Tech Stack

*   **Frontend**: React (Vite)
    
*   **Backend**: Node.js, Express
    
*   **Database**: MongoDB
    
*   **Image** **Storage**: Cloudinary
    
*   **Authentication**: Google OAuth
    

## Prerequisites

**_Before you begin, ensure you have the following installed:_**

*   [Nodejs](https://nodejs.org/)
    
*   A [MongoDB](https://www.mongodb.com/) (Local or Atlas) account for database
    
*   A [Cloudinary](https://cloudinary.com/) account for media storage.
    
*   A [Google Cloud Console](https://console.cloud.google.com/) project (for OAuth credentials)
    

## Installation & Setup

### 1\. Clone the Repository

```javascript
git clone https://github.com/user/form-builder.git
```

```javascript
cd form-builder
```

### 2\. Frontend Setup (app)

Navigate to the frontend directory, install dependencies, and configure the environment.

```javascript
cd app
npm install 
```

Create a **.env** file in the **app** directory and add the following keys:

```javascript
//The URL where your backend server is running
VITE_API_URL=http://localhost:3001/api
// Your Google OAuth Client ID
VITE_CLIENT_ID=<your-google-client-id>
```

**_Start the frontend development server:_**

```javascript
npm run dev
```

> **The frontend will run on http://localhost:5173**

## 3\. Backend Setup (server)

Open a new terminal, navigate to the server directory, install dependencies, and configure the environment.

```javascript
cd server
npm install
```

**_Create a .env file in the server directory and add the following keys:_**

```javascript
// Server Configuration
PORT=3001

// Database Connection
MONGODB_URI=<your-mongodb-connection-string>

// Cloudinary Configuration (For image uploads)
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

// GoogleAuth
CLIENT_ID=<your-google-client-id>

// App Credentials
USER=<admin-username-or-email>
PASS=<admin-password-or-app-password>
```

**_Start the backend server:_**

```javascript
npm start
```

> **The backend will run on http://localhost:3001**

## Project Structure

**_The Folder Structure of the web app is as following_**

> ├── app/
> 
> │ ├── src/
> 
> │ │ ├── components/
> 
> │ │ │ ├── form-builder/
> 
> │ │ │ │ ├── FormEditor.tsx
> 
> │ │ │ │ ├── FormPreview.tsx
> 
> │ │ │ │ ├── GoogleVerification.tsx
> 
> │ │ │ │ ├── QuestionCard.tsx
> 
> │ │ │ │ └── QuestionTypesPanel.tsx
> 
> │ │ │ ├── ui/
> 
> │ │ │ │ ├── alert-dialog.tsx
> 
> │ │ │ │ ├── button.tsx
> 
> │ │ │ │ ├── checkbox.tsx
> 
> │ │ │ │ ├── dialog.tsx
> 
> │ │ │ │ ├── dropdown-menu.tsx
> 
> │ │ │ │ ├── input.tsx
> 
> │ │ │ │ ├── label.tsx
> 
> │ │ │ │ ├── radio-group.tsx
> 
> │ │ │ │ ├── select.tsx
> 
> │ │ │ │ ├── sheet.tsx
> 
> │ │ │ │ ├── sonner.tsx
> 
> │ │ │ │ ├── switch.tsx
> 
> │ │ │ │ └── textarea.tsx
> 
> │ │ │ └── ProtectedRoute.tsx
> 
> │ │ ├── context/
> 
> │ │ │ └── AuthContext.tsx
> 
> │ │ ├── hooks/
> 
> │ │ │ └── useForms.ts
> 
> │ │ ├── lib/
> 
> │ │ │ ├── api.ts
> 
> │ │ │ └── utils.ts
> 
> │ │ ├── pages/
> 
> │ │ │ ├── Dashboard.tsx
> 
> │ │ │ ├── FormResponses.tsx
> 
> │ │ │ ├── LandingPage.tsx
> 
> │ │ │ ├── LoginPage.tsx
> 
> │ │ │ └── PublicForm.tsx
> 
> │ │ ├── types/
> 
> │ │ │ └── form.ts
> 
> │ │ ├── utils/
> 
> │ │ │ └── id.ts
> 
> │ │ ├── App.css
> 
> │ │ ├── App.tsx
> 
> │ │ ├── index.css
> 
> │ │ └── main.tsx
> 
> │ ├── components.json
> 
> │ ├── eslint.config.js
> 
> │ ├── index.html
> 
> │ ├── package-lock.json
> 
> │ ├── package.json
> 
> │ ├── postcss.config.js
> 
> │ ├── README.md
> 
> │ ├── tailwind.config.js
> 
> │ ├── tsconfig.app.json
> 
> │ ├── tsconfig.json
> 
> │ ├── tsconfig.node.json
> 
> │ └── vite.config.ts
> 
> ├── server/
> 
> │ ├── middlewares/
> 
> │ │ └── auth.middleware.js
> 
> │ ├── models/
> 
> │ │ ├── Form.js
> 
> │ │ └── Response.js
> 
> │ ├── routes/
> 
> │ │ ├── auth.js
> 
> │ │ ├── forms.js
> 
> │ │ └── uploads.js
> 
> │ ├── utils/
> 
> │ │ └── googleAuth.ts
> 
> │ ├── index.js
> 
> │ ├── package-lock.json
> 
> │ └── package.json
> 
> └── .gitignore

## Contributing

Contributions are welcome! Feel free to submit a pull request to improve this project.

