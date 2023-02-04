import re
from textblob import TextBlob
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

# Сентиментальный анализ текста, полученного от фронтэнда (тестовое, в дальнейшем будут другие алгоритмы)
class Analyze(APIView):
    def post(self, request):
        djText = request.POST.get('text', 'default')

        djText = ' '.join(re.sub(
            "(@[A-Za-zА-Яа-я0-9]+)|([^0-9A-Za-zА-Яа-я \t])|(\w+:\/\/\S+)", " ", djText).split())
        countword = len(djText.split())

        analysis = TextBlob(djText)
        # set sentiment
        if analysis.sentiment.polarity > 0:
            final = "Positive Text"
        elif analysis.sentiment.polarity == 0:
            final = "Neutral Text"
        else:
            final = "Negative Text"

        result = {
            "purpose": "Sentiment Analysis",
            "analyzed_text": final,
            "wordcount": countword,
            "polarity": analysis.sentiment.polarity
        }
        return Response(result)
