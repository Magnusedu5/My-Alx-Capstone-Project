from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
import json
from .models import CustomUser, Document, Result, Session
from django.core.files.uploadedfile import SimpleUploadedFile


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
