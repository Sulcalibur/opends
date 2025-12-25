# OpenDS - Task Breakdown & Implementation Plan

> **Task Planning Document**  
> **Last Updated**: December 25, 2024  
> **Status**: Ready for Implementation

---

## 🎯 How to Use This Document

- **Each task** has: Description, Acceptance Criteria, Estimated Time, Dependencies
- **Track progress** by checking off completed tasks
- **Update weekly** to reflect current status
- **Create GitHub Issues** from these tasks when ready to implement

---

## 📊 Task Overview

```
Total Tasks: 67
├── Milestone 1 (Foundation): 15 tasks
├── Milestone 2 (Authentication): 12 tasks
├── Milestone 3 (Admin Panel): 10 tasks
├── Milestone 4 (Penpot Integration): 15 tasks
└── Milestone 5 (Component System): 15 tasks

Current Focus: Milestone 2 (Authentication)
```

---

## 🏁 Milestone 1: Foundation Setup (Week 1-2)

**Goal**: Prepare development environment and clean up existing code

### **1.1 Project Structure Cleanup** ⏱️ 4 hours
- [ ] Review current `simplified/` directory structure
- [ ] Remove unused files and dependencies
- [ ] Organize code by domain (auth, components, tokens)
- [ ] Update import paths to use `@/` alias

**Acceptance Criteria:**
- Clean directory structure following DEVELOPER_GUIDE.md
- All imports use path aliases
- No unused dependencies in package.json
- TypeScript compiles without errors

**Dependencies:** None  
**Priority:** High

---

### **1.2 Environment Configuration** ⏱️ 2 hours
- [ ] Create `.env.example` with all required variables
- [ ] Document each environment variable
- [ ] Set up separate `.env.development` and `.env.production`
- [ ] Add `.env.local` to `.gitignore`

**Acceptance Criteria:**
- `.env.example` includes all variables with descriptions
- Development environment works with default values
- Documentation updated in README.md

**Dependencies:** None  
**Priority:** High

---

### **1.3 Database Schema Design** ⏱️ 3 hours
- [ ] Create SQL migration file for initial schema
- [ ] Define users table with all auth fields
- [ ] Define sessions table for JWT refresh tokens
- [ ] Define oauth_connections table
- [ ] Define invitations table
- [ ] Add proper indexes for performance

**Acceptance Criteria:**
- SQL file in `simplified/migrations/001_initial_schema.sql`
- Follows schema in DUAL_ARCHITECTURE.md
- All tables have proper relationships and constraints
- Indexes on foreign keys and frequently queried columns

**Dependencies:** None  
**Priority:** High

**Files to Create:**
```sql
-- simplified/migrations/001_initial_schema.sql
-- See DUAL_ARCHITECTURE.md for complete schema
```

---

### **1.4 TypeScript Types Definition** ⏱️ 3 hours
- [ ] Create `src/types/auth.ts` for authentication types
- [ ] Create `src/types/user.ts` for user-related types
- [ ] Create `src/types/api.ts` for API request/response types
- [ ] Create `src/types/database.ts` for database entities

**Acceptance Criteria:**
- All types properly exported
- No `any` types used
- Types match database schema
- Strict TypeScript mode passes

**Dependencies:** 1.3 (Database Schema)  
**Priority:** High

**Example:**
```typescript
// src/types/user.ts
export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

### **1.5 Error Handling Infrastructure** ⏱️ 2 hours
- [ ] Create `src/utils/errors.ts` with custom error classes
- [ ] Create error response formatter
- [ ] Add global error handler middleware
- [ ] Define standard error codes

**Acceptance Criteria:**
- Custom error classes (ValidationError, AuthError, etc.)
- Consistent error response format
- Proper HTTP status codes
- Error logging to console/file

**Dependencies:** None  
**Priority:** Medium

---

### **1.6 Logging Setup** ⏱️ 2 hours
- [ ] Choose logging library (winston or pino)
- [ ] Configure log levels (dev vs prod)
- [ ] Set up log formatting
- [ ] Add request logging middleware

**Acceptance Criteria:**
- Structured JSON logging
- Different log levels working
- Request/response logging
- Error stack traces in logs

**Dependencies:** None  
**Priority:** Medium

---

### **1.7 Database Connection** ⏱️ 3 hours
- [ ] Set up database connection pool
- [ ] Create database client wrapper
- [ ] Add connection retry logic
- [ ] Implement health check endpoint

**Acceptance Criteria:**
- Database connects successfully
- Connection pooling configured
- Graceful error handling on connection failure
- `/api/health` endpoint returns database status

**Dependencies:** 1.2 (Environment Config), 1.3 (Database Schema)  
**Priority:** High

---

### **1.8 API Route Structure** ⏱️ 2 hours
- [ ] Set up Express/Fastify router
- [ ] Define route organization pattern
- [ ] Create route registration system
- [ ] Add request validation middleware

**Acceptance Criteria:**
- Clean route organization in `src/api/`
- All routes registered in main app
- Request body validation with zod or joi
- 404 handler for unknown routes

**Dependencies:** None  
**Priority:** High

---

### **1.9 CORS Configuration** ⏱️ 1 hour
- [ ] Install and configure CORS middleware
- [ ] Set allowed origins from environment
- [ ] Configure credentials and headers
- [ ] Test CORS in development

**Acceptance Criteria:**
- CORS headers properly set
- Frontend can make requests
- Preflight requests working
- Credentials included in requests

**Dependencies:** 1.8 (API Routes)  
**Priority:** High

---

### **1.10 Testing Infrastructure** ⏱️ 4 hours
- [ ] Set up Vitest configuration
- [ ] Create test utilities and helpers
- [ ] Add test database setup/teardown
- [ ] Write example unit test

**Acceptance Criteria:**
- `pnpm test` command works
- Tests run in watch mode
- Test coverage reporting
- CI-ready test setup

**Dependencies:** 1.7 (Database Connection)  
**Priority:** Medium

---

### Tasks 1.11-1.15: Additional Setup
- [ ] **1.11** Security headers (helmet.js) ⏱️ 1 hour
- [ ] **1.12** Rate limiting middleware ⏱️ 2 hours
- [ ] **1.13** API documentation setup (Swagger/OpenAPI) ⏱️ 3 hours
- [ ] **1.14** Git hooks with Husky (lint, format) ⏱️ 1 hour
- [ ] **1.15** CI/CD pipeline (GitHub Actions) ⏱️ 3 hours

**Total Milestone 1 Time**: ~35 hours (~1 week)

---

## 🔐 Milestone 2: Authentication System (Week 2-3)

**Goal**: Implement complete authentication system with JWT

### **2.1 Password Hashing Service** ⏱️ 2 hours
- [ ] Install bcrypt
- [ ] Create password hashing utility
- [ ] Add password validation rules
- [ ] Write tests for password functions

**Acceptance Criteria:**
- Passwords hashed with bcrypt (cost factor 12)
- Password validation enforces policy
- Hash comparison works correctly
- Unit tests pass

**Dependencies:** 1.4 (Types)  
**Priority:** High

**File:** `src/services/auth/password.service.ts`

---

### **2.2 JWT Token Service** ⏱️ 3 hours
- [ ] Install jsonwebtoken
- [ ] Create token generation function
- [ ] Create token verification function
- [ ] Implement refresh token logic
- [ ] Add token blacklist for logout

**Acceptance Criteria:**
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Tokens include userId, email, role
- Token verification validates signature and expiry

**Dependencies:** 1.4 (Types)  
**Priority:** High

**File:** `src/services/auth/jwt.service.ts`

---

### **2.3 User Repository** ⏱️ 4 hours
- [ ] Create user CRUD operations
- [ ] Add findByEmail method
- [ ] Add findById method
- [ ] Add create user method
- [ ] Add update user method
- [ ] Write repository tests

**Acceptance Criteria:**
- All CRUD operations work
- Proper error handling
- SQL injection prevention
- Unit tests pass

**Dependencies:** 1.7 (Database Connection)  
**Priority:** High

**File:** `src/repositories/user.repository.ts`

---

### **2.4 Registration Endpoint** ⏱️ 4 hours
- [ ] Create POST `/api/auth/register` endpoint
- [ ] Validate email format
- [ ] Check if email already exists
- [ ] Hash password
- [ ] Create user in database
- [ ] Return JWT tokens
- [ ] Add first-user detection logic

**Acceptance Criteria:**
- First user becomes admin automatically
- Subsequent registrations fail (invite-only)
- Email validation works
- Duplicate emails rejected
- Returns access + refresh tokens

**Dependencies:** 2.1 (Password), 2.2 (JWT), 2.3 (User Repository)  
**Priority:** High

**Route:** `POST /api/v1/auth/register`

---

### **2.5 Login Endpoint** ⏱️ 3 hours
- [ ] Create POST `/api/auth/login` endpoint
- [ ] Validate email and password
- [ ] Find user by email
- [ ] Compare password hash
- [ ] Generate JWT tokens
- [ ] Update last_login_at timestamp
- [ ] Add rate limiting to prevent brute force

**Acceptance Criteria:**
- Login with correct credentials works
- Invalid credentials return 401
- Account lock after 5 failed attempts
- Last login timestamp updated
- Rate limiting prevents brute force

**Dependencies:** 2.1, 2.2, 2.3  
**Priority:** High

**Route:** `POST /api/v1/auth/login`

---

### **2.6 Logout Endpoint** ⏱️ 2 hours
- [ ] Create POST `/api/auth/logout` endpoint
- [ ] Invalidate refresh token
- [ ] Add token to blacklist
- [ ] Clear cookies

**Acceptance Criteria:**
- Logout invalidates tokens
- Subsequent requests with old token fail
- Refresh token can't be reused

**Dependencies:** 2.2 (JWT)  
**Priority:** Medium

**Route:** `POST /api/v1/auth/logout`

---

### **2.7 Token Refresh Endpoint** ⏱️ 3 hours
- [ ] Create POST `/api/auth/refresh` endpoint
- [ ] Verify refresh token
- [ ] Generate new access token
- [ ] Rotate refresh token (optional)
- [ ] Return new tokens

**Acceptance Criteria:**
- Valid refresh token returns new access token
- Expired refresh token returns 401
- Invalid refresh token returns 401

**Dependencies:** 2.2 (JWT)  
**Priority:** High

**Route:** `POST /api/v1/auth/refresh`

---

### **2.8 Authentication Middleware** ⏱️ 3 hours
- [ ] Create authentication middleware
- [ ] Extract token from Authorization header
- [ ] Verify token signature
- [ ] Attach user to request object
- [ ] Handle missing/invalid tokens

**Acceptance Criteria:**
- Protected routes require valid token
- User object available in `req.user`
- 401 for missing/invalid tokens
- Token expiry properly handled

**Dependencies:** 2.2 (JWT)  
**Priority:** High

**File:** `src/middleware/authenticate.ts`

---

### **2.9 Authorization Middleware (RBAC)** ⏱️ 3 hours
- [ ] Create permission checking middleware
- [ ] Define permission matrix
- [ ] Implement role-based checks
- [ ] Add user-specific checks

**Acceptance Criteria:**
- Admin can access all routes
- Editor has limited access
- Viewer is read-only
- 403 for insufficient permissions

**Dependencies:** 2.8 (Auth Middleware)  
**Priority:** High

**File:** `src/middleware/authorize.ts`

---

### **2.10 Password Reset Flow** ⏱️ 5 hours
- [ ] Create POST `/api/auth/forgot-password` endpoint
- [ ] Generate reset token
- [ ] Send reset email (or log to console)
- [ ] Create POST `/api/auth/reset-password` endpoint
- [ ] Verify reset token
- [ ] Update password

**Acceptance Criteria:**
- Reset token expires in 1 hour
- Token can only be used once
- Password successfully updated
- Email sent (or logged)

**Dependencies:** 2.1 (Password), 2.3 (User Repository)  
**Priority:** Medium

**Routes:**
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`

---

### **2.11 Login Page (Frontend)** ⏱️ 6 hours
- [ ] Create `src/app/auth/Login.vue`
- [ ] Add email and password input fields
- [ ] Add form validation
- [ ] Implement login API call
- [ ] Store tokens in localStorage
- [ ] Redirect to dashboard on success
- [ ] Show error messages

**Acceptance Criteria:**
- Form validates required fields
- Successful login redirects to dashboard
- Error messages displayed for failures
- "Remember me" checkbox works
- "Forgot password" link present

**Dependencies:** 2.5 (Login Endpoint)  
**Priority:** High

**File:** `simplified/src/app/auth/Login.vue`

---

### **2.12 Signup Page (Frontend)** ⏱️ 4 hours
- [ ] Create `src/app/auth/Signup.vue`
- [ ] Add email, name, password fields
- [ ] Add password confirmation field
- [ ] Password strength indicator
- [ ] Implement signup API call
- [ ] Show success/error messages

**Acceptance Criteria:**
- Form validates all fields
- Password confirmation matches
- Password strength shown
- First user can sign up
- Redirects to dashboard after signup

**Dependencies:** 2.4 (Register Endpoint)  
**Priority:** High

**File:** `simplified/src/app/auth/Signup.vue`

---

**Total Milestone 2 Time**: ~42 hours (~1 week)

---

## 👥 Milestone 3: Admin Panel (Week 3-4)

**Goal**: Build admin panel for user and system management

### **3.1 Admin Layout Component** ⏱️ 4 hours
- [ ] Create admin layout with sidebar
- [ ] Add admin navigation menu
- [ ] Create admin header
- [ ] Add breadcrumbs
- [ ] Implement admin route guards

**Acceptance Criteria:**
- Admin layout displays correctly
- Only admins can access
- Navigation highlights active page
- Responsive on mobile

**Dependencies:** 2.9 (Authorization)  
**Priority:** High

**File:** `simplified/src/app/admin/AdminLayout.vue`

---

### **3.2 User List Page** ⏱️ 6 hours
- [ ] Create GET `/api/admin/users` endpoint
- [ ] Add pagination support
- [ ] Add search and filtering
- [ ] Create `AdminUsers.vue` component
- [ ] Display users in table
- [ ] Add role badges
- [ ] Add status indicators

**Acceptance Criteria:**
- All users listed with pagination
- Search by email/name works
- Filter by role works
- Shows user count
- Admin-only access

**Dependencies:** 3.1 (Admin Layout)  
**Priority:** High

**Files:**
- `src/api/admin/users.ts`
- `simplified/src/app/admin/Users.vue`

---

### **3.3 User Invitation System** ⏱️ 8 hours
- [ ] Create invitations table migration
- [ ] Create POST `/api/admin/users/invite` endpoint
- [ ] Generate unique invitation token
- [ ] Send invitation email (or log)
- [ ] Create GET `/api/auth/accept-invite/:token` endpoint
- [ ] Create invite acceptance page
- [ ] Add invited user to database

**Acceptance Criteria:**
- Admin can invite users
- Invitation email sent/logged
- Token expires in 7 days
- User can accept invite
- User created with correct role

**Dependencies:** 3.2 (User List)  
**Priority:** High

**Routes:**
- `POST /api/v1/admin/users/invite`
- `GET /api/v1/auth/accept-invite/:token`
- `POST /api/v1/auth/accept-invite/:token`

---

### **3.4 User Role Management** ⏱️ 4 hours
- [ ] Create PATCH `/api/admin/users/:id/role` endpoint
- [ ] Add role dropdown in user list
- [ ] Implement role change functionality
- [ ] Add confirmation dialog
- [ ] Prevent self-demotion

**Acceptance Criteria:**
- Admin can change user roles
- Cannot change own role
- Confirmation required
- Audit log created

**Dependencies:** 3.2 (User List)  
**Priority:** Medium

**Route:** `PATCH /api/v1/admin/users/:id/role`

---

### **3.5 User Deactivation** ⏱️ 3 hours
- [ ] Create PATCH `/api/admin/users/:id/status` endpoint
- [ ] Add activate/deactivate toggle
- [ ] Implement status change
- [ ] Prevent self-deactivation
- [ ] Invalidate user's tokens on deactivation

**Acceptance Criteria:**
- Admin can deactivate users
- Cannot deactivate self
- Deactivated users cannot login
- Tokens invalidated immediately

**Dependencies:** 3.2 (User List)  
**Priority:** Medium

**Route:** `PATCH /api/v1/admin/users/:id/status`

---

### **3.6 System Settings Page** ⏱️ 6 hours
- [ ] Create settings table/config system
- [ ] Create GET `/api/admin/settings` endpoint
- [ ] Create PUT `/api/admin/settings` endpoint
- [ ] Create `AdminSettings.vue` component
- [ ] Add organization name field
- [ ] Add logo upload
- [ ] Add OAuth toggle switches

**Acceptance Criteria:**
- Settings load correctly
- Settings save successfully
- Logo upload works
- Changes reflect immediately

**Dependencies:** 3.1 (Admin Layout)  
**Priority:** Medium

**File:** `simplified/src/app/admin/Settings.vue`

---

### **3.7 Admin Dashboard** ⏱️ 6 hours
- [ ] Create GET `/api/admin/stats` endpoint
- [ ] Calculate user count
- [ ] Calculate component count
- [ ] Calculate storage usage
- [ ] Create `AdminDashboard.vue` component
- [ ] Display stats cards
- [ ] Add recent activity feed

**Acceptance Criteria:**
- All stats display correctly
- Real-time user count
- Recent activity shown
- Chart visualizations (optional)

**Dependencies:** 3.1 (Admin Layout)  
**Priority:** Low

**File:** `simplified/src/app/admin/Dashboard.vue`

---

### **3.8 Activity Log System** ⏱️ 5 hours
- [ ] Create audit_logs table
- [ ] Create logging middleware
- [ ] Log important actions
- [ ] Create GET `/api/admin/logs` endpoint
- [ ] Create logs viewer page

**Acceptance Criteria:**
- All user actions logged
- Logs include user, action, timestamp
- Logs are searchable
- Admin can view logs

**Dependencies:** 3.1 (Admin Layout)  
**Priority:** Low

---

### **3.9 System Information Page** ⏱️ 3 hours
- [ ] Create GET `/api/admin/system` endpoint
- [ ] Display version information
- [ ] Show database status
- [ ] Show environment mode
- [ ] List enabled features

**Acceptance Criteria:**
- System info displayed
- Version number shown
- Database connection status
- Environment clearly indicated

**Dependencies:** 3.1 (Admin Layout)  
**Priority:** Low

---

### **3.10 Backup & Export** ⏱️ 6 hours
- [ ] Create POST `/api/admin/backup` endpoint
- [ ] Export all data to JSON
- [ ] Download backup file
- [ ] Create restore functionality (future)

**Acceptance Criteria:**
- Backup generates successfully
- All data included
- Downloadable JSON file
- Includes timestamp

**Dependencies:** 3.1 (Admin Layout)  
**Priority:** Low

---

**Total Milestone 3 Time**: ~51 hours (~1.5 weeks)

---

## 🎨 Milestone 4: Penpot Integration (Week 5-7)

**Goal**: Build Penpot plugin and sync functionality

### **4.1 Penpot Plugin Project Setup** ⏱️ 4 hours
- [ ] Create `opends-penpot-plugin/` directory
- [ ] Initialize npm project
- [ ] Set up TypeScript configuration
- [ ] Create plugin manifest
- [ ] Set up build system (Vite/Rollup)

**Acceptance Criteria:**
- Plugin builds successfully
- TypeScript compiles
- Basic plugin structure in place

**Dependencies:** None  
**Priority:** High

---

### **4.2 Plugin UI Structure** ⏱️ 6 hours
- [ ] Create plugin HTML/CSS
- [ ] Add connection form (API key input)
- [ ] Add component selection interface
- [ ] Add progress indicators
- [ ] Style plugin UI

**Acceptance Criteria:**
- UI displays in Penpot
- Form inputs work
- Professional styling
- Responsive layout

**Dependencies:** 4.1 (Plugin Setup)  
**Priority:** High

---

### **4.3 Penpot File Parser** ⏱️ 12 hours
- [ ] Study Penpot file format
- [ ] Create shape parser
- [ ] Extract component metadata
- [ ] Extract component properties
- [ ] Handle nested components
- [ ] Extract artboards

**Acceptance Criteria:**
- Can parse Penpot file structure
- Components identified correctly
- Properties extracted accurately
- Handles complex nested structures

**Dependencies:** 4.1 (Plugin Setup)  
**Priority:** High

---

### **4.4 Design Token Extraction** ⏱️ 8 hours
- [ ] Identify color tokens in designs
- [ ] Extract typography tokens
- [ ] Extract spacing/sizing tokens
- [ ] Extract border/shadow tokens
- [ ] Create token data structure

**Acceptance Criteria:**
- All token types extracted
- Token names generated or detected
- Token values accurate
- Organized by category

**Dependencies:** 4.3 (File Parser)  
**Priority:** High

---

### **4.5 Component Spec Generator** ⏱️ 10 hours
- [ ] Create framework-agnostic spec format
- [ ] Map Penpot shapes to component types
- [ ] Extract props from variants
- [ ] Generate component hierarchy
- [ ] Include styling information

**Acceptance Criteria:**
- ComponentSpec format defined
- All component types supported
- Props accurately extracted
- Spec is JSON serializable

**Dependencies:** 4.3 (File Parser)  
**Priority:** High

---

### **4.6 API Integration (Plugin → Backend)** ⏱️ 6 hours
- [ ] Create POST `/api/sync/penpot` endpoint
- [ ] Accept component specs from plugin
- [ ] Validate incoming data
- [ ] Store in database
- [ ] Return success/error response

**Acceptance Criteria:**
- Plugin can send data to backend
- Authentication via API key
- Data validation works
- Error handling robust

**Dependencies:** 4.5 (Component Spec), 2.8 (Auth)  
**Priority:** High

**Route:** `POST /api/v1/sync/penpot`

---

### **4.7 Asset Extraction** ⏱️ 8 hours
- [ ] Extract images from Penpot
- [ ] Extract icons/SVGs
- [ ] Optimize assets
- [ ] Upload to storage
- [ ] Link assets to components

**Acceptance Criteria:**
- Images extracted correctly
- SVGs properly formatted
- Assets uploaded to S3/local storage
- Asset URLs returned

**Dependencies:** 4.3 (File Parser)  
**Priority:** Medium

---

### **4.8 Sync Status Tracking** ⏱️ 4 hours
- [ ] Create sync_events table
- [ ] Track sync progress
- [ ] Store sync results
- [ ] Add error logging

**Acceptance Criteria:**
- Sync events logged
- Progress tracked
- Errors recorded
- History queryable

**Dependencies:** 4.6 (API Integration)  
**Priority:** Medium

---

### **4.9 Plugin Testing** ⏱️ 6 hours
- [ ] Test with simple components
- [ ] Test with complex components
- [ ] Test error scenarios
- [ ] Test with large files
- [ ] Create test Penpot file

**Acceptance Criteria:**
- Plugin works with test files
- Error messages clear
- Performance acceptable
- No crashes

**Dependencies:** 4.1-4.8 (All plugin features)  
**Priority:** High

---

### **4.10 Plugin Documentation** ⏱️ 4 hours
- [ ] Write installation guide
- [ ] Create usage tutorial
- [ ] Document limitations
- [ ] Add troubleshooting section

**Acceptance Criteria:**
- Clear installation steps
- Screenshots included
- Common issues documented
- Published to docs site

**Dependencies:** 4.9 (Plugin Testing)  
**Priority:** Medium

---

### Tasks 4.11-4.15: Additional Penpot Features
- [ ] **4.11** Webhook support (future) ⏱️ 6 hours
- [ ] **4.12** Incremental sync ⏱️ 8 hours
- [ ] **4.13** Conflict resolution UI ⏱️ 8 hours
- [ ] **4.14** Variant detection ⏱️ 6 hours
- [ ] **4.15** Component preview generation ⏱️ 8 hours

**Total Milestone 4 Time**: ~94 hours (~2.5 weeks)

---

## 🧩 Milestone 5: Component System (Week 8-10)

**Goal**: Build component library management

### **5.1 Component Database Schema** ⏱️ 3 hours
- [ ] Create components table
- [ ] Create component_versions table
- [ ] Create component_variants table
- [ ] Add relevant indexes

**Acceptance Criteria:**
- Tables created successfully
- Relationships defined
- Indexes on foreign keys
- Follows ARCHITECTURE.md schema

**Dependencies:** None  
**Priority:** High

---

### **5.2 Component Repository** ⏱️ 6 hours
- [ ] Create component CRUD operations
- [ ] Add search functionality
- [ ] Add filtering by category/status
- [ ] Add pagination
- [ ] Write repository tests

**Acceptance Criteria:**
- All CRUD operations work
- Search by name works
- Filter by category/status
- Paginated results
- Tests pass

**Dependencies:** 5.1 (Component Schema)  
**Priority:** High

---

### **5.3 Component List API** ⏱️ 4 hours
- [ ] Create GET `/api/components` endpoint
- [ ] Support pagination
- [ ] Support search query
- [ ] Support category filter
- [ ] Support status filter

**Acceptance Criteria:**
- Returns paginated components
- Search works correctly
- Filters work correctly
- Performance acceptable

**Dependencies:** 5.2 (Component Repository)  
**Priority:** High

**Route:** `GET /api/v1/components`

---

### **5.4 Component Detail API** ⏱️ 3 hours
- [ ] Create GET `/api/components/:id` endpoint
- [ ] Include component metadata
- [ ] Include variants
- [ ] Include version history
- [ ] Include usage stats

**Acceptance Criteria:**
- Returns complete component data
- 404 for non-existent components
- Includes all relationships
- Performant queries

**Dependencies:** 5.2 (Component Repository)  
**Priority:** High

**Route:** `GET /api/v1/components/:id`

---

### **5.5 Component List View (Frontend)** ⏱️ 8 hours
- [ ] Create `ComponentList.vue` component
- [ ] Display components in grid
- [ ] Add search bar
- [ ] Add category filter
- [ ] Add status filter
- [ ] Add sorting options
- [ ] Implement pagination

**Acceptance Criteria:**
- Components display in grid
- Search filters results
- Category filter works
- Pagination works
- Responsive layout

**Dependencies:** 5.3 (Component List API)  
**Priority:** High

**File:** `simplified/src/app/components/ComponentList.vue`

---

### **5.6 Component Detail View (Frontend)** ⏱️ 10 hours
- [ ] Create `ComponentDetail.vue` component
- [ ] Display component preview
- [ ] Show component metadata
- [ ] Display props table
- [ ] Show code examples
- [ ] Display variants
- [ ] Add "Copy code" button

**Acceptance Criteria:**
- All component info displayed
- Preview renders correctly
- Props table formatted
- Code examples syntax highlighted
- Copy button works

**Dependencies:** 5.4 (Component Detail API)  
**Priority:** High

**File:** `simplified/src/app/components/ComponentDetail.vue`

---

### **5.7 Component Creation API** ⏱️ 6 hours
- [ ] Create POST `/api/components` endpoint
- [ ] Validate component data
- [ ] Store component spec
- [ ] Handle file uploads
- [ ] Return created component

**Acceptance Criteria:**
- Valid components created
- Invalid data rejected
- Spec stored correctly
- File uploads work
- Returns complete component

**Dependencies:** 5.2 (Component Repository)  
**Priority:** Medium

**Route:** `POST /api/v1/components`

---

### **5.8 Component Update API** ⏱️ 4 hours
- [ ] Create PATCH `/api/components/:id` endpoint
- [ ] Allow partial updates
- [ ] Create new version on change
- [ ] Validate updates

**Acceptance Criteria:**
- Component updates successfully
- Version created automatically
- Only allowed fields updatable
- Validation works

**Dependencies:** 5.2 (Component Repository)  
**Priority:** Medium

**Route:** `PATCH /api/v1/components/:id`

---

### **5.9 Component Status Management** ⏱️ 4 hours
- [ ] Add status field (draft, approved, deprecated)
- [ ] Create PUT `/api/components/:id/status` endpoint
- [ ] Add approval workflow
- [ ] Track who approved

**Acceptance Criteria:**
- Status changes work
- Only editors/admins can approve
- Approval tracked in logs
- Status displayed in UI

**Dependencies:** 5.2 (Component Repository)  
**Priority:** Medium

---

### **5.10 Component Search** ⏱️ 6 hours
- [ ] Implement full-text search
- [ ] Search by name, description, tags
- [ ] Add search relevance scoring
- [ ] Optimize search performance

**Acceptance Criteria:**
- Search returns relevant results
- Fast search performance
- Handles typos (optional)
- Sorted by relevance

**Dependencies:** 5.2 (Component Repository)  
**Priority:** Medium

---

### Tasks 5.11-5.15: Additional Component Features
- [ ] **5.11** Component categories management ⏱️ 4 hours
- [ ] **5.12** Component tagging system ⏱️ 5 hours
- [ ] **5.13** Component preview generation ⏱️ 8 hours
- [ ] **5.14** Component usage tracking ⏱️ 6 hours
- [ ] **5.15** Component deletion (soft delete) ⏱️ 3 hours

**Total Milestone 5 Time**: ~80 hours (~2 weeks)

---

## 📅 Sprint Planning (2-Week Sprints)

### **Sprint 1 (Dec 25 - Jan 8): Foundation + Auth Start**
**Focus:** Get infrastructure ready and start authentication

**Tasks:**
- [x] 1.1 - 1.10 (Foundation tasks)
- [ ] 2.1 - 2.4 (Password, JWT, Repository, Register)

**Deliverable:** Working registration endpoint

---

### **Sprint 2 (Jan 8 - Jan 22): Auth Complete + Admin Start**
**Focus:** Complete authentication and begin admin panel

**Tasks:**
- [ ] 2.5 - 2.12 (Complete authentication)
- [ ] 3.1 - 3.3 (Admin layout, user list, invitations)

**Deliverable:** Full login/logout flow + Admin can invite users

---

### **Sprint 3 (Jan 22 - Feb 5): Admin Panel + Penpot Start**
**Focus:** Complete admin panel and start Penpot plugin

**Tasks:**
- [ ] 3.4 - 3.10 (Complete admin features)
- [ ] 4.1 - 4.3 (Plugin setup and file parser)

**Deliverable:** Full admin panel + Penpot plugin can parse files

---

### **Sprint 4 (Feb 5 - Feb 19): Penpot Integration**
**Focus:** Complete Penpot plugin and sync

**Tasks:**
- [ ] 4.4 - 4.10 (Token extraction, sync, testing)

**Deliverable:** Working Penpot plugin that syncs to OpenDS

---

### **Sprint 5 (Feb 19 - Mar 5): Component System**
**Focus:** Build component library management

**Tasks:**
- [ ] 5.1 - 5.10 (Component CRUD and UI)

**Deliverable:** Component library view and detail pages

---

## 📊 Progress Tracking

### **Overall Progress**
- [x] Planning & Documentation: 100%
- [ ] Foundation Setup: 0%
- [ ] Authentication: 0%
- [ ] Admin Panel: 0%
- [ ] Penpot Integration: 20% (structure only)
- [ ] Component System: 15% (basic structure)

### **Next 5 Tasks (Priority Order)**
1. ⏳ **1.2** - Environment Configuration (2 hours)
2. ⏳ **1.3** - Database Schema Design (3 hours)
3. ⏳ **1.4** - TypeScript Types Definition (3 hours)
4. ⏳ **1.7** - Database Connection (3 hours)
5. ⏳ **1.8** - API Route Structure (2 hours)

### **Blockers**
- None currently

### **Risks**
- Penpot API documentation may be incomplete
- Token extraction logic complexity unknown
- Time estimates may need adjustment based on learnings

---

## 🎯 Definition of Done

A task is considered "done" when:
- [ ] Code is written and follows style guide
- [ ] Tests are written and passing
- [ ] Code is reviewed (self-review minimum)
- [ ] Documentation is updated
- [ ] No linting errors
- [ ] Works in both dev and prod environments
- [ ] Committed to git with meaningful message

---

## 📝 Notes

### **Time Estimates**
- Estimates are for a single developer
- Include coding, testing, and documentation
- Do not include code review time
- Buffer time built into sprint planning

### **Dependencies**
- Tasks marked with dependencies should not start until dependencies complete
- Some tasks can be done in parallel
- Re-evaluate dependencies if blocked

### **Updates**
- Review and update this document weekly
- Adjust estimates based on actual time taken
- Add discovered tasks as they arise
- Celebrate completed milestones! 🎉

---

**Document Owner**: Development Team  
**Next Review**: January 1, 2025  
**Status**: Ready for Sprint 1

