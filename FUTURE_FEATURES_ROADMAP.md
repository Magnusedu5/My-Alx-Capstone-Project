# 🚀 Future Features Roadmap

## ✅ Current Status: Application Live and Operational!

**Frontend:** https://my-alx-capstone-project-frontend.onrender.com  
**Backend:** https://my-alx-capstone-project.onrender.com  

---

## 🎯 Planned Features

### 1. HOD Digital Signatures ✍️

**Description:** HODs can upload their signature image to their profile. When they approve a document, the signature is automatically attached to the approval.

#### Implementation Plan:

##### Backend Changes:

**A. Update User Model (Add signature field):**
```python
# DMS_ALX/models.py
class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('HOD', 'Head of Department'),
        ('STAFF', 'Staff')
    )
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='STAFF')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    signature = models.ImageField(upload_to='signatures/', null=True, blank=True)  # NEW
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
```

**B. Create Approval Model (Track approvals with signatures):**
```python
# DMS_ALX/models.py
class DocumentApproval(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='approvals')
    approved_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    approved_at = models.DateTimeField(auto_now_add=True)
    signature = models.ImageField(upload_to='approval_signatures/')  # Copy of HOD signature
    comments = models.TextField(blank=True, null=True)
    
    class Meta:
        unique_together = ['document', 'approved_by']

class ResultApproval(models.Model):
    result = models.ForeignKey(Result, on_delete=models.CASCADE, related_name='approvals')
    approved_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    approved_at = models.DateTimeField(auto_now_add=True)
    signature = models.ImageField(upload_to='approval_signatures/')
    comments = models.TextField(blank=True, null=True)
    
    class Meta:
        unique_together = ['result', 'approved_by']
```

**C. Update API Views:**
```python
# DMS_ALX/api_views.py
from rest_framework.parsers import MultiPartParser, FormParser

class UploadSignatureView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self, request):
        user = request.user
        if user.role != 'HOD':
            return Response({'error': 'Only HODs can upload signatures'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        signature_file = request.FILES.get('signature')
        if signature_file:
            user.signature = signature_file
            user.save()
            return Response({'message': 'Signature uploaded successfully'})
        return Response({'error': 'No signature file provided'}, 
                       status=status.HTTP_400_BAD_REQUEST)

class ApproveDocumentView(APIView):
    permission_classes = [IsAuthenticated, IsHOD]
    
    def post(self, request, pk):
        document = get_object_or_404(Document, pk=pk)
        user = request.user
        
        # Check if HOD has signature
        if not user.signature:
            return Response({'error': 'Please upload your signature first'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Approve document
        document.status = 'APPROVED'
        document.save()
        
        # Create approval record with signature
        DocumentApproval.objects.create(
            document=document,
            approved_by=user,
            signature=user.signature,  # Copy signature
            comments=request.data.get('comments', '')
        )
        
        return Response({'message': 'Document approved successfully'})
```

**D. Add URL Endpoints:**
```python
# DMS_ALX/api_urls.py
urlpatterns = [
    # ... existing endpoints
    path('signature/upload/', UploadSignatureView.as_view(), name='upload-signature'),
    path('signature/', GetSignatureView.as_view(), name='get-signature'),
]
```

##### Frontend Changes:

**A. Create Signature Upload Component:**
```typescript
// src/components/SignatureUpload.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import api from '@/lib/api';

export const SignatureUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('signature', file);
    
    try {
      await api.post('/signature/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Signature uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload signature');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3>Upload Your Signature</h3>
      <Input 
        type="file" 
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <Button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Upload Signature'}
      </Button>
    </div>
  );
};
```

**B. Add to HOD Profile Page:**
```typescript
// src/pages/Profile.tsx (new page)
import { SignatureUpload } from '@/components/SignatureUpload';

const Profile = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1>My Profile</h1>
        <SignatureUpload />
      </div>
    </Layout>
  );
};
```

#### Database Migration:
```bash
python manage.py makemigrations
python manage.py migrate
```

---

### 2. Google Drive Integration ☁️

**Description:** Automatically backup approved documents to Google Drive for cloud storage and easy sharing.

#### Implementation Plan:

##### A. Install Required Packages:
```bash
pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib
```

Add to `requirements.txt`:
```
google-api-python-client==2.108.0
google-auth-httplib2==0.1.1
google-auth-oauthlib==1.2.0
```

##### B. Set Up Google Drive API:

**1. Create Google Cloud Project:**
- Go to: https://console.cloud.google.com/
- Create new project: "DMS-ALX-Drive-Integration"
- Enable Google Drive API
- Create OAuth 2.0 credentials
- Download `credentials.json`

**2. Add to Django Settings:**
```python
# settings.py
GOOGLE_DRIVE_CREDENTIALS_FILE = os.path.join(BASE_DIR, 'credentials.json')
GOOGLE_DRIVE_FOLDER_ID = 'your-folder-id-here'  # Create a folder in your Drive
```

##### C. Create Google Drive Service:

```python
# DMS_ALX/services/google_drive.py
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
import os
import pickle

SCOPES = ['https://www.googleapis.com/auth/drive.file']

class GoogleDriveService:
    def __init__(self):
        self.creds = None
        self.service = None
        self.authenticate()
    
    def authenticate(self):
        """Authenticate with Google Drive API"""
        if os.path.exists('token.pickle'):
            with open('token.pickle', 'rb') as token:
                self.creds = pickle.load(token)
        
        if not self.creds or not self.creds.valid:
            if self.creds and self.creds.expired and self.creds.refresh_token:
                self.creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    'credentials.json', SCOPES)
                self.creds = flow.run_local_server(port=0)
            
            with open('token.pickle', 'wb') as token:
                pickle.dump(self.creds, token)
        
        self.service = build('drive', 'v3', credentials=self.creds)
    
    def upload_file(self, file_path, file_name, folder_id=None):
        """Upload file to Google Drive"""
        file_metadata = {
            'name': file_name,
            'parents': [folder_id] if folder_id else []
        }
        
        media = MediaFileUpload(file_path, resumable=True)
        
        file = self.service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id, webViewLink'
        ).execute()
        
        return {
            'file_id': file.get('id'),
            'web_link': file.get('webViewLink')
        }
    
    def create_folder(self, folder_name, parent_folder_id=None):
        """Create a folder in Google Drive"""
        file_metadata = {
            'name': folder_name,
            'mimeType': 'application/vnd.google-apps.folder',
            'parents': [parent_folder_id] if parent_folder_id else []
        }
        
        folder = self.service.files().create(
            body=file_metadata,
            fields='id'
        ).execute()
        
        return folder.get('id')
```

##### D. Update Document Model:

```python
# DMS_ALX/models.py
class Document(models.Model):
    # ... existing fields ...
    google_drive_file_id = models.CharField(max_length=255, blank=True, null=True)
    google_drive_link = models.URLField(blank=True, null=True)
    synced_to_drive = models.BooleanField(default=False)
    drive_sync_date = models.DateTimeField(null=True, blank=True)
```

##### E. Create Signal to Auto-Upload on Approval:

```python
# DMS_ALX/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from .models import Document, Result
from .services.google_drive import GoogleDriveService

@receiver(post_save, sender=Document)
def sync_approved_document_to_drive(sender, instance, **kwargs):
    """Automatically upload approved documents to Google Drive"""
    if instance.status == 'APPROVED' and not instance.synced_to_drive:
        try:
            drive_service = GoogleDriveService()
            
            # Upload to Drive
            result = drive_service.upload_file(
                file_path=instance.file.path,
                file_name=f"{instance.title}_{instance.id}.pdf",
                folder_id=settings.GOOGLE_DRIVE_FOLDER_ID
            )
            
            # Update document record
            instance.google_drive_file_id = result['file_id']
            instance.google_drive_link = result['web_link']
            instance.synced_to_drive = True
            instance.drive_sync_date = timezone.now()
            instance.save()
            
            print(f"Document {instance.id} synced to Google Drive")
        except Exception as e:
            print(f"Error syncing document to Drive: {e}")

@receiver(post_save, sender=Result)
def sync_approved_result_to_drive(sender, instance, **kwargs):
    """Automatically upload approved results to Google Drive"""
    # Similar implementation for results
    pass
```

**Register signals:**
```python
# DMS_ALX/apps.py
from django.apps import AppConfig

class DmsAlxConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'DMS_ALX'
    
    def ready(self):
        import DMS_ALX.signals  # Register signals
```

##### F. Add API Endpoints:

```python
# DMS_ALX/api_views.py
class SyncToDriveView(APIView):
    permission_classes = [IsAuthenticated, IsHOD]
    
    def post(self, request, pk):
        """Manually sync a document to Google Drive"""
        document = get_object_or_404(Document, pk=pk)
        
        if document.status != 'APPROVED':
            return Response({'error': 'Only approved documents can be synced'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        try:
            drive_service = GoogleDriveService()
            result = drive_service.upload_file(
                file_path=document.file.path,
                file_name=f"{document.title}_{document.id}.pdf",
                folder_id=settings.GOOGLE_DRIVE_FOLDER_ID
            )
            
            document.google_drive_file_id = result['file_id']
            document.google_drive_link = result['web_link']
            document.synced_to_drive = True
            document.drive_sync_date = timezone.now()
            document.save()
            
            return Response({
                'message': 'Document synced to Google Drive',
                'drive_link': result['web_link']
            })
        except Exception as e:
            return Response({'error': str(e)}, 
                          status=status.HTTP_500_INTERNAL_SERVER_ERROR)
```

##### G. Frontend Integration:

```typescript
// src/lib/documents.ts
export const syncToGoogleDrive = async (documentId: number) => {
  const response = await api.post(`/documents/${documentId}/sync-to-drive/`);
  return response.data;
};
```

```typescript
// src/pages/Documents.tsx - Add button
{doc.status === "APPROVED" && !doc.synced_to_drive && (
  <Button
    size="sm"
    variant="outline"
    onClick={() => handleSyncToDrive(doc.id)}
  >
    <Cloud className="w-4 h-4 mr-1" />
    Sync to Drive
  </Button>
)}

{doc.google_drive_link && (
  <a href={doc.google_drive_link} target="_blank" rel="noopener noreferrer">
    <Button size="sm" variant="outline">
      <ExternalLink className="w-4 h-4 mr-1" />
      View in Drive
    </Button>
  </a>
)}
```

---

### 3. Enhanced Database (PostgreSQL) 🗄️

**Description:** Upgrade from SQLite to PostgreSQL for better performance and scalability.

#### Implementation:

**A. Render PostgreSQL Setup:**
1. Go to Render Dashboard
2. Click "New +" → "PostgreSQL"
3. Create database
4. Copy connection string

**B. Update Django Settings:**
```python
# settings.py
import dj_database_url

DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL'),
        conn_max_age=600
    )
}
```

**C. Install Package:**
```bash
pip install dj-database-url psycopg2-binary
```

**D. Migrate Data:**
```bash
# Dump SQLite data
python manage.py dumpdata > backup.json

# Update DATABASE_URL in Render
# Run migrations
python manage.py migrate

# Load data
python manage.py loaddata backup.json
```

---

## 📊 Implementation Priority

### Phase 1 (Immediate - Next 1-2 weeks):
1. ✅ HOD Signature Upload
2. ✅ Signature Display on Profile
3. ✅ Attach Signature to Approvals

### Phase 2 (Short-term - Next 1 month):
1. ✅ Google Drive API Setup
2. ✅ Auto-sync Approved Documents
3. ✅ Manual Sync Button
4. ✅ Drive Link Display

### Phase 3 (Medium-term - Next 2 months):
1. ✅ PostgreSQL Migration
2. ✅ Advanced Search & Filters
3. ✅ Bulk Operations
4. ✅ Email Notifications

---

## 🛠️ Additional Feature Ideas

### 4. Email Notifications 📧
- Notify staff when document is approved/rejected
- Notify HOD when new document is uploaded
- Weekly summary reports

### 5. Advanced Search & Filters 🔍
- Search by date range
- Filter by status, department, uploader
- Full-text search in document content

### 6. Audit Trail 📝
- Track all changes to documents
- Who approved, when, and why
- Version history

### 7. Bulk Operations ⚡
- Bulk approve multiple documents
- Bulk download
- Bulk delete

### 8. Analytics Dashboard 📊
- Charts and graphs
- Approval rates
- Upload trends
- Department statistics

### 9. Document Templates 📄
- Pre-defined document templates
- Auto-fill common fields
- Template library

### 10. Mobile App 📱
- React Native mobile app
- Push notifications
- Offline mode

---

## 📝 Getting Started with New Features

### Step 1: Create Feature Branch
```bash
git checkout -b feature/hod-signatures
```

### Step 2: Implement Changes
- Follow implementation plan above
- Test locally thoroughly

### Step 3: Deploy
```bash
git add .
git commit -m "Add HOD signature feature"
git push origin feature/hod-signatures
# Create pull request
# Merge to main
# Auto-deploys to Render
```

---

## 🆘 Need Help Implementing?

I can help you implement any of these features step-by-step. Just let me know which one you'd like to start with!

**Recommended Start:** HOD Signatures (easiest to implement, high impact)

---

## 📚 Resources

- **Google Drive API Docs:** https://developers.google.com/drive/api/v3/quickstart/python
- **Django Signals:** https://docs.djangoproject.com/en/5.0/topics/signals/
- **PostgreSQL on Render:** https://render.com/docs/databases
- **File Uploads:** https://docs.djangoproject.com/en/5.0/topics/http/file-uploads/

---

**Ready to add these features? Let me know which one you'd like to implement first!** 🚀
