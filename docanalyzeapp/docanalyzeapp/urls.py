from django.contrib import admin
from django.urls import path, include, re_path as url
from backend_api.api.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('backend_api.api.urls')),
]
