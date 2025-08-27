from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Department, Document, Result

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    # Use staff_email instead of username
    list_display = ('staff_email', 'name', 'role', 'department', 'is_approved', 'is_staff', 'is_active')
    list_filter = ('role', 'is_approved', 'is_staff', 'is_active', 'department')
    search_fields = ('staff_email', 'name')
    ordering = ('staff_email',)

    fieldsets = (
        (None, {'fields': ('staff_email', 'password')}),
        ('Personal Info', {'fields': ('name', 'role', 'department')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_approved', 'groups', 'user_permissions')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('staff_email', 'name', 'role', 'department', 'password1', 'password2', 'is_staff', 'is_active', 'is_approved')}
        ),
    )

# Register models
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Result)
admin.site.register(Document)
admin.site.register(Department)
