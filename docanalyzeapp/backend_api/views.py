import joblib
import re
import pandas as pd
import numpy as np
import nltk
import string
from nltk.stem import *
from nltk.corpus import stopwords
from pymystem3 import Mystem
from nltk import word_tokenize
nltk.download('punkt')
nltk.download("stopwords")

from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from .serializers import *
from rest_framework.response import Response

def remove_punctuation(text):
    return "".join([ch if ch not in string.punctuation else ' ' for ch in text])

def remove_numbers(text):
    return ''.join([i if not i.isdigit() else ' ' for i in text])

def remove_multiple_spaces(text):
	return re.sub(r'\s+', ' ', text, flags=re.I)

def lemmatize_text(text):
    mystem = Mystem()
    text_lem = mystem.lemmatize(text)
    tokens = [token for token in text_lem if token != ' ']
    return " ".join(tokens)

def dictionary_generate(text):
    russian_stopwords = stopwords.words("russian")
    russian_stopwords.extend(['…', '«', '»', '...'])
    tokens = word_tokenize(text)
    dictionary = [token for token in tokens if token != ' ']
    dictionary_core = [token for token in tokens if token not in russian_stopwords and token != ' ']

    dictionary_result = []
    dictionary_core_result = []
    word_count = {}
    for word in dictionary:
        if word in word_count:
            word_count[word] += 1
        else:
            word_count[word] = 1

    for key, value in word_count.items():
        dictionary_result.append({"word": key, "count": value})

    word_count = {}
    for word in dictionary_core:
        if word in word_count:
            word_count[word] += 1
        else:
            word_count[word] = 1

    for key, value in word_count.items():
        dictionary_core_result.append({"word": key, "count": value})

    return [dictionary_result, dictionary_core_result]
    


def find_stop_words(text):
    russian_stopwords = stopwords.words("russian")
    russian_stopwords.extend(['…', '«', '»', '...'])
    tokens = word_tokenize(text)
    text_stop_words = [token for token in tokens if token in russian_stopwords and token != ' ']
    count = len(text_stop_words)
    word_count = {}
    for word in text_stop_words:
        if word in word_count:
            word_count[word] += 1
        else:
            word_count[word] = 1
    result = []
    for key, value in word_count.items():
        result.append({"word": key, "count": value})

    return [result, count]

def remove_stop_words(text):
    russian_stopwords = stopwords.words("russian")
    russian_stopwords.extend(['…', '«', '»', '...'])
    tokens = word_tokenize(text)
    tokens = [
        token for token in tokens if token not in russian_stopwords and token != ' ']

    return " ".join(tokens)

# Load AI
nb = joblib.load('native_bayes.pkl')
sgd = joblib.load('sgd.pkl')
logreg = joblib.load('logistic_regression.pkl')

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

# Тематический анализ текста, полученного от фронтэнда
class Analyze(APIView):
    def post(self, request):
        # Получаем текст от фронтенда
        text = request.POST.get('text', 'default')
        # Считаем количество симоволов
        num_symbols = len([i for i in text if i != "\n"])
        # Считаем количество символов без пробела
        num_symbols_without_space = len([i for i in text if i != ' ' and i != "\n"])
        # Считаем количество слов
        num_words = len(text.split())
        # Удаляем из текста пунктуацию, числа, и двойные пробелы
        text2analyze = remove_multiple_spaces(remove_numbers(remove_punctuation(text.lower())))
        # Составляем словарь
        dictionary = dictionary_generate(lemmatize_text(text2analyze))
        # Ищем стоп слова и удаляем их
        stop_words = find_stop_words(text2analyze)
        text2analyze = remove_stop_words(text2analyze)
        # Лемматизируем текст
        text2analyze = lemmatize_text(text2analyze)
        # Получаем от ИИ предположение
        nb_pred = nb.predict([text2analyze])  
        sgd_pred = sgd.predict([text2analyze])
        logreg_pred = logreg.predict([text2analyze])

        result = {
            "nb": nb_pred,
            "sgd": sgd_pred,
            "logreg": logreg_pred,
            "num_symbols": num_symbols,
            "num_symbols_without_space": num_symbols_without_space,
            "num_words": num_words,
            "stop_words": stop_words,
            "dictionary": dictionary,
        }
        return Response(result)
