from django import forms
from .models import Result
from django.contrib.auth.forms import AuthenticationForm
from .models import CustomUser, Document


class ResultUploadForm(forms.ModelForm):
    class Meta:
        model = Result
        fields = ['session', 'semester', 'course_code', 'file']

        

class ApprovedUserLoginForm(AuthenticationForm):
    def confirm_login_allowed(self, user):
        if not CustomUser.is_approved:
            raise forms.ValidationError(
                "Your account is not approved yet. Please contact the admin.",
                code='inactive',
            )
        


class DocumentUploadForm(forms.ModelForm):
    class Meta:
        model = Document
        fields = ['title', 'file']
