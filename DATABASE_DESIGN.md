# HIV Care Connect - Database Design & ERD

## Overview
This document outlines the database design for the HIV Care Connect medical website, based on the TypeScript interfaces and medical domain requirements.

## Database Schema

### 1. User Management Tables

#### `Users` Table
```sql
CREATE TABLE Users (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Email NVARCHAR(255) UNIQUE NOT NULL,
    Name NVARCHAR(255) NOT NULL,
    PasswordHash NVARCHAR(500) NOT NULL,
    Role NVARCHAR(20) CHECK (Role IN ('patient', 'doctor', 'admin')) NOT NULL,
    Phone NVARCHAR(20),
    DateOfBirth DATE,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    IsActive BIT DEFAULT 1,
    LastLogin DATETIME2,
    
    INDEX IX_Users_Email (Email),
    INDEX IX_Users_Role (Role)
);
```

#### `PatientProfiles` Table
```sql
CREATE TABLE PatientProfiles (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    Address NVARCHAR(500),
    EmergencyContact NVARCHAR(255),
    HivStatus NVARCHAR(20) CHECK (HivStatus IN ('positive', 'negative', 'unknown')) NOT NULL,
    DiagnosisDate DATE,
    CurrentCD4Count INT,
    CurrentViralLoad DECIMAL(18,2),
    Allergies NVARCHAR(MAX), -- JSON array of allergies
    Comorbidities NVARCHAR(MAX), -- JSON array of comorbidities
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    INDEX IX_PatientProfiles_UserId (UserId),
    INDEX IX_PatientProfiles_HivStatus (HivStatus)
);
```

#### `DoctorProfiles` Table
```sql
CREATE TABLE DoctorProfiles (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    Specialization NVARCHAR(255) NOT NULL,
    LicenseNumber NVARCHAR(100) UNIQUE NOT NULL,
    Experience INT NOT NULL,
    Education NVARCHAR(MAX), -- JSON array of education
    Certifications NVARCHAR(MAX), -- JSON array of certifications
    Bio NVARCHAR(MAX),
    IsAvailable BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    INDEX IX_DoctorProfiles_UserId (UserId),
    INDEX IX_DoctorProfiles_LicenseNumber (LicenseNumber)
);
```

#### `DoctorSchedules` Table
```sql
CREATE TABLE DoctorSchedules (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    DoctorId UNIQUEIDENTIFIER NOT NULL,
    DayOfWeek INT CHECK (DayOfWeek BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    IsAvailable BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (DoctorId) REFERENCES DoctorProfiles(Id) ON DELETE CASCADE,
    INDEX IX_DoctorSchedules_DoctorId (DoctorId),
    INDEX IX_DoctorSchedules_DayOfWeek (DayOfWeek)
);
```

### 2. Medication Management Tables

#### `Medications` Table
```sql
CREATE TABLE Medications (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(255) NOT NULL,
    GenericName NVARCHAR(255),
    Category NVARCHAR(100), -- ARV, Antibiotic, etc.
    Description NVARCHAR(MAX),
    SideEffects NVARCHAR(MAX), -- JSON array
    Contraindications NVARCHAR(MAX), -- JSON array
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    
    INDEX IX_Medications_Name (Name),
    INDEX IX_Medications_Category (Category)
);
```

#### `ARVProtocols` Table
```sql
CREATE TABLE ARVProtocols (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(255) NOT NULL,
    Drugs NVARCHAR(MAX) NOT NULL, -- JSON array of drug IDs
    Indication NVARCHAR(500) NOT NULL,
    Contraindications NVARCHAR(MAX), -- JSON array
    SideEffects NVARCHAR(MAX), -- JSON array
    Dosage NVARCHAR(255) NOT NULL,
    Frequency NVARCHAR(100) NOT NULL,
    IsForPregnant BIT DEFAULT 0,
    IsForChildren BIT DEFAULT 0,
    AgeGroup NVARCHAR(50),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    
    INDEX IX_ARVProtocols_Name (Name),
    INDEX IX_ARVProtocols_IsActive (IsActive)
);
```

#### `PatientMedications` Table
```sql
CREATE TABLE PatientMedications (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    PatientId UNIQUEIDENTIFIER NOT NULL,
    MedicationId UNIQUEIDENTIFIER NOT NULL,
    Dosage NVARCHAR(100) NOT NULL,
    Frequency NVARCHAR(100) NOT NULL,
    Instructions NVARCHAR(MAX),
    StartDate DATE NOT NULL,
    EndDate DATE,
    IsActive BIT DEFAULT 1,
    PrescribedBy UNIQUEIDENTIFIER NOT NULL, -- Doctor ID
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (PatientId) REFERENCES PatientProfiles(Id) ON DELETE CASCADE,
    FOREIGN KEY (MedicationId) REFERENCES Medications(Id),
    FOREIGN KEY (PrescribedBy) REFERENCES DoctorProfiles(Id),
    INDEX IX_PatientMedications_PatientId (PatientId),
    INDEX IX_PatientMedications_IsActive (IsActive)
);
```

#### `MedicationLogs` Table
```sql
CREATE TABLE MedicationLogs (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    PatientMedicationId UNIQUEIDENTIFIER NOT NULL,
    TakenAt DATETIME2 NOT NULL,
    DosageTaken NVARCHAR(100),
    Notes NVARCHAR(500),
    IsCompliant BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (PatientMedicationId) REFERENCES PatientMedications(Id) ON DELETE CASCADE,
    INDEX IX_MedicationLogs_PatientMedicationId (PatientMedicationId),
    INDEX IX_MedicationLogs_TakenAt (TakenAt)
);
```

### 3. Appointment Management Tables

#### `Appointments` Table
```sql
CREATE TABLE Appointments (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    PatientId UNIQUEIDENTIFIER NOT NULL,
    DoctorId UNIQUEIDENTIFIER NOT NULL,
    DateTime DATETIME2 NOT NULL,
    Duration INT DEFAULT 30, -- minutes
    Type NVARCHAR(50) CHECK (Type IN ('consultation', 'followup', 'emergency', 'counseling')) NOT NULL,
    Status NVARCHAR(50) CHECK (Status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no-show')) DEFAULT 'scheduled',
    Notes NVARCHAR(MAX),
    Symptoms NVARCHAR(MAX), -- JSON array
    Diagnosis NVARCHAR(MAX),
    Prescription NVARCHAR(MAX), -- JSON array
    NextAppointmentDate DATE,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (PatientId) REFERENCES PatientProfiles(Id) ON DELETE CASCADE,
    FOREIGN KEY (DoctorId) REFERENCES DoctorProfiles(Id),
    INDEX IX_Appointments_PatientId (PatientId),
    INDEX IX_Appointments_DoctorId (DoctorId),
    INDEX IX_Appointments_DateTime (DateTime),
    INDEX IX_Appointments_Status (Status)
);
```

### 4. Medical Test & Lab Results Tables

#### `TestTypes` Table
```sql
CREATE TABLE TestTypes (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Code NVARCHAR(20) UNIQUE NOT NULL,
    Name NVARCHAR(255) NOT NULL,
    Category NVARCHAR(100), -- cd4, viralLoad, bloodWork, other
    Description NVARCHAR(500),
    Unit NVARCHAR(50),
    ReferenceRangeMin DECIMAL(18,2),
    ReferenceRangeMax DECIMAL(18,2),
    ReferenceRange NVARCHAR(255), -- For non-numeric ranges
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    
    INDEX IX_TestTypes_Code (Code),
    INDEX IX_TestTypes_Category (Category)
);
```

#### `TestResults` Table
```sql
CREATE TABLE TestResults (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    PatientId UNIQUEIDENTIFIER NOT NULL,
    TestTypeId UNIQUEIDENTIFIER NOT NULL,
    Value NVARCHAR(255) NOT NULL,
    NumericValue DECIMAL(18,2), -- For numeric values
    Status NVARCHAR(20) CHECK (Status IN ('normal', 'abnormal', 'critical')) NOT NULL,
    TestDate DATE NOT NULL,
    OrderedBy UNIQUEIDENTIFIER NOT NULL, -- Doctor ID
    Notes NVARCHAR(MAX),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (PatientId) REFERENCES PatientProfiles(Id) ON DELETE CASCADE,
    FOREIGN KEY (TestTypeId) REFERENCES TestTypes(Id),
    FOREIGN KEY (OrderedBy) REFERENCES DoctorProfiles(Id),
    INDEX IX_TestResults_PatientId (PatientId),
    INDEX IX_TestResults_TestDate (TestDate),
    INDEX IX_TestResults_Status (Status)
);
```

#### `LabReports` Table
```sql
CREATE TABLE LabReports (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    PatientId UNIQUEIDENTIFIER NOT NULL,
    ReportDate DATE NOT NULL,
    Summary NVARCHAR(MAX) NOT NULL,
    Recommendations NVARCHAR(MAX), -- JSON array
    DoctorId UNIQUEIDENTIFIER NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (PatientId) REFERENCES PatientProfiles(Id) ON DELETE CASCADE,
    FOREIGN KEY (DoctorId) REFERENCES DoctorProfiles(Id),
    INDEX IX_LabReports_PatientId (PatientId),
    INDEX IX_LabReports_ReportDate (ReportDate)
);
```

#### `LabReportTests` Table (Junction Table)
```sql
CREATE TABLE LabReportTests (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    LabReportId UNIQUEIDENTIFIER NOT NULL,
    TestResultId UNIQUEIDENTIFIER NOT NULL,
    
    FOREIGN KEY (LabReportId) REFERENCES LabReports(Id) ON DELETE CASCADE,
    FOREIGN KEY (TestResultId) REFERENCES TestResults(Id) ON DELETE CASCADE,
    INDEX IX_LabReportTests_LabReportId (LabReportId),
    INDEX IX_LabReportTests_TestResultId (TestResultId)
);
```

### 5. Notification System Tables

#### `Notifications` Table
```sql
CREATE TABLE Notifications (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    Type NVARCHAR(50) CHECK (Type IN ('medication', 'appointment', 'test', 'system', 'emergency')) NOT NULL,
    Title NVARCHAR(255) NOT NULL,
    Message NVARCHAR(MAX) NOT NULL,
    Priority NVARCHAR(20) CHECK (Priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    IsRead BIT DEFAULT 0,
    ScheduledFor DATETIME2,
    ActionUrl NVARCHAR(500),
    Metadata NVARCHAR(MAX), -- JSON object
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    ReadAt DATETIME2,
    
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    INDEX IX_Notifications_UserId (UserId),
    INDEX IX_Notifications_Type (Type),
    INDEX IX_Notifications_IsRead (IsRead),
    INDEX IX_Notifications_ScheduledFor (ScheduledFor)
);
```

### 6. Content Management Tables

#### `BlogCategories` Table
```sql
CREATE TABLE BlogCategories (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(255) NOT NULL,
    Slug NVARCHAR(255) UNIQUE NOT NULL,
    Description NVARCHAR(MAX),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    
    INDEX IX_BlogCategories_Slug (Slug),
    INDEX IX_BlogCategories_IsActive (IsActive)
);
```

#### `BlogPosts` Table
```sql
CREATE TABLE BlogPosts (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Title NVARCHAR(500) NOT NULL,
    Slug NVARCHAR(255) UNIQUE NOT NULL,
    Excerpt NVARCHAR(MAX),
    Content NVARCHAR(MAX) NOT NULL,
    CategoryId UNIQUEIDENTIFIER NOT NULL,
    Tags NVARCHAR(MAX), -- JSON array
    AuthorId UNIQUEIDENTIFIER NOT NULL,
    FeaturedImage NVARCHAR(500),
    ReadTime INT DEFAULT 5,
    Views INT DEFAULT 0,
    IsPublished BIT DEFAULT 0,
    PublishedAt DATETIME2,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (CategoryId) REFERENCES BlogCategories(Id),
    FOREIGN KEY (AuthorId) REFERENCES Users(Id),
    INDEX IX_BlogPosts_Slug (Slug),
    INDEX IX_BlogPosts_CategoryId (CategoryId),
    INDEX IX_BlogPosts_AuthorId (AuthorId),
    INDEX IX_BlogPosts_IsPublished (IsPublished),
    INDEX IX_BlogPosts_PublishedAt (PublishedAt)
);
```

### 7. Audit & Security Tables

#### `AuditLogs` Table
```sql
CREATE TABLE AuditLogs (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER,
    Action NVARCHAR(100) NOT NULL,
    TableName NVARCHAR(100) NOT NULL,
    RecordId UNIQUEIDENTIFIER,
    OldValues NVARCHAR(MAX), -- JSON object
    NewValues NVARCHAR(MAX), -- JSON object
    IpAddress NVARCHAR(45),
    UserAgent NVARCHAR(500),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    INDEX IX_AuditLogs_UserId (UserId),
    INDEX IX_AuditLogs_TableName (TableName),
    INDEX IX_AuditLogs_CreatedAt (CreatedAt)
);
```

#### `UserSessions` Table
```sql
CREATE TABLE UserSessions (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    SessionToken NVARCHAR(500) UNIQUE NOT NULL,
    RefreshToken NVARCHAR(500) UNIQUE NOT NULL,
    IpAddress NVARCHAR(45),
    UserAgent NVARCHAR(500),
    ExpiresAt DATETIME2 NOT NULL,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    LastAccessedAt DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    INDEX IX_UserSessions_UserId (UserId),
    INDEX IX_UserSessions_SessionToken (SessionToken),
    INDEX IX_UserSessions_RefreshToken (RefreshToken),
    INDEX IX_UserSessions_ExpiresAt (ExpiresAt)
);
```

## Entity Relationship Diagram (ERD)

```
┌─────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    Users    │◄─────►│ PatientProfiles │       │ DoctorProfiles  │
│             │       │                 │       │                 │
│ Id (PK)     │       │ Id (PK)         │       │ Id (PK)         │
│ Email       │       │ UserId (FK)     │       │ UserId (FK)     │
│ Name        │       │ Address         │       │ Specialization  │
│ Role        │       │ HivStatus       │       │ LicenseNumber   │
│ Phone       │       │ DiagnosisDate   │       │ Experience      │
│ ...         │       │ ...             │       │ ...             │
└─────────────┘       └─────────────────┘       └─────────────────┘
       │                       │                         │
       │                       │                         │
       ▼                       ▼                         ▼
┌─────────────┐       ┌─────────────────┐       ┌─────────────────┐
│Notifications│       │ PatientMedications │    │ DoctorSchedules │
│             │       │                    │    │                 │
│ Id (PK)     │       │ Id (PK)           │    │ Id (PK)         │
│ UserId (FK) │       │ PatientId (FK)    │    │ DoctorId (FK)   │
│ Type        │       │ MedicationId (FK)  │    │ DayOfWeek       │
│ Title       │       │ PrescribedBy (FK)  │    │ StartTime       │
│ ...         │       │ ...               │    │ ...             │
└─────────────┘       └─────────────────┘       └─────────────────┘
                              │                         │
                              │                         │
                              ▼                         ▼
                      ┌─────────────────┐       ┌─────────────────┐
                      │   Medications   │       │  Appointments   │
                      │                 │       │                 │
                      │ Id (PK)         │       │ Id (PK)         │
                      │ Name            │       │ PatientId (FK)  │
                      │ Category        │       │ DoctorId (FK)   │
                      │ Description     │       │ DateTime        │
                      │ ...             │       │ Type            │
                      └─────────────────┘       │ Status          │
                              │                 │ ...             │
                              │                 └─────────────────┘
                              ▼
                      ┌─────────────────┐
                      │ MedicationLogs  │
                      │                 │
                      │ Id (PK)         │
                      │ PatientMedicationId (FK) │
                      │ TakenAt         │
                      │ IsCompliant     │
                      │ ...             │
                      └─────────────────┘

┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  TestResults    │       │   TestTypes     │       │   LabReports    │
│                 │       │                 │       │                 │
│ Id (PK)         │       │ Id (PK)         │       │ Id (PK)         │
│ PatientId (FK)  │──────►│ Code            │       │ PatientId (FK)  │
│ TestTypeId (FK) │       │ Name            │       │ DoctorId (FK)   │
│ Value           │       │ Category        │       │ ReportDate      │
│ Status          │       │ Unit            │       │ Summary         │
│ TestDate        │       │ ReferenceRange  │       │ ...             │
│ OrderedBy (FK)  │       │ ...             │       └─────────────────┘
│ ...             │       └─────────────────┘               │
└─────────────────┘                                         │
        │                                                   │
        │                                                   ▼
        │                                       ┌─────────────────┐
        └──────────────────────────────────────►│ LabReportTests  │
                                                │                 │
                                                │ Id (PK)         │
                                                │ LabReportId (FK)│
                                                │ TestResultId (FK)│
                                                └─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│  BlogPosts      │       │ BlogCategories  │
│                 │       │                 │
│ Id (PK)         │       │ Id (PK)         │
│ Title           │──────►│ Name            │
│ Slug            │       │ Slug            │
│ Content         │       │ Description     │
│ CategoryId (FK) │       │ ...             │
│ AuthorId (FK)   │       └─────────────────┘
│ ...             │
└─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│  AuditLogs      │       │  UserSessions   │
│                 │       │                 │
│ Id (PK)         │       │ Id (PK)         │
│ UserId (FK)     │       │ UserId (FK)     │
│ Action          │       │ SessionToken    │
│ TableName       │       │ RefreshToken    │
│ OldValues       │       │ ExpiresAt       │
│ NewValues       │       │ IsActive        │
│ ...             │       │ ...             │
└─────────────────┘       └─────────────────┘
```

## Key Database Features

### 1. Security & Compliance
- HIPAA-compliant audit logging
- Encrypted sensitive data storage
- Role-based access control
- Session management with token expiration

### 2. Medical Domain-Specific Features
- HIV status tracking and monitoring
- ARV protocol management
- CD4/Viral load trending
- Medication adherence tracking
- Comprehensive test result management

### 3. Performance Optimizations
- Strategic indexing on frequently queried columns
- JSON storage for flexible array data
- Efficient foreign key relationships
- Optimized for read-heavy workloads

### 4. Data Integrity
- Foreign key constraints
- Check constraints for enum values
- Unique constraints for critical fields
- Default values for system fields

### 5. Scalability Considerations
- UUID primary keys for distributed systems
- Proper normalization to reduce redundancy
- Flexible metadata storage using JSON
- Efficient pagination support through indexes

## Implementation Notes

1. **JSON Storage**: Used for arrays and flexible metadata to reduce table complexity
2. **Soft Deletes**: Consider adding `IsDeleted` flags for critical entities
3. **Encryption**: Sensitive fields should be encrypted at application level
4. **Backup Strategy**: Implement automated backups for HIPAA compliance
5. **Migration Strategy**: Use Entity Framework migrations for version control
6. **Monitoring**: Implement database performance monitoring for optimization
