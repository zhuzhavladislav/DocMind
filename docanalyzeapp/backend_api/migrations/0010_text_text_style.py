# Generated by Django 4.1.6 on 2023-05-05 07:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend_api', '0009_remove_text_semantic_logistic_regression_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='text',
            name='text_style',
            field=models.TextField(default='', max_length=100),
        ),
    ]