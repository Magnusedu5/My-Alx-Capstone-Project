from django import forms
from .models import Result

class ResultUploadForm(forms.ModelForm):
    class Meta:
        model = Result
        fields = ['session', 'semester', 'course_code', 'file']
