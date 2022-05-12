from posixpath import basename
from django.urls import path
from rest_framework_nested import routers
from . import views


router = routers.DefaultRouter()
# router = SimpleRouter()
router.register('products', views.ProductViewSet, basename='products')
router.register('collections', views.CollectionViewSet)

products_router = routers.NestedDefaultRouter(router, 'products', lookup='product')
products_router.register('reviews', views.ReviewViewSet, basename='product-reviews')


urlpatterns = router.urls + products_router.urls 

# from rest_framework_nested import routers



# router.register('products', views.ProductViewSet, basename='products')
# router.register('collections', views.CollectionViewSet)

# products_router = routers.NestedDefaultRouter(router, 'products', lookup='product')
# products_router.register('reviews', views.ReviewViewSet, basename='product-reviews')

# # URLConf
# urlpatterns = router.urls + products_router.urls