from genericpath import exists
from multiprocessing.sharedctypes import Value
from django.shortcuts import render
from django.db.models import Q, F, Func, Count
from django.db.models.functions import Concat


# from django.core.exceptions import ObjectDoesNotExist
from store.models import Customer, Product
from store.models import Order


def say_hello(request):
    #  return HttpResponse('Hello')
    # print(debug_toolbar.VERSION)    
    query_set = Product.objects.all()
   
    # for product in query_set:
    #     print(product)
        # or
    # list(query_set)
    # # or
    # query_set[0:4] 
    # query_set.filter()#this return a new query_set
    # or query_set.filter().filter().order_by() for complex query_set 
    # query_set.count()
    # retriving object the 1st one is query_set
    
    # exists = Product.objects.filter(pk=0).exists()
    # query_set = Product.objects.filter(unit_price=20)
    
    # complex lookups 
    # for example when we want buy Products: inventory < 10 and price < 20
    # query_set = Product.objects.filter(Q(inventory__lt=10) | Q(unit_price__lt=20))
   
    # query_set = Product.objects.filter(inventory=F('unit_price'))
    # from django.db.models.aggregates import Count, Max, Min

    # query_set = Customer.objects.annotate(
    #     # CONCAT
    #     full_name=Func(F('first_name'), Value(' '), 
    #                     F('last_name'), function='CONCAT')

    # )
    query_set = Product.objects.annotate(
       discount_price=F('unit_price') * 0.8

    )
    return render(request, 'index.html',  {'name':''})



    