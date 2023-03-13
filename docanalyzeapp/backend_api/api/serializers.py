from rest_framework import serializers
from ..models import *

class TextSerializer(serializers.ModelSerializer):
    class Meta:
        model = Text
        fields = ['text']  # or fields = '__all__'
