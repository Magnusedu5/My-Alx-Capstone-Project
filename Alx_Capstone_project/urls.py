from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # REST API endpoints for the React frontend
    path('api/', include('DMS_ALX.api_urls')),
    
    # Traditional Django views (optional - for non-API access)
    path('', include('DMS_ALX.urls')),
]

# Serve media files in all environments
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
