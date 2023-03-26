from rest_framework import serializers
from ..models import *

class TextSerializer(serializers.ModelSerializer):
    class Meta:
        model = Text
        # or fields = '__all__'
        fields = ['user', 'id', 'text', 'semantic_native_bayes',
                  'semantic_sgd', 'semantic_logistic_regression',
                  'num_symbols', 'num_symbols_without_space',
                  'num_words', 'stop_words', 'dictionary',
                  'sentiment', 'date']
