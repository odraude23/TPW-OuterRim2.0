from django.shortcuts import get_object_or_404, render, redirect
from datetime import datetime
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from app.models import *
from django.db.models import Q
from django.contrib import messages
from app.forms import *
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth.hashers import check_password
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

# New imports for Django REST Framework
import json
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User as AuthUser
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication

from app.serializers import UserSerializer, AuthUserSerializer
from app.serializers import ProductSerializer, CommentSerializer, FollowerSerializer, CartSerializer, MessageSerializer, OrderSerializer
from app.serializers import ProductCreateSerializer

import base64
import os
import uuid
from django.conf import settings

#================================================================================================
# New views

@api_view(["POST"])
def login(request):
    user = get_object_or_404(User, username=request.data["username"])

    if not user.check_password(request.data["password"]):
        return Response(status=status.HTTP_400_BAD_REQUEST)

    token, created = Token.objects.get_or_create(user=user)
    user = User.objects.get(username=user.username)
    user_serielized = UserSerializer(user)
    return Response({"token": token.key, "user": user_serielized.data})

@api_view(["POST"])
def registerRest(request):
    try:
        data = json.loads(request.body)
        username = data["username"]
        password = data["password"]
        email = data["email"]
        name = data["name"]
        user = User.objects.create_user(username=username, password=password, email=email, name=name)
        user.image = "/profile_images/default_profile.png"
        user.save()

        user_serielized = UserSerializer(user)
        serilizer = AuthUserSerializer(user)
        print(serilizer.data)

        token = Token.objects.create(user=user)
        return Response({"token": token.key, "user": user_serielized.data})
        
    except User.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
def product_list(request):
    products = Product.objects.filter(sold=False)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_user(request):
    username = request.user.username

    try:
        user = User.objects.get(username=username)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["GET"])
def get_users(request):
    try:
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
    except User.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["GET"])
def get_user_comments(request, id):
    try:
        comments = Comment.objects.filter(seller_id=id)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)
    
    except Comment.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["GET"])
def get_my_products(request, id):
    try:
        # Get all products by the logged-in user
        products = Product.objects.filter(user_id=id)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    
    except Product.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_following_products(request, id):
    try:
        followed_users = Follower.objects.filter(follower_id=id)
        followed_user_ids = [follower.user.id for follower in followed_users]
        products = Product.objects.filter(user_id__in=followed_user_ids)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    
    except Product.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_product_details(request, id):
    try:
        product = Product.objects.get(id=id)
        product.seen += 1
        product.save()
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_user_followers(request, id):
    try:
        followers = Follower.objects.filter(user_id=id)
        serializer = FollowerSerializer(followers, many=True)
        return Response(serializer.data)
    
    except Follower.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["GET"])
def get_user_following(request, id):
    try:
        following = Follower.objects.filter(follower_id=id)
        serializer = FollowerSerializer(following, many=True)
        return Response(serializer.data)
    
    except Follower.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["GET"])
def get_user_by_username(request, username):
    try:
        user = User.objects.get(username=username)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    except User.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["POST"])
def add_comment(request):
    try:
        data = json.loads(request.body)
        text = data["text"]
        rating = data["rating"]
        user = User.objects.get(id=data["user"])
        seller = User.objects.get(id=data["seller"])
        comment = Comment.objects.create(text=text, rating=rating, user=user, seller=seller)
        comment.save()
        serializer = CommentSerializer(comment)
        return Response(serializer.data)
    
    except User.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["POST"])
def follow_user(request, id):
    try:
        follower_id = request.data["follower"]
        follower = User.objects.get(id=follower_id)
        user = User.objects.get(id=id)

        follow = Follower.objects.create(user=user, follower=follower)
        follow.save()
        
        return Response(status=status.HTTP_201_CREATED)
    
    except User.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    except Follower.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["POST"])
def unfollow_user(request, id):
    try:
        follower_id = request.data["follower"]
        follower = User.objects.get(id=follower_id)
        user = User.objects.get(id=id)

        follow = Follower.objects.get(user=user, follower=follower)
        follow.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
    
    except User.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    except Follower.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["DELETE"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_user(request, id):
    try:
        user = User.objects.get(id=id)
        user_products = Product.objects.filter(user=user)

        for product in user_products:
            product.delete()
        
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    except User.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["PUT"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_user(request, id):
    try:
        data = json.loads(request.body)
        user = User.objects.get(id=id)
        user.username = data["username"]
        user.name = data["name"]
        user.email = data["email"]
        user.description = data["description"]
        user.set_password(data["password"])
        user.save()

        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    except User.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(["PUT"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_profile_pic(request, id):
    try:
        data = json.loads(request.body)
        user = User.objects.get(id=id)
        image_base64 = data["image"]
        image = image_base64_to_profile_pic(image_base64)
        user.image = image
        user.save()

        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    except User.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["PUT"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_profile(request, id):
    try:
        data = json.loads(request.body)
        user = User.objects.get(id=id)
        user.username = data["username"]
        user.name = data["name"]
        user.email = data["email"]
        user.description = data["description"]
        user.save()

        serializer = UserSerializer(user) 
        return Response(serializer.data)
    
    except User.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def toggle_favorite(request):
    user_id = request.data.get('user_id')
    product_id = request.data.get('product_id')

    try:
        user = User.objects.get(id=user_id)
        product = Product.objects.get(id=product_id)
    except (User.DoesNotExist, Product.DoesNotExist):
        return Response({"error": "User or Product not found"}, status=status.HTTP_404_NOT_FOUND)

    # Toggle favorite
    favorite, created = Favorite.objects.get_or_create(user=user, product=product)
    if not created:
        favorite.delete()
        is_favorite = False
    else:
        is_favorite = True

    return Response({"is_favorite": is_favorite}, status=status.HTTP_200_OK)

@api_view(['GET'])
def is_favorite(request, product_id, user_id):
    try:
        user = User.objects.get(id=user_id)
        product = Product.objects.get(id=product_id)
    except (User.DoesNotExist, Product.DoesNotExist):
        return Response({"error": "User or Product not found"}, status=status.HTTP_404_NOT_FOUND)

    is_favorite = Favorite.objects.filter(user=user, product=product).exists()
    return Response({"is_favorite": is_favorite}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)

        product.delete()
        return Response({'success': 'Product deleted successfully'}, status=status.HTTP_200_OK)

    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
def get_user_favorites(request, user_id):
    try:
        favorites = Favorite.objects.filter(user_id=user_id)
        products = [favorite.product for favorite in favorites if favorite.product.user.id != user_id]
        
        # Serialize the products and return them
        product_data = ProductSerializer(products, many=True).data
        return Response(product_data, status=status.HTTP_200_OK)
    except Favorite.DoesNotExist:
        return Response({'error': 'No favorites found for this user'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['PUT'])
def update_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductSerializer(product, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_product_image(request, product_id):
    try:
        data = json.loads(request.body)
        image_base64 = data.get("image")
        if not image_base64:
            return Response({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)
        product = Product.objects.get(id=product_id)
        image_path = image_base64_to_product_pic(image_base64)
        if image_path is None:
            return Response({"error": "Failed to process the image"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        product.image = image_path
        product.save()
        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
    except json.JSONDecodeError:
        return Response({"error": "Invalid JSON data"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": "An unexpected error occurred", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_comments(request):
    comments = Comment.objects.all()
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_comment(request, id):
    try:
        comment = Comment.objects.get(id=id)
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    except Comment.DoesNotExist:
        return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_cart(request, id):
    try:
        user = User.objects.get(id=id)
        cart = Cart.objects.filter(user=user)
        cart_products = [cart_item.product for cart_item in cart]
        
        return Response(ProductSerializer(cart_products, many=True).data)
    
    except User.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    except Cart.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    try:
        data = json.loads(request.body)
        user = User.objects.get(id=data["user"])
        product = Product.objects.get(id=data["product"])
        cart = Cart.objects.create(user=user, product=product)
        cart.save()
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    
    except User.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    except Product.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    except Cart.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def remove_from_cart(request):
    try:
        data = json.loads(request.body)
        user = User.objects.get(id=data["user"])
        product = Product.objects.get(id=data["product"])
        cart = Cart.objects.get(user=user, product=product)
        cart.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
    
    except User.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    except Product.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    except Cart.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
def update_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductSerializer(product, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_product_image(request, product_id):
    try:
        data = json.loads(request.body)
        image_base64 = data.get("image")
        if not image_base64:
            return Response({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)
        product = Product.objects.get(id=product_id)
        image_path = image_base64_to_product_pic(image_base64)
        if image_path is None:
            return Response({"error": "Failed to process the image"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        product.image = image_path
        product.save()
        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
    except json.JSONDecodeError:
        return Response({"error": "Invalid JSON data"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": "An unexpected error occurred", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def add_product(request):
    data = request.data
    image_base64 = data.get("image")
    puser = json.loads(data.get("user"))
    puserid = puser["id"]

    try:
        
        image_path = image_base64_to_product_pic(image_base64) if image_base64 else None
        product = Product.objects.create(
            user=User.objects.get(id=puserid),
            name=data["name"],
            description=data["description"],
            price=data["price"],
            brand=data["brand"],
            category=data["category"],
            color=data["color"],
            image=image_path,
            seen = 0,
            sold = False
        )

        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        print(e)
        return Response({"error": "An unexpected error occurred", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def order_product(request):
    try:
        data = json.loads(request.body)
        user = User.objects.get(id=data["user"])
        products = data["products"]

        prod = []
        for product in products:
            product = Product.objects.get(id=product["id"])
            
            user2 = User.objects.get(id=product.user.id)
            user2.sold += 1
            user2.save()

            product.sold = True
            product.save()
            prod.append(product)

            if Cart.objects.filter(user=user, product=product).exists():
                cart = Cart.objects.get(user=user, product=product)
                cart.delete()

            if Favorite.objects.filter(user=user, product=product).exists():
                favorites = Favorite.objects.get(user=user, product=product)
                favorites.delete()

            seller = product.user
            message_text = f"{user.username} just bought your {product.name}."

            Message.objects.create(
                sender=user, receiver=seller, text=message_text
            )

        order = Order.objects.create(user=user)
        order.products.set(prod)
        order.save()

        serializer = OrderSerializer(order)

        return Response(serializer.data)
    
    except User.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    except Product.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_orders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_user_order(request, id):
    try:
        user = User.objects.get(id=id)
        orders = Order.objects.filter(user=user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    
    except User.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    except Order.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def get_messages(request, user_id):
    try:
        messages = Message.objects.filter(
            Q(sender_id=user_id) | Q(receiver_id=user_id)
        ).select_related('sender', 'receiver').order_by('created_at')

        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def add_message(request):
    data = request.data
    try:
        sender = User.objects.get(id=data['sender'])
        receiver = User.objects.get(id=data['receiver'])
        text = data['text']

        message = Message.objects.create(sender=sender, receiver=receiver, text=text)
        serializer = MessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except User.DoesNotExist:
        return Response({"error": "Sender or Receiver not found"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def recommended_products(request):
    category = request.data.get('category')
    user_id = request.data.get('user_id')
    exclude_product_id = request.data.get('exclude_product_id')

    if not category or not user_id or not exclude_product_id:
        return Response({"error": "Missing required parameters"}, status=400)

    products = Product.objects.filter(
        category=category
    ).exclude(
        id=exclude_product_id
    ).exclude(
        user_id=user_id
    )

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

#aux function
def image_base64_to_profile_pic(image_base64):
    try:
        if "data:image" in image_base64:
            header, base64_string = image_base64.split(',', 1)
        image = base64.b64decode(base64_string)

        file_name = f"profile_images/{uuid.uuid4()}.png"
        file_path = os.path.join(settings.MEDIA_ROOT, file_name)

        with open(file_path, 'wb') as f:
            f.write(image)

        return file_name
    
    except Exception as e:
        print(e)
    return None

def image_base64_to_product_pic(image_base64):
    try:
        if "data:image" in image_base64:
            header, base64_string = image_base64.split(',', 1)
        image = base64.b64decode(base64_string)

        file_name = f"product_images/{uuid.uuid4()}.png"
        file_path = os.path.join(settings.MEDIA_ROOT, file_name)

        with open(file_path, 'wb') as f:
            f.write(image)

        return file_name
    
    except Exception as e:
        print(e)
    return None

#================================================================================================
# Old views

def index(request):

    categories = Product.objects.values_list("category", flat=True).distinct()

    form = ProductFilterForm(request.GET or None, categories=categories)

    products = Product.objects.all()
    if form.is_valid():
        query = form.cleaned_data["search"]
        category = form.cleaned_data["category"]
        min_price = form.cleaned_data["min_price"]
        max_price = form.cleaned_data["max_price"]

        if query:
            products = products.filter(name__icontains=query)
        if category:
            products = products.filter(category=category)
        if min_price is not None:
            products = products.filter(price__gte=min_price)
        if max_price is not None:
            products = products.filter(price__lte=max_price)

    context = {
        "products": products,
        "form": form,
        "user": request.user,
    }

    if request.user.is_authenticated:
        user_favorites = Favorite.objects.filter(user=request.user).values_list(
            "product_id", flat=True
        )
        context["favorite_products"] = list(user_favorites)

        if request.method == "POST":
            product_id = request.POST.get("product_id")
            product = Product.objects.get(id=product_id)
            favorite, created = Favorite.objects.get_or_create(
                user=request.user, product=product
            )
            if created:
                favorite.save()
            else:
                favorite.delete()
            return redirect("index")
    else:
        context["favorite_products"] = []

    return render(request, "index.html", context)


@login_required
def favorites(request):

    user = request.user

    if request.method == "POST":
        product_id = request.POST.get("product_id")
        if product_id:

            Favorite.objects.filter(user=user, product_id=product_id).delete()

            return redirect("favorites")

    favorite_products_ids = Favorite.objects.filter(user=user).values_list(
        "product_id", flat=True
    )
    favorite_products = Product.objects.filter(id__in=favorite_products_ids)

    categories = Product.objects.values_list("category", flat=True).distinct()

    context = {
        "products": favorite_products,
        "categories": categories,
        "user": user,
    }

    return render(request, "favorites.html", context)


def register(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)

        if form.is_valid():
            if User.objects.filter(username=form.cleaned_data["username"]).exists():
                return render(
                    request,
                    "register.html",
                    {"form": form, "error": "Username already taken"},
                )

            form.save()

            username = form.cleaned_data.get("username")
            password = form.cleaned_data.get("password1")

            user = authenticate(username=username, password=password)
            if user is not None:
                auth_login(request, user)

            return redirect("index")

        else:

            return render(
                request, "register.html", {"form": form, "error": "Invalid form input"}
            )

    else:

        form = RegisterForm()
        return render(request, "register.html", {"form": form, "error": False})


@login_required
def product_details(request, product_id):

    product = Product.objects.get(id=product_id)
    product.seen += 1
    product.save()

    is_in_cart = Cart.objects.filter(user=request.user, product=product).exists()
    is_in_favorites = Favorite.objects.filter(
        user=request.user, product=product
    ).exists()

    if request.method == "POST":
        if "product_id" in request.POST:

            Cart.objects.get_or_create(user=request.user, product=product)

            return redirect("product_details", product_id=product_id)

        elif "message" in request.POST:

            message_text = request.POST.get("message")
            formatted_text = f"{request.user.username} is messaging you about {product.name}: {message_text}"

            Message.objects.create(
                sender=request.user, receiver=product.user, text=formatted_text
            )

        elif "favorite" in request.POST:
            if Favorite.objects.filter(user=request.user, product=product).exists():
                Favorite.objects.filter(user=request.user, product=product).delete()

            else:
                Favorite.objects.create(user=request.user, product=product)

    context = {
        "product": product,
        "is_in_cart": is_in_cart,
        "is_in_favorites": is_in_favorites,
    }
    return render(request, "product_details.html", context)


@login_required
def cart(request):

    cart_items = Cart.objects.filter(user=request.user)
    products = [item.product for item in cart_items]

    total_value = sum(product.price for product in products)

    if request.method == "POST":

        product_id = request.POST.get("product_id")
        Cart.objects.filter(user=request.user, product_id=product_id).delete()
        return redirect("cart")

    context = {
        "products": products,
        "total_value": total_value,
    }
    return render(request, "cart.html", context)


@login_required
def following(request):

    followed_users = Follower.objects.filter(follower=request.user).values_list(
        "user", flat=True
    )
    followed_products = {}
    favorite_products = list(
        Favorite.objects.filter(user=request.user).values_list("product_id", flat=True)
    )

    for user_id in followed_users:
        products = Product.objects.filter(user_id=user_id)
        if products.exists():
            followed_products[User.objects.get(id=user_id)] = products

    if request.method == "POST":
        product_id = request.POST.get("product_id")
        if product_id:
            product = Product.objects.get(id=product_id)

            if product.id in favorite_products:
                Favorite.objects.filter(user=request.user, product=product).delete()
            else:
                Favorite.objects.create(user=request.user, product=product)
            return redirect("following")

    context = {
        "followed_products": followed_products,
        "favorite_products": favorite_products,
    }
    return render(request, "following.html", context)


@login_required
def myproducts(request):
    user = request.user

    if request.method == "POST":
        product_id = request.POST.get("product_id")
        product = get_object_or_404(Product, id=product_id, user=user)
        product.delete()
        return redirect("myproducts")

    products = Product.objects.filter(user=user)

    context = {
        "products": products,
        "user": user,
    }

    return render(request, "myproducts.html", context)


@login_required
def addproduct(request):
    if request.method == "POST":
        name = request.POST.get("name")
        description = request.POST.get("description")
        price = request.POST.get("price")
        brand = request.POST.get("brand")
        category = request.POST.get("category")
        color = request.POST.get("color")
        image = request.FILES.get("image")

        product = Product(
            name=name,
            description=description,
            price=price,
            brand=brand,
            category=category,
            color=color,
            image=image,
            user=request.user,
        )
        product.save()
        return redirect("myproducts")

    categories = Product.CATEGORY_CHOICES
    return render(request, "addproduct.html", {"categories": categories})


@login_required
def edit_product(request, product_id):
    product = get_object_or_404(Product, id=product_id, user=request.user)

    if request.method == "POST":
        product.name = request.POST.get("name")
        product.description = request.POST.get("description")
        product.price = request.POST.get("price")
        product.brand = request.POST.get("brand")
        product.category = request.POST.get("category")
        product.color = request.POST.get("color")

        if "image" in request.FILES:
            product.image = request.FILES["image"]

        product.save()
        return redirect("myproducts")

    categories = Product.CATEGORY_CHOICES
    return render(
        request, "editproduct.html", {"product": product, "categories": categories}
    )


@login_required
def profile(request):
    return render(request, "profile.html", {"user": request.user})


@login_required
def messages_page(request, user_id=None):

    contacts = User.objects.filter(
        Q(messages_sent__receiver=request.user)
        | Q(messages_received__sender=request.user)
    ).distinct()

    selected_user = (
        get_object_or_404(User, id=user_id)
        if user_id
        else (contacts.first() if contacts.exists() else None)
    )

    chat_messages = (
        Message.objects.filter(
            Q(sender=request.user, receiver=selected_user)
            | Q(sender=selected_user, receiver=request.user)
        ).order_by("created_at")
        if selected_user
        else []
    )

    if request.method == "POST":

        message_text = request.POST.get("message")
        if selected_user and message_text:
            Message.objects.create(
                sender=request.user, receiver=selected_user, text=message_text
            )

            return redirect("messages_page", user_id=selected_user.id)

    context = {
        "contacts": contacts,
        "selected_user": selected_user,
        "chat_messages": chat_messages,
    }
    return render(request, "messages_page.html", context)


@login_required
def admin_page(request):

    product_query = request.GET.get("product_search", "")
    user_query = request.GET.get("user_search", "")
    comment_query = request.GET.get("comment_search", "")
    order_query = request.GET.get("order_search", "")

    products = (
        Product.objects.filter(name__icontains=product_query)
        if product_query
        else Product.objects.all()
    )

    users = (
        User.objects.filter(name__icontains=user_query)
        if user_query
        else User.objects.all()
    )

    comments = (
        Comment.objects.filter(user__name__icontains=comment_query)
        if comment_query
        else Comment.objects.all()
    )

    orders = (
        Order.objects.filter(user__username__icontains=order_query)
        if order_query
        else Order.objects.all()
    )

    if request.method == "POST":
        if "delete_product" in request.POST:
            product_id = request.POST.get("delete_product")
            product = get_object_or_404(Product, id=product_id)
            product.delete()
            return redirect("admin_page")

        elif "delete_user" in request.POST:
            user_id = request.POST.get("delete_user")
            user = get_object_or_404(User, id=user_id)
            user.delete()
            return redirect("admin_page")

        elif "delete_comment" in request.POST:
            comment_id = request.POST.get("delete_comment")
            comment = get_object_or_404(Comment, id=comment_id)
            comment.delete()
            return redirect("admin_page")

    return render(
        request,
        "admin_page.html",
        {
            "products": products,
            "users": users,
            "comments": comments,
            "orders": orders,
            "product_query": product_query,
            "user_query": user_query,
            "comment_query": comment_query,
            "order_query": order_query,
        },
    )


@login_required
def user_detail(request, user_id):
    profile_user = get_object_or_404(User, id=user_id)
    logged_user = request.user

    products = Product.objects.filter(user=profile_user)
    comments_received = Comment.objects.filter(seller=profile_user)
    is_own_profile = logged_user == profile_user
    is_following = Follower.objects.filter(
        user=profile_user, follower=logged_user
    ).exists()

    followers = None
    if is_own_profile:
        followers = [
            follower.follower for follower in Follower.objects.filter(user=profile_user)
        ]

    if request.method == "POST":
        action = request.POST.get("action")

        if action == "toggle_follow" and not is_own_profile:
            if is_following:

                Follower.objects.filter(
                    user=profile_user, follower=logged_user
                ).delete()
                messages.success(
                    request, f"You have unfollowed {profile_user.username}."
                )
            else:

                Follower.objects.create(user=profile_user, follower=logged_user)
                messages.success(
                    request, f"You are now following {profile_user.username}."
                )
            return redirect("user_detail", user_id=user_id)

        elif action == "comment" and not is_own_profile:
            text = request.POST.get("text")
            rating = request.POST.get("rating")
            if text and rating:
                Comment.objects.create(
                    text=text, rating=int(rating), user=logged_user, seller=profile_user
                )
                messages.success(request, "Your comment has been added.")
                return redirect("user_detail", user_id=user_id)

    return render(
        request,
        "user_detail.html",
        {
            "user": profile_user,
            "logged_user": logged_user,
            "comments_received": comments_received,
            "products": products,
            "is_own_profile": is_own_profile,
            "is_following": is_following,
            "followers": followers if is_own_profile else None,
        },
    )


@login_required
def checkout(request):
    user_cart = request.user.cart.all()
    total_value = sum(item.product.price for item in user_cart)

    if request.method == "POST":
        address = request.POST.get("address")
        payment_method = request.POST.get("payment")

        if not address or not payment_method:
            messages.error(request, "Please complete the address and payment method.")
            return redirect("checkout")

        order = Order.objects.create(user=request.user)

        for cart_item in user_cart:
            product = cart_item.product
            product.sold = True
            product.save()

            order.products.add(product)

            seller = product.user
            message_text = f"{order.user.username} just bought your {product.name}."

            Message.objects.create(
                sender=order.user, receiver=seller, text=message_text
            )

        user_cart.delete()

        messages.success(request, "Order confirmed! Thank you for your purchase.")
        return redirect("index")

    context = {
        "cart_items": user_cart,
        "total_value": total_value,
    }
    return render(request, "checkout.html", context)


@login_required
def profile_settings(request):
    if request.method == "GET":
        user = User.objects.get(username=request.user.username)
        picture_form = UpdateUserImageForm()
        password_form = UpdatePasswordForm()
        profile_form = UpdateUserProfileForm(
            initial={
                "name": user.name,
                "email": user.email,
                "username": user.username,
                "description": user.description,
            }
        )

        return render(
            request,
            "profile_settings.html",
            {
                "user": user,
                "picture_form": picture_form,
                "password_form": password_form,
                "profile_form": profile_form,
            },
        )

    elif request.method == "POST" and "image" in request.FILES:
        user = User.objects.get(username=request.user.username)
        image_form = UpdateUserImageForm(request.POST, request.FILES)

        if image_form.is_valid():
            file = request.FILES["image"]

            if file:
                user.update_image(file)
                return redirect("profile_settings")

        else:
            image_form = UpdateUserImageForm()
            return render(
                request,
                "profile_settings.html",
                {"user": user, "picture_form": image_form},
            )

    elif request.method == "POST" and "password_change" in request.POST:
        user = User.objects.get(username=request.user.username)
        password_form = UpdatePasswordForm(request.POST)
        image_form = UpdateUserImageForm()
        profile_form = UpdateUserProfileForm(
            initial={
                "name": user.name,
                "email": user.email,
                "username": user.username,
                "description": user.description,
            }
        )

        if password_form.is_valid():
            print(password_form.cleaned_data["old_password"])
            print(user.password)
            if check_password(
                password_form.cleaned_data["old_password"], user.password
            ):
                if (
                    password_form.cleaned_data["new_password"]
                    == password_form.cleaned_data["confirm_password"]
                ):

                    user.set_password(password_form.cleaned_data["new_password"])
                    request.user.password = password_form.cleaned_data["new_password"]
                    user.save()
                    return render(
                        request,
                        "profile_settings.html",
                        {
                            "user": user,
                            "password_form": password_form,
                            "image_form": image_form,
                            "profile_form": profile_form,
                            "success": "Password changed successfully!",
                        },
                    )

                else:
                    return render(
                        request,
                        "profile_settings.html",
                        {
                            "user": user,
                            "password_form": password_form,
                            "image_form": image_form,
                            "profile_form": profile_form,
                            "error": "Passwords do not match!",
                        },
                    )

            else:
                return render(
                    request,
                    "profile_settings.html",
                    {
                        "user": user,
                        "password_form": password_form,
                        "image_form": image_form,
                        "profile_form": profile_form,
                        "error": "Incorrect old password!",
                    },
                )

        else:
            return render(
                request,
                "profile_settings.html",
                {
                    "user": user,
                    "password_form": password_form,
                    "image_form": image_form,
                    "profile_form": profile_form,
                    "error": "Invalid form input!",
                },
            )

    elif request.method == "POST" and "profile_change" in request.POST:
        user = User.objects.get(username=request.user.username)
        profile_form = UpdateUserProfileForm(request.POST)

        if profile_form.is_valid():
            if user.username != profile_form.cleaned_data["username"]:
                user.username = profile_form.cleaned_data["username"]

            if user.email != profile_form.cleaned_data["email"]:
                user.email = profile_form.cleaned_data["email"]

            if user.name != profile_form.cleaned_data["name"]:
                user.name = profile_form.cleaned_data["name"]

            if user.description != profile_form.cleaned_data["description"]:
                user.description = profile_form.cleaned_data["description"]

            user.save()
            return redirect("profile_settings")

    elif request.method == "POST" and "delete_account" in request.POST:
        user = User.objects.get(username=request.user.username)
        user.delete()
        return redirect("index")