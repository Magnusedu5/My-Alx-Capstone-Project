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
    list_display = ('course_code', 'course_title', 'session', 'semester', 'status', 'uploaded_by', 'upload_date', 'storage_type')
    list_filter = ('status', 'semester', 'session', 'uploaded_by')
    search_fields = ('course_code', 'course_title')
    readonly_fields = ('upload_date', 'updated_at', 'view_file_link', 'gdrive_link')
    
    fieldsets = (
        ('Course Information', {
            'fields': ('course_code', 'course_title', 'session', 'semester')
        }),
        ('Status', {
            'fields': ('status', 'uploaded_by', 'upload_date', 'updated_at')
        }),
        ('File Storage', {
            'fields': ('file', 'gdrive_file_id', 'gdrive_file_url', 'original_filename', 
                      'view_file_link', 'gdrive_link'),
            'description': 'Files are automatically uploaded to Google Drive.'
        }),
    )
    
    def storage_type(self, obj):
        """Show whether file is stored on Google Drive or locally"""
        from django.utils.html import format_html
        if obj.gdrive_file_id:
            return format_html('<span style="color: green;">☁️ Google Drive</span>')
        elif obj.file:
            return format_html('<span style="color: orange;">💾 Local Storage</span>')
        return format_html('<span style="color: red;">❌ No File</span>')
    storage_type.short_description = 'Storage'
    
    def view_file_link(self, obj):
        """Display clickable link to view the file"""
        from django.utils.html import format_html
        if obj.gdrive_file_url:
            return format_html('<a href="{}" target="_blank">🔗 View on Google Drive</a>', obj.gdrive_file_url)
        elif obj.file:
            return format_html('<a href="{}" target="_blank">🔗 View Local File</a>', obj.file.url)
        return "No file"
    view_file_link.short_description = 'File Link'
    
    def gdrive_link(self, obj):
        """Display Google Drive link if available"""
        from django.utils.html import format_html
        if obj.gdrive_file_url:
            return format_html('<a href="{}" target="_blank">{}</a>', obj.gdrive_file_url, obj.gdrive_file_url)
        return "Not on Google Drive"
    gdrive_link.short_description = 'Google Drive URL'


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'uploaded_by', 'upload_date', 'storage_type')
    list_filter = ('status', 'uploaded_by')
    search_fields = ('title', 'description')
    readonly_fields = ('upload_date', 'view_file_link', 'gdrive_link')
    
    fieldsets = (
        ('Document Information', {
            'fields': ('title', 'description')
        }),
        ('Status', {
            'fields': ('status', 'uploaded_by', 'upload_date')
        }),
        ('File Storage', {
            'fields': ('file', 'gdrive_file_id', 'gdrive_file_url', 'original_filename',
                      'view_file_link', 'gdrive_link'),
            'description': 'Files are automatically uploaded to Google Drive.'
        }),
    )
    
    def storage_type(self, obj):
        """Show whether file is stored on Google Drive or locally"""
        from django.utils.html import format_html
        if obj.gdrive_file_id:
            return format_html('<span style="color: green;">☁️ Google Drive</span>')
        elif obj.file:
            return format_html('<span style="color: orange;">💾 Local Storage</span>')
        return format_html('<span style="color: red;">❌ No File</span>')
    storage_type.short_description = 'Storage'
    
    def view_file_link(self, obj):
        """Display clickable link to view the file"""
        from django.utils.html import format_html
        if obj.gdrive_file_url:
            return format_html('<a href="{}" target="_blank">🔗 View on Google Drive</a>', obj.gdrive_file_url)
        elif obj.file:
            return format_html('<a href="{}" target="_blank">🔗 View Local File</a>', obj.file.url)
        return "No file"
    view_file_link.short_description = 'File Link'
    
    def gdrive_link(self, obj):
        """Display Google Drive link if available"""
        from django.utils.html import format_html
        if obj.gdrive_file_url:
            return format_html('<a href="{}" target="_blank">{}</a>', obj.gdrive_file_url, obj.gdrive_file_url)
        return "Not on Google Drive"
    gdrive_link.short_description = 'Google Drive URL'


admin.site.register(CustomUser, CustomUserAdmin)
