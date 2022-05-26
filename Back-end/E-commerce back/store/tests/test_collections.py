from store.models import Collection, Product
from django.contrib.auth.models import User
from rest_framework import status
import pytest
from model_bakery import baker

@pytest.fixture
def create_collection(api_client):
    def do_create_collection(collection):
        return api_client.post('/store/collections/', collection)
    return do_create_collection

@pytest.mark.django_db
class TestCreateCollection:
	# @pytest.mark.skip
	def test_if_user_is_anonymous_returns_401(self, create_collection):
		# every test should have AAA(arragne, act, assert)
		# arr prepare the system for test, we put an object we put initail in db and so on 
		# in this case empty
		# act the behavoiur we wanaa test mean send request to the server
		# 

		# client = APIClient()
		# client.post
		response = create_collection({'title': 'a'})
		# response = api_client.post('/store/collections/', {'title': 'a'})
		
		# we check if the insertion works or not

		assert response.status_code == status.HTTP_401_UNAUTHORIZED


	def test_if_user_is_not_admin_returns_403(self, authenticate, create_collection):
		authenticate()
		# api_client.force_authenticate(user={})
		response = create_collection({'title': 'a'})
		# response = api_client.post('/store/collections/', {'title': 'a'})

		assert response.status_code == status.HTTP_403_FORBIDDEN


	def test_if_data_is_invalid_returns_400(self, authenticate, create_collection):
		authenticate(is_staff=True)
		# api_client.force_authenticate(user=User(is_staff=True))
		response = create_collection({'title': ''})
		# response = api_client.post('/store/collections/', {'title': ''})

		assert response.status_code == status.HTTP_400_BAD_REQUEST
		assert response.data['title'] is not None

		
	def test_if_data_is_valid_returns_201(self, authenticate, create_collection):
		# api_client = APIClient()
		authenticate(is_staff=True)
		response = create_collection({'title': 'a'})
		# response = api_client.post('/store/collections/',{'title': 'a'})
		
		assert response.status_code == status.HTTP_201_CREATED
		assert response.data['id'] > 0

@pytest.mark.django_db
class TestRetrieveCollection:
	def test_if_collection_exists_returns_200(self, api_client):
		# Collection.objects.create(title='a')
		collection = baker.make(Collection)
		
		response = api_client.get(f'/store/collections/{collection.id}/')
		
		assert response.status_code == status.HTTP_200_OK
		assert response.data == {
            'id': collection.id,
            'title': collection.title,
            'products_count': 0
        }
