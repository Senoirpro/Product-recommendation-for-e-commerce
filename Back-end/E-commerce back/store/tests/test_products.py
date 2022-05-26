from store.models import Product
from django.contrib.auth.models import User
from rest_framework import status
import pytest
from model_bakery import baker

@pytest.fixture
def create_product(api_client):
    def do_create_product(product):
        return api_client.post('/store/products/', product)
    return do_create_product

@pytest.mark.django_db
class TestCreatePproduct:
	# @pytest.mark.skip
	def test_if_user_is_anonymous_returns_401(self, create_product):

		response = create_product({'title': 'a'})

		assert response.status_code == status.HTTP_401_UNAUTHORIZED


	def test_if_user_is_not_admin_returns_403(self, authenticate, create_product):
		authenticate()
		response = create_product({'title': 'a'})

		assert response.status_code == status.HTTP_403_FORBIDDEN


	def test_if_data_is_invalid_returns_400(self, authenticate, create_product):
		authenticate(is_staff=True)
		response = create_product({'title': ''})

		assert response.status_code == status.HTTP_400_BAD_REQUEST
		assert response.data['title'] is not None


# @pytest.mark.django_db
# class TestRetrieveProduct:
# 	def test_if_product_exists_returns_200(self, api_client):
# 		product = baker.make(Product)
		
# 		response = api_client.get(f'/store/products/{product.id}/')
		
# 		assert response.status_code == status.HTTP_200_OK
# 		assert response.data == {
#             'id': product.id,
#             'title': product.title,
#             'slug': product.slug, 
#             'description': product.description, 
#             'unit_price': product.unit_price, 
#             'inventory': product.inventory,
#             # 'collection': 3,
#             # 'images': [],
#             # 'price_with_tax': Decimal('486.7720000000000393036714286')
#             # 'last_update': product.last_update, 
#             'collection': product.collection, 
#             'images': 'https://images.sftcdn.net/images/t_app-logo-xl,f_auto,dpr_2/p/befbcde0-9b36-11e6-95b9-00163ed833e7/2715452902/the-test-fun-for-friends-logo.png',
#             'price_with_tax': '96.371000000000007781331134'
#             # 'price_with_tax': product.price_with_tax, 
#         }
