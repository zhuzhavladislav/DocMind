# Generated by Django 4.1.6 on 2023-03-26 10:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend_api', '0007_rename_sentiment_logistic_regression_text_sentiment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='text',
            name='text',
            field=models.TextField(default='', max_length=10000),
        ),
    ]