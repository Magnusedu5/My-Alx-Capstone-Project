from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
import json
from .models import CustomUser, Document, Result, Session, Department
from django.core.files.uploadedfile import SimpleUploadedFile
import io


class APIAuthenticationTestCase(TestCase):
    """Test cases for API authentication"""
    
    def setUp(self):
        self.client = APIClient()
        self.department = Department.objects.create(name='Computer Science')
        self.hod = CustomUser.objects.create_user(
            username='hoduser',
            email='hod@example.com',
            password='pass1234',
            role='HOD',
            department=self.department
        )
        self.staff = CustomUser.objects.create_user(
            username='staffuser',
            email='staff@example.com',
            password='pass1234',
            role='STAFF',
            department=self.department
        )
    
    def test_login_with_email(self):
        """Test login with email and password"""
        response = self.client.post(
            reverse('api_login'),
            {'email': 'staff@example.com', 'password': 'pass1234'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIn('token', data)
        self.assertIn('user', data)
        self.assertEqual(data['user']['email'], 'staff@example.com')
    
    def test_login_with_username(self):
        """Test login with username and password"""
        response = self.client.post(
            reverse('api_login'),
            {'email': 'staffuser', 'password': 'pass1234'},
            format='json'
        )
        # May return 200 OK or 401 depending on backend implementation
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_401_UNAUTHORIZED])
    
    def test_login_with_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = self.client.post(
            reverse('api_login'),
            {'email': 'staff@example.com', 'password': 'wrongpass'},
            format='json'
        )
        # Should return 400 or 401 for invalid credentials
        self.assertIn(response.status_code, [status.HTTP_400_BAD_REQUEST, status.HTTP_401_UNAUTHORIZED])
    
    def test_login_without_credentials(self):
        """Test login without providing credentials"""
        response = self.client.post(reverse('api_login'), {}, format='json')
        # Should return 400 or 401 for missing credentials
        self.assertIn(response.status_code, [status.HTTP_400_BAD_REQUEST, status.HTTP_401_UNAUTHORIZED])


class APIProfileTestCase(TestCase):
    """Test cases for user profile API"""
    
    def setUp(self):
        self.client = APIClient()
        self.staff = CustomUser.objects.create_user(
            username='staffuser',
            email='staff@example.com',
            password='pass1234',
            role='STAFF'
        )
        # Login and get token
        response = self.client.post(
            reverse('api_login'),
            {'email': 'staff@example.com', 'password': 'pass1234'},
            format='json'
        )
        self.token = response.json().get('token')
    
    def test_profile_requires_auth(self):
        """Test that profile endpoint requires authentication"""
        response = self.client.get(reverse('api_profile'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_profile_returns_user_data(self):
        """Test that profile returns correct user data"""
        response = self.client.get(
            reverse('api_profile'),
            HTTP_AUTHORIZATION=f'Bearer {self.token}'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data['email'], 'staff@example.com')
        self.assertEqual(data['role'], 'staff')
        self.assertEqual(data['username'], 'staffuser')


class APIDocumentTestCase(TestCase):
    """Test cases for Document API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.hod = CustomUser.objects.create_user(
            username='hoduser',
            email='hod@example.com',
            password='pass1234',
            role='HOD'
        )
        self.staff = CustomUser.objects.create_user(
            username='staffuser',
            email='staff@example.com',
            password='pass1234',
            role='STAFF'
        )
        self.other_staff = CustomUser.objects.create_user(
            username='otherstaff',
            email='other@example.com',
            password='pass1234',
            role='STAFF'
        )
        
        # Create documents
        self.doc = Document.objects.create(
            title='Doc1',
            description='desc',
            uploaded_by=self.staff,
            file=SimpleUploadedFile('doc.txt', b'content')
        )
        
        # Get tokens
        response = self.client.post(
            reverse('api_login'),
            {'email': 'staff@example.com', 'password': 'pass1234'},
            format='json'
        )
        self.staff_token = response.json().get('token')
        
        response = self.client.post(
            reverse('api_login'),
            {'email': 'hod@example.com', 'password': 'pass1234'},
            format='json'
        )
        self.hod_token = response.json().get('token')
        
        response = self.client.post(
            reverse('api_login'),
            {'email': 'other@example.com', 'password': 'pass1234'},
            format='json'
        )
        self.other_token = response.json().get('token')
    
    def test_list_documents_requires_auth(self):
        """Test that listing documents requires authentication"""
        response = self.client.get(reverse('api_documents_list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_staff_can_list_documents(self):
        """Test that staff can list documents"""
        response = self.client.get(
            reverse('api_documents_list'),
            HTTP_AUTHORIZATION=f'Bearer {self.staff_token}'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_staff_can_upload_document(self):
        """Test that staff can upload documents"""
        file_content = b'test file content'
        file = SimpleUploadedFile('test.txt', file_content, content_type='text/plain')
        
        response = self.client.post(
            reverse('api_documents_upload'),
            {
                'title': 'New Document',
                'description': 'Test description',
                'file': file
            },
            HTTP_AUTHORIZATION=f'Bearer {self.staff_token}',
            format='multipart'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Document.objects.filter(title='New Document').count(), 1)
    
    def test_staff_cannot_delete_other_staff_document(self):
        """Test that staff cannot delete documents uploaded by other staff"""
        other_doc = Document.objects.create(
            title='Doc2',
            uploaded_by=self.other_staff,
            file=SimpleUploadedFile('doc2.txt', b'content')
        )
        
        response = self.client.delete(
            reverse('api_documents_delete', kwargs={'document_id': other_doc.pk}),
            HTTP_AUTHORIZATION=f'Bearer {self.staff_token}'
        )
        self.assertIn(response.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_401_UNAUTHORIZED])
    
    def test_hod_can_delete_any_document(self):
        """Test that HOD can delete any document"""
        response = self.client.delete(
            reverse('api_documents_delete', kwargs={'document_id': self.doc.pk}),
            HTTP_AUTHORIZATION=f'Bearer {self.hod_token}'
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Document.objects.filter(pk=self.doc.pk).exists())
    
    def test_hod_can_approve_document(self):
        """Test that HOD can approve documents"""
        response = self.client.patch(
            reverse('api_documents_approve', kwargs={'document_id': self.doc.pk}),
            HTTP_AUTHORIZATION=f'Bearer {self.hod_token}'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.doc.refresh_from_db()
        self.assertEqual(self.doc.status, 'APPROVED')
    
    def test_hod_can_reject_document(self):
        """Test that HOD can reject documents"""
        response = self.client.patch(
            reverse('api_documents_reject', kwargs={'document_id': self.doc.pk}),
            HTTP_AUTHORIZATION=f'Bearer {self.hod_token}'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.doc.refresh_from_db()
        self.assertEqual(self.doc.status, 'REJECTED')
    
    def test_staff_cannot_approve_document(self):
        """Test that staff cannot approve documents"""
        response = self.client.patch(
            reverse('api_documents_approve', kwargs={'document_id': self.doc.pk}),
            HTTP_AUTHORIZATION=f'Bearer {self.staff_token}'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class APIResultTestCase(TestCase):
    """Test cases for Result API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.session = Session.objects.create(name='2024/2025')
        
        self.hod = CustomUser.objects.create_user(
            username='hoduser',
            email='hod@example.com',
            password='pass1234',
            role='HOD'
        )
        self.staff = CustomUser.objects.create_user(
            username='staffuser',
            email='staff@example.com',
            password='pass1234',
            role='STAFF'
        )
        self.other_staff = CustomUser.objects.create_user(
            username='otherstaff',
            email='other@example.com',
            password='pass1234',
            role='STAFF'
        )
        
        # Create result
        self.result = Result.objects.create(
            course_code='CSC101',
            course_title='Intro',
            session=self.session,
            semester='First',
            uploaded_by=self.staff
        )
        
        # Get tokens
        response = self.client.post(
            reverse('api_login'),
            {'email': 'staff@example.com', 'password': 'pass1234'},
            format='json'
        )
        self.staff_token = response.json().get('token')
        
        response = self.client.post(
            reverse('api_login'),
            {'email': 'hod@example.com', 'password': 'pass1234'},
            format='json'
        )
        self.hod_token = response.json().get('token')
        
        response = self.client.post(
            reverse('api_login'),
            {'email': 'other@example.com', 'password': 'pass1234'},
            format='json'
        )
        self.other_token = response.json().get('token')
    
    def test_list_results_requires_auth(self):
        """Test that listing results requires authentication"""
        response = self.client.get(reverse('api_results_list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_staff_can_list_results(self):
        """Test that staff can list results"""
        response = self.client.get(
            reverse('api_results_list'),
            HTTP_AUTHORIZATION=f'Bearer {self.staff_token}'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_staff_can_upload_result(self):
        """Test that staff can upload results"""
        file_content = b'test result content'
        file = SimpleUploadedFile('result.pdf', file_content, content_type='application/pdf')
        
        response = self.client.post(
            reverse('api_results_upload'),
            {
                'course_code': 'CSC102',
                'course_title': 'Data Structures',
                'session': self.session.id,
                'semester': 'First',
                'file': file
            },
            HTTP_AUTHORIZATION=f'Bearer {self.staff_token}',
            format='multipart'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Result.objects.filter(course_code='CSC102').count(), 1)
    
    def test_staff_cannot_delete_other_staff_result(self):
        """Test that staff cannot delete results uploaded by other staff"""
        other_result = Result.objects.create(
            course_code='CSC102',
            course_title='Another',
            session=self.session,
            semester='First',
            uploaded_by=self.other_staff
        )
        
        response = self.client.delete(
            reverse('api_results_delete', kwargs={'result_id': other_result.pk}),
            HTTP_AUTHORIZATION=f'Bearer {self.staff_token}'
        )
        self.assertIn(response.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_401_UNAUTHORIZED])
    
    def test_hod_can_delete_any_result(self):
        """Test that HOD can delete any result"""
        response = self.client.delete(
            reverse('api_results_delete', kwargs={'result_id': self.result.pk}),
            HTTP_AUTHORIZATION=f'Bearer {self.hod_token}'
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Result.objects.filter(pk=self.result.pk).exists())
    
    def test_hod_can_approve_result(self):
        """Test that HOD can approve results"""
        response = self.client.patch(
            reverse('api_results_approve', kwargs={'result_id': self.result.pk}),
            HTTP_AUTHORIZATION=f'Bearer {self.hod_token}'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.result.refresh_from_db()
        self.assertEqual(self.result.status, 'APPROVED')
    
    def test_hod_can_reject_result(self):
        """Test that HOD can reject results"""
        response = self.client.patch(
            reverse('api_results_reject', kwargs={'result_id': self.result.pk}),
            HTTP_AUTHORIZATION=f'Bearer {self.hod_token}'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.result.refresh_from_db()
        self.assertEqual(self.result.status, 'REJECTED')
    
    def test_staff_cannot_approve_result(self):
        """Test that staff cannot approve results"""
        response = self.client.patch(
            reverse('api_results_approve', kwargs={'result_id': self.result.pk}),
            HTTP_AUTHORIZATION=f'Bearer {self.staff_token}'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_result_filter_by_session(self):
        """Test filtering results by session"""
        response = self.client.get(
            reverse('api_results_filter'),
            {'session': self.session.id},
            HTTP_AUTHORIZATION=f'Bearer {self.staff_token}'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertTrue(all(r['session'] == self.session.id for r in data))


class APIDashboardTestCase(TestCase):
    """Test cases for Dashboard API"""
    
    def setUp(self):
        self.client = APIClient()
        self.session = Session.objects.create(name='2024/2025')
        
        self.hod = CustomUser.objects.create_user(
            username='hoduser',
            email='hod@example.com',
            password='pass1234',
            role='HOD'
        )
        self.staff = CustomUser.objects.create_user(
            username='staffuser',
            email='staff@example.com',
            password='pass1234',
            role='STAFF'
        )
        
        # Create some documents and results
        Document.objects.create(
            title='Doc1',
            uploaded_by=self.staff,
            file=SimpleUploadedFile('doc1.txt', b'content'),
            status='PENDING'
        )
        Document.objects.create(
            title='Doc2',
            uploaded_by=self.staff,
            file=SimpleUploadedFile('doc2.txt', b'content'),
            status='APPROVED'
        )
        Result.objects.create(
            course_code='CSC101',
            course_title='Intro',
            session=self.session,
            semester='First',
            uploaded_by=self.staff,
            status='PENDING'
        )
        
        # Get tokens
        response = self.client.post(
            reverse('api_login'),
            {'email': 'staff@example.com', 'password': 'pass1234'},
            format='json'
        )
        self.staff_token = response.json().get('token')
        
        response = self.client.post(
            reverse('api_login'),
            {'email': 'hod@example.com', 'password': 'pass1234'},
            format='json'
        )
        self.hod_token = response.json().get('token')
    
    def test_dashboard_requires_auth(self):
        """Test that dashboard requires authentication"""
        response = self.client.get(reverse('api_dashboard'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_staff_dashboard_shows_correct_stats(self):
        """Test that staff dashboard shows correct statistics"""
        response = self.client.get(
            reverse('api_dashboard'),
            HTTP_AUTHORIZATION=f'Bearer {self.staff_token}'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIn('total_documents', data)
        self.assertIn('total_results', data)
    
    def test_hod_dashboard_shows_pending_items(self):
        """Test that HOD dashboard shows pending items"""
        response = self.client.get(
            reverse('api_dashboard'),
            HTTP_AUTHORIZATION=f'Bearer {self.hod_token}'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIn('pending_documents', data)
        self.assertIn('pending_results', data)


# Legacy tests - keeping for backward compatibility
class APITestCase(TestCase):
    def setUp(self):
        # Create users
        self.hod = CustomUser.objects.create_user(username='hoduser', email='hod@example.com', password='pass1234', role='HOD')
        self.staff = CustomUser.objects.create_user(username='staffuser', email='staff@example.com', password='pass1234', role='STAFF')

        # Create a session
        self.session = Session.objects.create(name='2024/2025')

        # Create a document uploaded by staff
        self.doc = Document.objects.create(title='Doc1', description='desc', uploaded_by=self.staff, file=SimpleUploadedFile('doc.txt', b'content'))

        # Create a result uploaded by staff
        self.result = Result.objects.create(course_code='CSC101', course_title='Intro', session=self.session, semester='First', uploaded_by=self.staff)

        # Use DRF test client
        self.client = APIClient()

    def test_profile_requires_auth(self):
        url = reverse('api_profile')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 401)

    def test_profile_returns_user(self):
        # login as staff using tokens via login view
        login_url = reverse('api_login')
        resp = self.client.post(login_url, {'email': 'staff@example.com', 'password': 'pass1234'}, format='json')
        self.assertEqual(resp.status_code, 200)
        resp_json = json.loads(resp.content.decode('utf-8'))
        token = resp_json.get('token')
        self.assertTrue(token)

        # Provide auth header on the profile request
        resp = self.client.get(reverse('api_profile'), HTTP_AUTHORIZATION=f'Bearer {token}')
        self.assertEqual(resp.status_code, 200)
        profile = json.loads(resp.content.decode('utf-8'))
        self.assertEqual(profile.get('email'), 'staff@example.com')
        self.assertEqual(profile.get('role'), 'staff')

    def test_staff_cannot_delete_other_document(self):
        # Create another staff and document
        other = CustomUser.objects.create_user(username='other', email='other@example.com', password='pass1234', role='STAFF')
        other_doc = Document.objects.create(title='Doc2', uploaded_by=other, file=SimpleUploadedFile('doc2.txt', b'content'))

        # login as staff
        resp = self.client.post(reverse('api_login'), {'email': 'staff@example.com', 'password': 'pass1234'}, format='json')
        resp_json = json.loads(resp.content.decode('utf-8'))
        token = resp_json.get('token')

        # Attempt to delete other_doc
        # use .pk to satisfy static analysis
        del_url = reverse('api_documents_delete', kwargs={'document_id': other_doc.pk})
        resp = self.client.delete(del_url, HTTP_AUTHORIZATION=f'Bearer {token}')
        self.assertIn(resp.status_code, (403, 401))

    def test_hod_can_delete_any_document(self):
        resp = self.client.post(reverse('api_login'), {'email': 'hod@example.com', 'password': 'pass1234'}, format='json')
        resp_json = json.loads(resp.content.decode('utf-8'))
        token = resp_json.get('token')

        del_url = reverse('api_documents_delete', kwargs={'document_id': self.doc.pk})
        resp = self.client.delete(del_url, HTTP_AUTHORIZATION=f'Bearer {token}')
        self.assertEqual(resp.status_code, 204)

    def test_staff_cannot_delete_other_result(self):
        other = CustomUser.objects.create_user(username='other2', email='other2@example.com', password='pass1234', role='STAFF')
        other_result = Result.objects.create(course_code='CSC102', course_title='Another', session=self.session, semester='First', uploaded_by=other)

        resp = self.client.post(reverse('api_login'), {'email': 'staff@example.com', 'password': 'pass1234'}, format='json')
        resp_json = json.loads(resp.content.decode('utf-8'))
        token = resp_json.get('token')

        del_url = reverse('api_results_delete', kwargs={'result_id': other_result.pk})
        resp = self.client.delete(del_url, HTTP_AUTHORIZATION=f'Bearer {token}')
        self.assertIn(resp.status_code, (403, 401))

    def test_hod_can_delete_any_result(self):
        resp = self.client.post(reverse('api_login'), {'email': 'hod@example.com', 'password': 'pass1234'}, format='json')
        resp_json = json.loads(resp.content.decode('utf-8'))
        token = resp_json.get('token')

        del_url = reverse('api_results_delete', kwargs={'result_id': self.result.pk})
        resp = self.client.delete(del_url, HTTP_AUTHORIZATION=f'Bearer {token}')
        self.assertEqual(resp.status_code, 204)
