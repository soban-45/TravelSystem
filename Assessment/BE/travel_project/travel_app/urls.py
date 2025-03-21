from django.urls import path
from .views import * 

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('travel_request/', TravelRequestAPI.as_view(), name='travel_request'),
    path('travel_request/update_status/', UpdateTravelRequestStatus.as_view(), name='update_travel_status'),

]
