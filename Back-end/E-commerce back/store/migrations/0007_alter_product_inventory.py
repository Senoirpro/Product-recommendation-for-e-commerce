# Generated by Django 4.0.3 on 2022-04-30 12:42

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0006_alter_product_description_alter_product_promotions_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='inventory',
            field=models.IntegerField(validators=[django.core.validators.MinValueValidator(0)]),
        ),
    ]
