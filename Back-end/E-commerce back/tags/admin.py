from atexit import register
from django.contrib import admin
from .models import Tag  

# admin.site.register(Tag)
@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    serach_fields = ['label']



# @admin.register(Tag)
# class TagAdmin(admin.ModelAdmin):
#     search_fields = ['label']