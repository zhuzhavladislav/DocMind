from .serializers import *
from ..models import *
import pickle
import os
import io
import string
import pymorphy2
import joblib
import re
import nltk
import speech_recognition as sr
import numpy as np
from keras.models import load_model
from nltk.stem import *
from nltk.corpus import stopwords
from nltk import word_tokenize
from pymystem3 import Mystem
from docx import Document  # библиотека для работы с .docx файлами
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import make_password
from sklearn.preprocessing import LabelEncoder

nltk.download('punkt')
nltk.download("stopwords")

RUSSIAN_STOPWORDS = stopwords.words("russian")
PUNCTUATION_MARKS = ['!', ',', '(', ')', ':', '-', '?', '.',
                     '..', '…', '...', '«', '»', ';', '—', '–',
                     '--', '­', ' ', ' ', '�', '”', '“', '×', '№', 'т.д.']

# Load models
style_classifier = load_model('./models/Style/style_text_classifier.h5')
with open('./models/Style/style_vectorizer.pkl', 'rb') as f:
    style_vectorizer = pickle.load(f)
with open('./models/Style/style_label_encoder.pkl', 'rb') as f:
    style_label_encoder = pickle.load(f)

topic_classifier = load_model('./models/Topic/topic_text_classifier.h5')
with open('./models/Topic/topic_vectorizer.pkl', 'rb') as f:
    topic_vectorizer = pickle.load(f)
with open('./models/Topic/topic_label_encoder.pkl', 'rb') as f:
    topic_label_encoder = pickle.load(f)

sentiment_classifier = load_model('./models/Sentiment/sentiment_text_classifier.h5')
with open('./models/Sentiment/sentiment_vectorizer.pkl', 'rb') as f:
    sentiment_vectorizer = pickle.load(f)
with open('./models/Sentiment/sentiment_label_encoder.pkl', 'rb') as f:
    sentiment_label_encoder = pickle.load(f)


# ---Семантический анализ---#

# Удаление знаков препинаний


def remove_punctuation(text):
    return "".join([ch if ch not in string.punctuation and ch not in PUNCTUATION_MARKS else ' ' for ch in text])

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
        token for token in tokens if token not in RUSSIAN_STOPWORDS and token != ' ']
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
    return {"withStopWords": dictionary_result or 0, "withoutStopWords": dictionary_core_result or 0}

# Поиск стоп-слов


def find_stop_words(text):
    tokens = word_tokenize(text)
    text_stop_words = [
        token for token in tokens if token in RUSSIAN_STOPWORDS and token != ' ']
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
    return {"list": result or 0, "count": count}

# Удаление стоп-слов


def remove_stop_words(text):
    tokens = word_tokenize(text)
    tokens = [
        token for token in tokens if token not in RUSSIAN_STOPWORDS and token != ' ']
    return " ".join(tokens)

# ---Анализ тональности---


def preprocess(text, stop_words, morph):  # Препроцесс
    tokens = word_tokenize(text.lower())
    preprocessed_text = []
    for token in tokens:
        if token not in PUNCTUATION_MARKS:
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


def vectorize_sequences(sequences, dimension=10000):  # Создаем мешок слов
    results = np.zeros((len(sequences), dimension))
    for i, sequence in enumerate(sequences):
        for index in sequence:
            results[i, index] += 1.
    return results


def predict_topic(text):  # предсказание тематики
    # преобразование текста в вектор признаков
    X = topic_vectorizer.transform([text]).toarray()

    # предсказание тематики
    y_pred = topic_classifier.predict(X)
    n_predictions = 3  # количество предсказаний, которые вы хотите получить

    # получение топ-n тематик
    result = []
    top_n_preds = y_pred[0].argsort()[::-1][:n_predictions]
    for i, pred in enumerate(top_n_preds):
        name = topic_label_encoder.inverse_transform([pred])[0]
        prob = y_pred[0][pred]
        result.append({"name": name.capitalize(),
                      "prob": "{:.1f}".format(prob * 100)})
    return result


def predict_style(text):  # предсказание стиля
    # преобразование текста в вектор признаков
    X = style_vectorizer.transform([text]).toarray()

    # предсказание стиля
    y_pred = style_classifier.predict(X)
    y_pred_label = np.argmax(y_pred)
    result = style_label_encoder.inverse_transform([y_pred_label])[0]
    return result.capitalize()


def predict_sentiment(text):  # предсказание стиля
    # преобразование текста в вектор признаков
    X = sentiment_vectorizer.transform([text]).toarray()

    # предсказание стиля
    y_pred = sentiment_classifier.predict(X)
    result = list(y_pred[0])
    return result

# Create your views here.
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        token['id'] = user.id
        # ...
        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@permission_classes([IsAuthenticated])
class UserTexts(APIView):
    def get(self, request):
        user = request.user
        texts = user.text_set.all().order_by('-id')
        serializer = TextSerializer(texts, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TextSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.error_messages[0], status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
class UserText(APIView):
    def get(self, request, text_num):
        try:
            user = request.user
            text = user.text_set.get(id=text_num)
        except Text.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = TextSerializer(text)
        return Response(serializer.data)

    def delete(self, request, text_num):
        try:
            user = request.user
            text = user.text_set.get(id=text_num)
        except Text.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        text.delete()  # удаление текста из базы данных

        return Response(status=status.HTTP_204_NO_CONTENT)


class RegisterUser(APIView):
    def post(self, request):
        if request.method == 'POST':
            username = request.data.get('username')
            email = request.data.get('email')
            password = request.data.get('password')
            if not username or not password or not email:
                return Response('Пожалуйста заполните все поля!',
                                status=status.HTTP_400_BAD_REQUEST)
            if not User.objects.filter(email=email).exists():
                try:
                    user = User.objects.create(
                        username=username, email=email, password=make_password(password))
                    user.save()
                except:
                    return Response('Пользователь с данным логином уже существует.',
                                    status=status.HTTP_400_BAD_REQUEST)
                return Response('Регистрация прошла успешно.',
                                status=status.HTTP_201_CREATED)
            else:
                return Response('Пользователь с данной почтой уже существует.',
                                status=status.HTTP_400_BAD_REQUEST)


class Analyze(APIView):
    def post(self, request):
        # Получаем текст от фронтенда
        if 'file' in request.FILES:  # Если входные данные - файл
            file = request.FILES['file']
            filename = file.name.lower()

            # Проверяем формат файла
            if filename.endswith('.txt'):
                # Получаем текст из файла
                text = file.read().decode('utf-8')
            elif filename.endswith('.doc') or filename.endswith('.docx'):
                # Получаем текст из файла формата .doc/.docx
                doc = Document(io.BytesIO(file.read()))
                text = '\n'.join(
                    [paragraph.text for paragraph in doc.paragraphs])
            else:
                # Неверный формат файла
                return Response('Неверный формат файла. Доступен анализ (.txt, .doc, .docx)', status=status.HTTP_400_BAD_REQUEST)
        elif 'audio' in request.FILES:  # Если входные данные - аудио
            audio = request.FILES['audio']
            extension = os.path.splitext(audio.name)[1]
            # Добавляем проверку на аудиофайлы форматов .wav или .mp3
            if extension == '.wav':
                # Получаем текст из аудиофайла
                r = sr.Recognizer()
                audio_file = sr.AudioFile(audio)
                with audio_file as source:
                    audio = r.record(source)
                    text = r.recognize_google(audio, language="ru-RU")
            else:
                # Неверный формат файла
                return Response('Неверный формат файла. Доступен анализ (.wav)', status=status.HTTP_400_BAD_REQUEST)
        elif 'text' in request.POST:  # Если входные данные - текст
            text = request.POST['text']
        elif 'text' in request.data:  # Если входные данные переданы через тело POST-запроса
            text = request.data['text']
        else:
            text = ""

        # Считаем количество симоволов
        num_symbols = len(text.replace('\n', ''))
        # Считаем количество символов без пробела
        num_symbols_without_space = len(
            text.replace(' ', '').replace('\n', ''))
        # Считаем количество слов
        num_words = len(text.split())
        # Удаляем из текста пунктуацию, числа, и двойные пробелы
        text_prepared = remove_multiple_spaces(
            remove_numbers(remove_punctuation(text.lower())))
        # Составляем словарь
        dictionary = dictionary_generate(lemmatize_text(text_prepared))
        # Ищем стоп слова и удаляем их
        stop_words = find_stop_words(text_prepared)
        text_prepared = remove_stop_words(text_prepared)

        # Лемматизируем текст
        text_lemmatized = lemmatize_text(text_prepared) 
        # Получаем предположение
        style = predict_style(text) # Определяем стиль текста
        topic = predict_topic(text_prepared) # Определяем стиль текста
        sentiment = predict_sentiment(text_lemmatized) # Определяем тон текста

        if (text_lemmatized == ""):
            result = 0
        else:
            result = {
                "text": text,
                "topic": topic,
                "style": style,
                "symbolsCount": num_symbols,
                "symbolsWithoutSpaceCount": num_symbols_without_space,
                "wordsCount": num_words,
                "stopWords": stop_words,
                "dictionary": dictionary,
                "sentiment": sentiment,
            }
        return Response(result)
