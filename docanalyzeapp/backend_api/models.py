from django.db import models
from django.contrib.auth.models import User

class Text(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    text = models.TextField(max_length=10000, default="", blank=False)
    topic = models.JSONField(default=dict, blank=False)
    style = models.TextField(max_length=100, default="", blank=False)
    symbolsCount = models.PositiveIntegerField(default=0, blank=False)
    symbolsWithoutSpaceCount = models.PositiveIntegerField(
        default=0, blank=False)
    wordsCount = models.PositiveIntegerField(default=0, blank=False)
    stopWords = models.JSONField(default=dict, blank=False)
    dictionary = models.JSONField(default=dict, blank=False)
    sentiment = models.JSONField(default=dict, blank=False)
    date = models.DateTimeField(auto_now_add=True, blank=False)
