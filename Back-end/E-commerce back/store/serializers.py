from dataclasses import field, fields
from decimal import Decimal
from unicodedata import name
from django.db import transaction
from store.models import Cart, CartItem, Customer, Order, OrderItem, Product, Collection, ProductImage, Recommend, Review
from .signals import order_created
from rest_framework import serializers
from store.trained_model import RecommendationList

class CollectionSerializer(serializers.ModelSerializer):
    # id = serializers.IntegerField()
    # title = serializers.CharField(max_length=255)
    class Meta:
        model= Collection
        fields = ['id', 'title', 'products_count']
    
    products_count = serializers.IntegerField(read_only=True)


class ProductImageSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        product_id = self.context['product_id']
        return ProductImage.objects.create(product_id=product_id, **validated_data)

    class Meta:
        model = ProductImage
        fields = ['id', 'image']


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    class Meta:
        model = Product
        fields = ['id', 'title', 'description', 'slug', 'inventory', 'unit_price', 'price_with_tax', 'collection', 'images']
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

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'date', 'name', 'description']
    
    def create(self, validated_data):
        product_id = self.context['product_id']
        return Review.objects.create(product_id=product_id, **validated_data)


class RecommendSerializer(serializers.ModelSerializer):
    product_recommended = serializers.SerializerMethodField()
    # pro_name = serializers.CharField(source='product.title')
    # days_since_joined = serializers.SerializerMethodField()
    # print(pro_name.to_internal_value('title'))
    # i = pro_name.get_value['title']
    # print(i)

    class Meta:
        model = Recommend
        fields = [ 'id', 'product_recommended']
    
    def create(self, validated_data):
        product_id = self.context['product_id']
        return Recommend.objects.create(product_id=product_id, **validated_data)
    


    def get_product_recommended(self, obj):
        i = (obj.product).collection
        print(i)
        # obj.
        # print(RecommendationList.Recommend[0:10])
        # le = ['accessories.umbrella',
        #      'apparel.belt',
        #      'apparel.dress',
        #      'apparel.jeans',
        #      'apparel.scarf',
        #      ]
        # le = list(RecommendationList.Recommend[0:10])

        l = list(RecommendationList.Recom('apparel.belt'))
        # print(list(RecommendationList.Recom('apparel.belt')))
        # print(RecommendSerializer.pro_name.get_value)
        # RecommendSerializer.pro_name.get_value['']
        # RecommendSerializer.get_field_names['pro_name']
        # RecommendSerializer.pro_name.field_name['']
        
        # print(pro_name)
        def Convert(lst):
            res_dct = {lst[i]: lst[i + 1] for i in range(0, len(lst), 2)}
            return res_dct
        # print(Convert(le))

        # for i in le:
        #     # x = le.split('.')
        #     return(le)
        
        for i in l:
            # x = le.split('.')
            return(l)



class SimpleProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'title', 'unit_price']

class CartItemSerializer(serializers.ModelSerializer):
    product = SimpleProductSerializer()
    total_price = serializers.SerializerMethodField()

    def get_total_price(self, cart_item: CartItem):
        return cart_item.quantity * cart_item.product.unit_price

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'total_price']

class CartSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    def get_total_price(self, cart):
        return sum([item.quantity * item.product.unit_price for item in cart.items.all()])

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_price']


class AddCartItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField()

    def validate_product_id(self, value):
        if not Product.objects.filter(pk=value).exists():
            raise serializers.ValidationError(
                'No product with the given ID was found.')
        return value

    def save(self, **kwargs):
        cart_id = self.context['cart_id']
        product_id = self.validated_data['product_id']
        quantity = self.validated_data['quantity']

        try:
            cart_item = CartItem.objects.get(
                cart_id=cart_id, product_id=product_id)
            cart_item.quantity += quantity
            cart_item.save()
            self.instance = cart_item
        except CartItem.DoesNotExist:
            self.instance = CartItem.objects.create(
                cart_id=cart_id, **self.validated_data)

        return self.instance

    class Meta:
        model = CartItem
        fields = ['id', 'product_id', 'quantity']

class UpdateCartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['quantity']

class CustomerSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Customer
        fields = ['id', 'user_id', 'phone', 'birth_date', 'membership'] 


class OrderItemSerializer(serializers.ModelSerializer):
    product = SimpleProductSerializer()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'unit_price', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'customer', 'placed_at', 'payment_status', 'items']

class UpdateOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['payment_status']

class CreateOrderSerializer(serializers.Serializer):
    cart_id = serializers.UUIDField()

    def validate_cart_id(self, cart_id):
        if not Cart.objects.filter(pk=cart_id).exists():
            raise serializers.ValidationError(
                'No cart with the given ID was found.')
        if CartItem.objects.filter(cart_id=cart_id).count() == 0:
            raise serializers.ValidationError('The cart is empty.')
        return cart_id


    def save(self, **kwargs):
        with transaction.atomic():
            cart_id = self.validated_data['cart_id']

            customer = Customer.objects.get(
                user_id=self.context['user_id'])
            order = Order.objects.create(customer=customer)

            cart_items = CartItem.objects \
                .select_related('product') \
                .filter(cart_id=cart_id)
            order_items = [
                OrderItem(
                    order=order,
                    product=item.product,
                    unit_price=item.product.unit_price,
                    quantity=item.quantity
                ) for item in cart_items
            ]
            OrderItem.objects.bulk_create(order_items)

            Cart.objects.filter(pk=cart_id).delete()

            order_created.send_robust(self.__class__, order=order)

            return order