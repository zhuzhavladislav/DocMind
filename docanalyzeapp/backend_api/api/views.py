
from .serializers import *
from ..models import *
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.shortcuts import render
from rest_framework.decorators import api_view
from pymystem3 import Mystem
import pymorphy2
import joblib
import re
import pandas as pd
import numpy as np
import nltk
import string
from nltk.stem import *
from nltk.corpus import stopwords
from nltk import word_tokenize
nltk.download('punkt')
nltk.download("stopwords")


russian_stopwords = stopwords.words("russian")
punctuation_marks = ['!', ',', '(', ')', ':', '-', '?', '.',
                     '..', '…', '...', '«', '»', ';', '—', '–', '--', '­', ' ', ' ', '�']
morph = pymorphy2.MorphAnalyzer()
word_to_index = joblib.load('./AI/word_to_index')


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# @api_view(['GET', 'POST'])
# def getRoutes(request):
#     routes = [
#         '/api/token',
#         '/api/token/refresh',
#         '/analyze'
#     ]

#     return Response(routes)

# ---Семантический анализ---#
# Удаление знаков препинаний
def remove_punctuation(text):
    return "".join([ch if ch not in string.punctuation and ch not in punctuation_marks else ' ' for ch in text])

# Удаление чисел
def remove_numbers(text):
    return ''.join([i if not i.isdigit() else ' ' for i in text])

# Удаление двойных пробелов
def remove_multiple_spaces(text):
    return re.sub(r'\s+', ' ', text, flags=re.I)

# Лемматизация текста
def lemmatize_text(text):
    mystem = Mystem()
    text_lem = mystem.lemmatize(text)
    tokens = [token for token in text_lem if token != ' ']
    return " ".join(tokens)

# Составление словаря
def dictionary_generate(text):
    tokens = word_tokenize(text)
    dictionary = [token for token in tokens if token != ' ']
    dictionary_core = [
        token for token in tokens if token not in russian_stopwords and token != ' ']
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
    return [dictionary_result or 0, dictionary_core_result or 0]

# Поиск стоп-слов
def find_stop_words(text):
    tokens = word_tokenize(text)
    text_stop_words = [
        token for token in tokens if token in russian_stopwords and token != ' ']
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
    return [result or 0, count]

# Удаление стоп-слов
def remove_stop_words(text):
    tokens = word_tokenize(text)
    tokens = [
        token for token in tokens if token not in russian_stopwords and token != ' ']
    return " ".join(tokens)

# ---Анализ тональности---#
# Препроцес
def preprocess(text, stop_words, punctuation_marks, morph):
    tokens = word_tokenize(text.lower())
    preprocessed_text = []
    for token in tokens:
        if token not in punctuation_marks:
            lemma = morph.parse(token)[0].normal_form
            if lemma not in stop_words:
                preprocessed_text.append(lemma)
    return preprocessed_text

# Функция для преобразования списка слов в список кодов
def text_to_sequence(txt, word_to_index):
    seq = []
    for word in txt:
        index = word_to_index.get(word, 1)  # 1 означает неизвестное слово
        # Неизвестные слова не добавляем в выходную последовательность
        if index != 1:
            seq.append(index)
    return seq

# Создаем мешок слов
def vectorize_sequences(sequences, dimension=10000):
    results = np.zeros((len(sequences), dimension))
    for i, sequence in enumerate(sequences):
        for index in sequence:
            results[i, index] += 1.
    return results

# Load AI
semantic_native_bayes = joblib.load('./AI/semantic_native_bayes.pkl')
semantic_sgd = joblib.load('./AI/semantic_sgd.pkl')
semantic_logistic_regression = joblib.load(
    './AI/semantic_logistic_regression.pkl')
sentiment_logistic_regression = joblib.load(
    './AI/sentiment_logistic_regression.pkl')

# Create your views here.
class TextView(APIView):
    def get(self, request):
        output = [
            {
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
        num_symbols_without_space = len(
            [i for i in text if i != ' ' and i != "\n"])
        # Считаем количество слов
        num_words = len(text.split())
        # Удаляем из текста пунктуацию, числа, и двойные пробелы
        text2analyze = remove_multiple_spaces(
            remove_numbers(remove_punctuation(text.lower())))
        # Составляем словарь
        dictionary = dictionary_generate(lemmatize_text(text2analyze))
        # Ищем стоп слова и удаляем их
        stop_words = find_stop_words(text2analyze)
        text2analyze = remove_stop_words(text2analyze)
        # Лемматизируем текст
        text2analyze = lemmatize_text(text2analyze)

        # Обрабатываем текст для ТОНА
        preprocessed_text = preprocess(
            text, stop_words, punctuation_marks, morph)
        seq = text_to_sequence(preprocessed_text, word_to_index)
        bow = vectorize_sequences([seq], 10000)  # max 10000 слов

        # Получаем от ИИ предположение
        semantic_native_bayes_pred = semantic_native_bayes.predict([
                                                                   text2analyze])
        semantic_sgd_pred = semantic_sgd.predict([text2analyze])
        semantic_logistic_regression_pred = semantic_logistic_regression.predict([
                                                                                 text2analyze])
        sentiment_logistic_regression_pred = sentiment_logistic_regression.predict_proba(
            bow)
        if (text2analyze == ""):
            result = 0
        else:
            result = {
                "semantic_native_bayes": semantic_native_bayes_pred,
                "semantic_sgd": semantic_sgd_pred,
                "semantic_logistic_regression": semantic_logistic_regression_pred,
                "num_symbols": num_symbols,
                "num_symbols_without_space": num_symbols_without_space,
                "num_words": num_words,
                "stop_words": stop_words,
                "dictionary": dictionary,
                "sentiment": sentiment_logistic_regression_pred,
            }
        return Response(result)
