from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from .serializers import *
from rest_framework.response import Response

# Create your views here.
class TextView(APIView):
    def get(self, request):
        output = [
            {
                "title": output.title,
                "text": output.text
            } for output in Text.objects.all()
        ]
        return Response(output)

    def post(self, request):
        serializers = TextSerializer(data=request.data)
        if serializers.is_valid(raise_exception=True):
            serializers.save()
            return Response(serializers.data)