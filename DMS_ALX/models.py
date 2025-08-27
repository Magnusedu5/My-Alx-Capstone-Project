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
    username = None
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    name = models.CharField(max_length=50)
    staff_email = models.EmailField(unique=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    is_approved = models.BooleanField(default=False)

    USERNAME_FIELD = 'staff_email'
    REQUIRED_FIELDS = ['name', 'role']


    def __str__(self):
        return f"{self.name} ({self.role})"

class Result(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    )

    SEMESTER_CHOICES = (
        ('First', 'First'),
        ('Second', 'Second'),
    )


    id = models.AutoField(primary_key=True)
    course_code = models.CharField(max_length=10, unique=True)
    course_title = models.CharField(max_length=100)
    session = models.CharField(max_length=10)
    semester = models.CharField(max_length=10, choices=SEMESTER_CHOICES)
    upload_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=100, choices=STATUS_CHOICES, default='PENDING')
    file = models.FileField(upload_to='results/', blank=True, null=True)


    uploaded_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True, related_name='uploaded_results')


    def __str__(self):
        return f"{self.session} - {self.semester} - {self.course_code}"


class Document(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    )

    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    status = models.CharField(max_length=100, choices=STATUS_CHOICES, default='PENDING')
    upload_date = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to='document/', blank=True, null=True)


    def __str__(self):
        return self.title