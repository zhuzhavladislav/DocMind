from django.db import models
from django.contrib.auth.models import User

class Text(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    text = models.TextField(max_length=10000, default="", blank=False)
    semantic_native_bayes = models.CharField(max_length=20, default="", blank=False)
    semantic_sgd = models.CharField(max_length=20, default="", blank=False)
    semantic_logistic_regression = models.CharField(max_length=20, default="", blank=False)
    num_symbols = models.PositiveIntegerField(default=0, blank=False)
    num_symbols_without_space = models.PositiveIntegerField(default=0, blank=False)
    num_words = models.PositiveIntegerField(default=0, blank=False)
    stop_words = models.JSONField(default=dict, blank=False)
    dictionary = models.JSONField(default=dict, blank=False)
    sentiment = models.JSONField(default=dict, blank=False)
    date = models.DateTimeField(auto_now_add=True, blank=False)
