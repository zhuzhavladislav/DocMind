from django.db import models

# Create your models here.
class User_profile(models.Model):
    name = models.CharField(max_length=200, default="", blank=True)
    email = models.EmailField(max_length=100, default="", blank=True)
    message=models.TextField(default="",blank=True)

    def __str__(self):
        return str(self.name)

class Text(models.Model):
    title = models.CharField(max_length=100, default="", blank=True)
    text = models.TextField(max_length=500, default="", blank=True)
