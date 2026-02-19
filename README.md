
<p align="center">
  <img src="./app/public/logo.svg" width="120" />
</p>

<h1 align="center">EasyForms</h1>
<p align="center">Open-source Form Builder built with the MERN stack </p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue" />
  <img src="https://img.shields.io/badge/stack-MERN-green" />
  <img src="https://img.shields.io/badge/build-Vite-purple" />
  <img src="https://img.shields.io/github/stars/ISTEBITS/EasyForms" />
  <img src="https://img.shields.io/github/issues/ISTEBITS/EasyForms" />
  <img src="https://img.shields.io/github/forks/ISTEBITS/EasyForms" />
</p>

---

EasyForms is a **full-featured open-source form builder platform** that allows admins to create, publish, and manage dynamic forms with branding, analytics-ready storage,custom email sending, secure submission workflows and many more.

This project is developed and maintained under the **ISTE Organization**.

---

##  Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Live Demo](#-live-demo)
- [Installation & Setup](#installation--setup)
- [Contributing](#-contributing)
- [Branching Strategy](#branching-strategy)
- [Maintainers](#-maintainers)
- [Contributors](#-contributors)
- [License](#-license)
- [Contact](#contact)

---

##  Features

###  Core Features (v1)
- Admin authentication (no public admin signup)
- Create, update, delete, and fetch forms
- Draft & published form states
- MongoDB storage for forms and responses
- Admin dashboard for form management
- QR code generation for public form sharing
- Multiple response control
- Support for all input types (including file uploads)
- Cloudinary integration for file storage
- Drag-and-drop question reordering
- Google OAuth required before submission

###  v2 Enhancements
- Test User (Using Google Auth)
- Markdown-based form headers
- Custom form banner image
- Brand name & logo customization
- Email notifications on form submission
- Form submission deadline (time-based closing)
- Response submission limits
- UI and UX improvements

---

##  Tech Stack

### Frontend
- React + Vite  
- Tailwind CSS / ShadCN UI  

### Backend
- Node.js  
- Express.js  
- MongoDB  

### Cloud & Services
- Cloudinary (file storage)
- Google OAuth
- Vercel (client deployment)
- Render (server deployment)

---

##  Live Demo

🔗 **Easy Forms:** https://easyforms.istebits.com  

---

##  Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/ISTEBITS/EasyForms.git
cd EasyForms
```

---

### 2️⃣ Backend Setup (Server)

```bash
cd server
npm install
npm run dev
```

#### Create `.env` in `/server`

```env

PORT=3001
MONGODB_URI=<your-mongodb-connection-string>
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
CLIENT_ID=<your-google-client-id>

// Mail (choose one provider mode)
// Mode A: SMTP
SMTP_HOST=<smtp-host>
SMTP_PORT=587
SMTP_USER=<smtp-username>
SMTP_PASS=<smtp-password>
SMTP_SECURE=false
SMTP_FROM=<no-reply@your-domain.com>

// Mode B: Mailtrap API token
MAIL_TOKEN=<mailtrap-api-token>
MAIL_FROM=<sandbox@example.com-or-verified-sender>
MAIL_FROM_NAME=Form Builder
MAILTRAP_USE_SANDBOX=true
MAILTRAP_INBOX_ID=<mailtrap-inbox-id-for-sandbox>
```

---

### 3️⃣ Frontend Setup (Client)

```bash
cd client
npm install
npm run dev
```

#### Create `.env` in `/client`

```env
VITE_API_URL=http://localhost:5000
VITE_CLIENT_ID=<your-google-client-id>
```

---

##  Contributing

We welcome contributions from the community and ISTE members.

### Contribution Workflow

1. Fork the repository
2. Create a feature branch
3. Commit using **Conventional Commits**
4. Push and open a Pull Request

See **CONTRIBUTING.md** for full guidelines.

---

##  Branching Strategy

```text
main        → stable production
development → active development
feature/*   → new features
fix/*       → bug fixes
```

---

##  Maintainers
Maintained under the **ISTE Organization**.

---

##  Contributors

Thanks to all contributors who help build EasyForms ❤️

<a href="https://github.com/ISTE-ORG/EasyForms/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ISTEBITS/EasyForms" />
</a>

---

##  Acknowledgements

* ISTE Organization
* Open Source Community
* React, Node.js, MongoDB contributors

---

##  License

This project is licensed under the **MIT License**.
See the [LICENSE](LICENSE) file for details.

---

##  Contact

For queries :

**[MAIL](mailto:dev.team@istebits.com)** |
**[ISTE Official Website](istebits.com)**

---

##  Support the Project

If you like EasyForms, please **star ⭐ the repository** and share it with the community!
