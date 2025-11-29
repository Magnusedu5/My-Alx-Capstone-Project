from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

# Create your models here.
class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('HOD', 'Head of Department'),
        ('STAFF', 'Staff')
    )

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='STAFF')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


class Session(models.Model):
    name = models.CharField(max_length=20, unique=True)  # e.g., "2023/2024"

    def __str__(self):
        return self.name


class Result(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    )

    SEMESTER_CHOICES = (
        ('First', 'First Semester'),
        ('Second', 'Second Semester'),
    )

    course_code = models.CharField(max_length=10)
    course_title = models.CharField(max_length=100)
    session = models.ForeignKey(Session, on_delete=models.CASCADE)
    semester = models.CharField(max_length=10, choices=SEMESTER_CHOICES)
    upload_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    file = models.FileField(upload_to='results/', blank=True, null=True)
    uploaded_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='uploaded_results')

    class Meta:
        unique_together = ['course_code', 'session', 'semester']

    def __str__(self):
        return f"{self.course_code} - {self.session} - {self.semester}"


class Document(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    )

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    uploaded_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='uploaded_documents')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    upload_date = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to='documents/')

    def __str__(self):
        return self.title