from django.db.models.aggregates import Count
from django.contrib import admin, messages
from django.urls import reverse
from django.utils.html import format_html, urlencode
from . import models

class InventoryFilter(admin.SimpleListFilter):
    title = 'inventory'
    parameter_name = 'inventory'

    def lookups(self, request, model_admin):
        return [
            ('<10', 'LOW')   
        ]
    def queryset(self, request, queryset):
        # we write filtering logic here
        if self.value() == '<10':
            return queryset.filter(inventory__lt=10)
         
# class TagInline(GenericTabularInline):
#     autocomplete_fields = ['tags']
#     model = TaggedItem


@admin.register(models.Product)
class ProductAdmin(admin.ModelAdmin):
    # fields = ['title', 'slug']
    # readonly_fields = ['title']

    autocomplete_fields =['collection']
    actions = ['clear_inventory']
    # inlines = [TagInline]
    search_fields = ['title']
    prepopulated_fields = {
        'slug': ['title'],
    }
    
    list_display = ['title', 'unit_price', 'inventory_status', 'collection_title']
 
    #     prepopulated_fields = {
    #     'price': ['starting_price'],
    # }
    list_editable = ['unit_price']
    list_filter = ['collection', 'last_update', InventoryFilter]
    list_per_page = 10
    list_select_related = ['collection']

    def collection_title(self, product):
        return product.collection.title


    @admin.display(ordering='inventory')
    def inventory_status(self, product):
        if product.inventory < 10:
            return 'Low'
        return 'OK'
    
    # custom action
    @admin.action(description='Clear inventory')
    def clear_inventory(self, request, queryset):
        updated_count = queryset.update(inventory=0)
        queryset.update(inventory=0)
        self.message_user(
            request,
            f'{updated_count} products were successfully updated.',
            # messages.ERROR
            messages.ERROR
        )



@admin.register(models.Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = ['title', 'product_count']
    search_fields = ['title']
    
    @admin.display(ordering='product_count')
    def product_count(self, collection):
       url = (
           reverse('admin:store_product_changelist') 
           + '?'
           + urlencode({
               'collection__id': str(collection.id)
           }))

       return format_html('<a href="{}">{}</a>', url, collection.product_count)
    #    return collection.product_count
        
    
    def get_queryset(self, request):
        return super().get_queryset(request).annotate(
            product_count=Count('products')
        )

    
# admin.site.register(models.Collection)
# admin.site.register(models.Product, ProductAdmin)
@admin.register(models.Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'membership']
    list_editable = ['membership']
    ordering = ['first_name', 'last_name']
    search_fields = ['first_name__istartswith', 'last_name__istartswith']
    list_per_page = 10
    

    # def order_list(self, orderitem):
    #     return orderitem.order
class OrderItemInline(admin.TabularInline):
    autocomplete_fields = ['product']
    model = models.OrderItem
    


@admin.register(models.Order)
class OrderAdmin(admin.ModelAdmin):
    
    autocomplete_fields = ['customer']
    inlines =[OrderItemInline]
    list_display = ['id', 'placed_at', 'customer']
    
    
    # list_select_related = ['customer', 'orderitem']


    # def order_list(self, orderitem):
    #     return orderitem.order
    