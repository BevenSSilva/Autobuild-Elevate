from django.contrib import admin
from django.urls import path, include  # <--- Added 'include'
from django.http import HttpResponse
from django.conf import settings
from django.conf.urls.static import static

def home(request):
    return HttpResponse("<h1>Backend Running 🚀</h1>")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),  # <--- CONNECTSYOUR NEW API
    path('', home),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)