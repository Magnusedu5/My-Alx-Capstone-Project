from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class Department(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('HOD', 'Head of Department'),
        ('STAFF', 'Staff')
    )
    id = models.IntegerField(default=0)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    name = models.CharField(max_length=50)
    staff_email = models.EmailField(primary_key=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True)


    def __str__(self):
        return self.name

class Result(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    )

    SESSION_CHOICES = [
        ('2024/2025', '2024/2025'),
        ('2023/2024', '2023/2024'),
        # add more if you want static choices
    ]

    SEMESTER_CHOICES = [
        ('First', 'First'),
        ('Second', 'Second'),
    ]



    course_code = models.CharField(max_length=10, primary_key=True)
    course_title = models.CharField(max_length=100)
    session = models.CharField(max_length=10, choices=SESSION_CHOICES)
    semester = models.CharField(max_length=10, choices=SEMESTER_CHOICES)
    upload_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=100, choices=STATUS_CHOICES, default='PENDING')
    file = models.FileField(upload_to='results/', default= '/home/magnus/Downloads/results.pdf')


    uploaded_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='uploaded_results')


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
    uploaded_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='uploaded_document')
    status = models.CharField(max_length=100, choices=STATUS_CHOICES, default='PENDING')
    upload_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title