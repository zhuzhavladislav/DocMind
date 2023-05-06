from rest_framework import serializers
from ..models import *

class TextSerializer(serializers.ModelSerializer):
    class Meta:
        model = Text
        # or fields = '__all__'
        fields = ['user', 'id', 'text', 'topic', 'style',
                  'symbolsCount', 'symbolsWithoutSpaceCount',
                  'wordsCount', 'stopWords', 'dictionary',
                  'sentiment', 'date']
