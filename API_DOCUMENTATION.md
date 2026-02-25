# Postman Collection Documentation

## Overview

This Postman collection is a comprehensive resource for the Mindora Beta API, covering **all** endpoints across the platform. This includes authentication, user profiles, therapist management, appointments, community features, mood tracking, monitoring, messaging, notifications, emergency contacts, reviews, resources, and admin operations.

For detailed API documentation, including request/response schemas and examples, please refer to the [API Documentation](docs/api/README.md) in the `docs/` folder.

## Setup

1. **Import**: Open Postman and click "Import" -> "File" -> "Upload Files". Select `postman_collection.json`.
2. **Environment**: The collection uses a `{{baseUrl}}` variable defaulting to `http://localhost:5000/api/v1`.
3. **Authorization**:
   - **Global Auth**: The collection is configured to use a Bearer token stored in the `token` variable.
   - **Login**: Use the `Auth -> Login` request.
   - **Set Token**: Copy the `accessToken` from the login response and paste it into the "Variables" tab of the collection (value for `token`).
   - **Role Switching**: Some endpoints require `THERAPIST` or `ADMIN` roles. You may need to login as different users to test all endpoints.

## Included Modules

- **Auth**: Register, Login, Reset Password, Email Verification, Token Refresh
- **Users**: Profiles, Avatars, Stats, Dashboard, Gamification
- **Therapists**: Profiles, Availability, Documents, Patients, Analytics
- **Appointments**: CRUD, Status Management (Confirm/Complete/Cancel), Notes
- **Exercises**: Public Catalog, User Progress, Creator Tools
- **Community**: Posts, Comments, Likes, Images, Moderation
- **Mood**: Logging, Analytics, History
- **Monitoring**: Patient Data, Risk Assessments, Admin Reports
- **Messages**: 1-on-1 Messaging, Read Status
- **Notifications**: System Alerts, Read Status
- **Emergency Contacts**: CRUD
- **Reviews**: Therapist Ratings
- **Resources**: Mental Health Resources
- **Admin**: System Dashboard, User Management, Content Moderation, Settings

## Notes

- **Path Variables**: Requests with path parameters (e.g., `/:id`) are set up with Postman variables (e.g., `:id`). You can edit these in the "Params" tab of each request before sending.
- **Body Data**: Example bodies are provided for POST/PUT/PATCH requests. Modify values as needed for your test cases.
