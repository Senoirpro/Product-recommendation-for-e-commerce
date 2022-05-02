from dataclasses import field
from decimal import Decimal
from pyexpat import model
from turtle import title
from store.models import Product, Collection
from rest_framework import serializers

class CollectionSerializer(serializers.ModelSerializer):
    # id = serializers.IntegerField()
    # title = serializers.CharField(max_length=255)
    class Meta:
        model= Collection
        fields = ['id', 'title', 'products_count']
    
    products_count = serializers.IntegerField()

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'title', 'description', 'slug', 'inventory', 'unit_price', 'price_with_tax', 'collection']
        # fields = '__all__' not use may be senitivty

    # # only insenitive fields
    # id = serializers.IntegerField()
    # title = serializers.CharField(max_length=255)
    # price = serializers.DecimalField(
    #     max_digits=6, 
    #     decimal_places=2,
    #     source='unit_price'
    # )
    price_with_tax = serializers.SerializerMethodField(method_name='calculate_tax')
    # collection = serializers.HyperlinkedRelatedField(
    #     queryset=Collection.objects.all(),
    #     view_name= 'collection_detail'
    # )
    

    def calculate_tax(self, product:Product):
        return product.unit_price * Decimal(1.1)

    # def validate(self, data):
    #     if data['password'] != data['confirm_password']:
    #         return serializers.validationError('Passwords don\'t match')
    #     return data

    def create(self, validated_data):
        product = Product(**validated_data)
        product.order = 1
        product.save()
        return product

    # to overwrite update 
    # def update(self, instance, validated_data):
    #     instance.unit_price = validated_data.get('unit_price')
    #     instance.save()
    #     return instance
