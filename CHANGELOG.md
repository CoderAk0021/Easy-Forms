# Changelog

All notable changes to this project will be documented in this file.

This project follows **Semantic Versioning (SemVer)**:  
MAJOR.MINOR.PATCH (e.g., 2.1.0)

---
## [2.1.0] - 2026-02-19
### Added
- Added Signup for test users with google auth.
- Can create only one form per test users
- Can't use file upload inputs and unable to change the banner image and logo.
- Can't use the email service
- Updated Admin Dashboard
- Admin Can view all the activities of test users

### Fixes
- Auto focus brand name on opening settings in mobile

---

---

## [2.0.0] - 2026-02-17

### Added
- Markdown-based form header support  
- Custom form banner image upload  
- Brand name customization for forms  
- Brand logo support  
- Email notifications on form submission  
- Time-based form submission deadline  
- Response submission limit feature  
- Major changes to API to integrate the above features

### Improved
- UI and UX improvements across admin dashboard and form editor  

### Fixed
- Minor UI bugs and layout inconsistencies  

---

## [1.0.0] - 2026-02-12

### Initial Release

### Features
- Admin authentication system with login-only access (no public admin signup)
- Full form management system (Create, Update, Delete, Fetch forms)
- MongoDB-based storage for forms and user responses
- Admin dashboard for managing forms and responses
- Draft and published form states
- QR code generation and download for public form sharing
- Multiple response submission control (restrict multiple submissions)
- Support for all input types, including file uploads
- Cloudinary integration for file storage
- Drag-and-drop question reordering in form builder
- Google authorization required before form submission (OAuth-based access control)

---

## Notes

- Dates follow ISO format: YYYY-MM-DD  
- Major releases may include breaking changes  
- Patch releases include bug fixes and minor improvements  

---

For detailed commit history, see the GitHub commit log.
