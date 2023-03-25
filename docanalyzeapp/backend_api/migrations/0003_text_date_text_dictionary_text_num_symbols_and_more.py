# Generated by Django 4.1.6 on 2023-03-25 16:44

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('backend_api', '0002_delete_user_profile_remove_text_title_text_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='text',
            name='date',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='text',
            name='dictionary',
            field=models.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name='text',
            name='num_symbols',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='text',
            name='num_symbols_without_space',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='text',
            name='num_words',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='text',
            name='semantic_logistic_regression',
            field=models.TextField(default='', max_length=20),
        ),
        migrations.AddField(
            model_name='text',
            name='semantic_native_bayes',
            field=models.TextField(default='', max_length=20),
        ),
        migrations.AddField(
            model_name='text',
            name='semantic_sgd',
            field=models.TextField(default='', max_length=20),
        ),
        migrations.AddField(
            model_name='text',
            name='sentiment_logistic_regression_pred',
            field=models.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name='text',
            name='stop_words',
            field=models.JSONField(default=dict),
        ),
        migrations.AlterField(
            model_name='text',
            name='text',
            field=models.TextField(default='', max_length=500),
        ),
    ]
