from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from .serializers import *
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from .permissions import *

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print(request.data)
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "User registered successfully!"
            }, status=status.HTTP_201_CREATED)
        return Response({
            "error": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Both username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            refresh["role"] = user.role  

            return Response({
                'message': "Login successful!",
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)

        return Response({"error": "Invalid username or password."}, status=status.HTTP_401_UNAUTHORIZED)

class TravelRequestAPI(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrOwner]  
    def get(self, request):
        
        travel_id = request.query_params.get('id')

        if travel_id:
            travel_request = get_object_or_404(TravelRequest, id=travel_id)
            self.check_object_permissions(request, travel_request) 
            serializer = TravelRequestSerializer(travel_request)
            return Response(serializer.data, status=status.HTTP_200_OK)

        if request.user.role == "admin":
            travel_requests = TravelRequest.objects.all() 
        else:
            travel_requests = TravelRequest.objects.filter(user=request.user)  

        serializer = TravelRequestSerializer(travel_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = TravelRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        travel_id = request.query_params.get('id')
        if not travel_id:
            return Response({"error": "ID parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        travel_request = get_object_or_404(TravelRequest, id=travel_id)
        serializer = TravelRequestSerializer(travel_request, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        travel_id = request.query_params.get('id')
        if not travel_id:
            return Response({"error": "ID parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        travel_request = get_object_or_404(TravelRequest, id=travel_id)
        travel_request.delete()
        return Response({"message": "Travel request deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    


class UpdateTravelRequestStatus(APIView):
    permission_classes = [IsAuthenticated, IsAdmin] 

    def put(self, request):
       
        request_id = request.query_params.get("id")
        if not request_id:
            return Response({"error": "ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        travel_request = get_object_or_404(TravelRequest, id=request_id)

        self.check_object_permissions(request, travel_request)

        serializer = TravelRequestUpdateSerializer(travel_request, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()  
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)