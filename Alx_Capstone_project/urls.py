from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from DMS_ALX import views as dms_views

urlpatterns = [
    path('admin/', admin.site.urls),
    # REST API endpoints for the React frontend
    path('api/', include('DMS_ALX.api_urls')),
]

# Catch-all: serve the frontend SPA for any non-admin, non-api path in production.
urlpatterns += [
    re_path(r'^(?!admin/|api/).*$', dms_views.serve_react_index),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
