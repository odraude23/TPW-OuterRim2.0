from rest_framework import serializers
from django.contrib.auth.models import User as AuthUser
from app.models import User, Product,Favorite, Follower,Cart,Comment,Message,Order

class AuthUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "password")

class UserSerializer(serializers.ModelSerializer):
    class Meta: 
        model = User
        fields = ['id', 'username', 'name', 'get_image', 'description', 'sold', 'admin', 'email']


class ProductSerializer(serializers.ModelSerializer):
    user = UserSerializer() 

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'image', 'user', 'seen', 
            'brand', 'category', 'color', 'sold'
        ]

class ProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['name', 'description', 'price', 'brand', 'category', 'color', 'image', 'user', 'seen', 'sold']
        extra_kwargs = {
            'seen': {'required': False},
            'sold': {'required': False},
        }

    def create(self, validated_data):
        validated_data['seen'] = validated_data.get('seen', 0)
        validated_data['sold'] = validated_data.get('sold', False)
        return super().create(validated_data)

class FavoriteSerializer(serializers.ModelSerializer):
    user = UserSerializer()  
    product = ProductSerializer() 

    class Meta:
        model = Favorite
        fields = ['id', 'user', 'product']

class FollowerSerializer(serializers.ModelSerializer):
    user = UserSerializer() 
    follower = UserSerializer()  

    class Meta:
        model = Follower
        fields = ['id', 'user', 'follower']

class CartSerializer(serializers.ModelSerializer):
    user = UserSerializer()  
    product = ProductSerializer()  

    class Meta:
        model = Cart
        fields = ['id', 'user', 'product']

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer()  
    seller = UserSerializer() 

    class Meta:
        model = Comment
        fields = ['id', 'text', 'rating', 'user', 'seller']

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer()  
    receiver = UserSerializer()  

    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'text', 'created_at']

class OrderSerializer(serializers.ModelSerializer):
    user = UserSerializer()  
    products = ProductSerializer(many=True)  

    class Meta:
        model = Order
        fields = ['id', 'user', 'products', 'date']
