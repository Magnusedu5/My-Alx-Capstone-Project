from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Department, Document, Result, Session
from typing import cast, Any


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'department', 'is_staff', 'is_active')
    list_filter = ('role', 'department', 'is_staff', 'is_active')
    search_fields = ('username', 'email', 'first_name', 'last_name')

    # Convert to concrete tuple instances to help static analysis
    fieldsets: Any = cast(tuple, UserAdmin.fieldsets) + (
        ('Role & Department', {'fields': ('role', 'department')}),
    )

    add_fieldsets: Any = cast(tuple, UserAdmin.add_fieldsets) + (
        ('Role & Department', {'fields': ('role', 'department')}),
    )


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Result)
class ResultAdmin(admin.ModelAdmin):
    list_display = ('course_code', 'course_title', 'session', 'semester', 'status', 'uploaded_by', 'upload_date')
    list_filter = ('status', 'semester', 'session', 'uploaded_by')
    search_fields = ('course_code', 'course_title')
    readonly_fields = ('upload_date', 'updated_at')


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'uploaded_by', 'upload_date')
    list_filter = ('status', 'uploaded_by')
    search_fields = ('title', 'description')
    readonly_fields = ('upload_date',)


admin.site.register(CustomUser, CustomUserAdmin)
