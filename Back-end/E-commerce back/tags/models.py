from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.forms import fields


class Tag(models.Model):
    label = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.label


class TaggedItem(models.Model):
    # what tag applied to what object
    # one way is that 
    # from store_list.models import Product
    # product = models.ForeignKey(Product, on_delete=models.CASCADE)

    # type (product, video, article)
    # id
    # content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    # object_id = models.PositiveSmallIntegerField()
    # content_object = GenericForeignKey()
    # objects = TaggedItemManager()
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE, default='')
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey()