from django.core.validators import MinValueValidator
from django.db import models
from django.forms import fields


# Create your models here.
class Collection(models.Model):
    title = models.CharField(max_length=255)
    featured_products = models.ForeignKey(
        'Product', on_delete=models.SET_NULL, null=True, related_name='+')
    
    def __str__(self) -> str:
        return self.title
    
    
    class Meta:
        ordering = ['title']

    # product = models.ForeignKey(Product, on_delete=CASCADE)
    # this should be defined in product class


class Product(models.Model):
    # model field types
    # id created automatically created by django
    title = models.CharField(max_length=255)
    slug = models.SlugField(default='_')
    description = models.TextField(null=True, blank=True)
    # let say max price is 9999.99
    unit_price = models.DecimalField(
        max_digits=6, 
        decimal_places=2,
        validators=[MinValueValidator(1)])
    inventory = models.IntegerField(validators=[MinValueValidator(0)])
    last_update = models.DateTimeField(auto_now=True)
    collection = models.ForeignKey(Collection, on_delete=models.PROTECT, related_name='products')
    # if collection deleted but not product
    promotions = models.ManyToManyField('Promotion', blank=True)

    def __str__(self) -> str:
        return self.title

    
    class Meta:
        ordering = ['title']


class Customer(models.Model):
    MEMBERSHIP_BRONZE = 'B'
    MEMBERSHIP_SILVER = 'S'
    MEMBERSHIP_GOLD = 'G'

    MEMBERSHIP_CHOICES = [
        (MEMBERSHIP_BRONZE, 'Bronze'),
        (MEMBERSHIP_SILVER, 'Silver'),
        (MEMBERSHIP_GOLD, 'Gold')
    ]

    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=255)
    birth_date = models.DateField(null=True)
    membership = models.CharField(
        max_length=1, choices=MEMBERSHIP_CHOICES, default=MEMBERSHIP_BRONZE)


    def __str__(self):
        return f'{self.first_name} {self.last_name}' 

    class Meta:
        ordering = ['first_name', 'last_name']

    # class Meta:
    #     db_table = 'store_list_customer'
    #     indexes = [
    #         models.Index(fields=['last_name', 'first_name'])
    #     ]



class Order(models.Model):
    PAYMENT_STATUS_PENDING = 'P'
    PAYMENT_STATUS_COMPLETE = 'C'
    PAYMENT_STATUS_FAILED = 'F'

    PAYMENT_STATUS_CHOICES = [
        (PAYMENT_STATUS_PENDING, 'pending'),
        (PAYMENT_STATUS_COMPLETE, 'complete'),
        (PAYMENT_STATUS_FAILED, 'failed')
    ]

    placed_at = models.DateTimeField(auto_now_add=True)
    payment_status = models.CharField(max_length=1, choices=PAYMENT_STATUS_CHOICES, default=PAYMENT_STATUS_PENDING)
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.PROTECT)
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name='orderitems')
    quantity = models.PositiveSmallIntegerField()
    unit_price = models.DecimalField(max_digits=6, decimal_places=2)
    # price defined again because the price should change over time


class Address(models.Model):
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    # customer = models.OneToOneRel(Customer, on_delete=models.CASCADE, primary_key=True)
    # because we don't want to create id for address that cause many to many relation
    # if it has many-to-many relation
    customer = models.ForeignKey(
        Customer, on_delete=models.CASCADE)
    zip = models.PositiveSmallIntegerField(default=1000)


class Cart(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveSmallIntegerField()


# Many To Many

class Promotion(models.Model):
    description = models.CharField(max_length=255)
    discount = models.FloatField()
    
    # models.ManyToManyField

    # circular dependency
    # product and collection

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    name = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateField(auto_now_add=True)
    