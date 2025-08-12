from django.contrib import admin
from .models import Result, Document, Department, CustomUser

admin.site.register(Result)
admin.site.register(Document)
admin.site.register(Department)
admin.site.register(CustomUser)
