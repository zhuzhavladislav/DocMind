from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # path('', views.getRoutes),
    path('analyze/', Analyze.as_view(), name='text_analyze'),
    path('texts/', UserTexts.as_view(), name="User's texts"),
    path('texts/<int:text_num>/', UserText.as_view(), name="User's text"),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
