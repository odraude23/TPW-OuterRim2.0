"""webproj URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from app import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    #=====================================================================================
    # new paths (REST API)
    path('api/products', views.product_list, name='product-list'),
    path('api/login', views.login),
    path('api/register', views.registerRest),
    path('api/user', views.get_user),
    path('api/users', views.get_users),
    path('api/user/comments/<int:id>', views.get_user_comments),
    path('api/user/products/<int:id>', views.get_my_products),
    path('api/user/following-products/<int:id>', views.get_following_products),
    path('api/products/<int:id>', views.get_product_details, name='get_product_details'),
    path('api/<int:id>/followers', views.get_user_followers),
    path('api/<int:id>/following', views.get_user_following),
    path('api/user/<str:username>', views.get_user_by_username),
    path('api/addComment', views.add_comment),
    path('api/<int:id>/followUser', views.follow_user),
    path('api/<int:id>/unfollowUser', views.unfollow_user),
    path('api/favorites/toggle/', views.toggle_favorite, name='toggle_favorite'),
    path('api/favorites/is-favorite/<int:product_id>/<int:user_id>/', views.is_favorite, name='is_favorite'),
    path('api/products/<int:product_id>/', views.delete_product, name='delete_product'),
    path('api/favorites/<int:user_id>', views.get_user_favorites, name='get_favorites'),
    path('api/products/<int:product_id>/update', views.update_product, name='edit_product'),
    path('api/products/<int:product_id>/updateImage', views.update_product_image, name='edit_product_image'),
    path('api/products/add', views.add_product, name='create-product'),
    path('api/deleteAccount/<int:id>', views.delete_user),
    path('api/updateAccount/<int:id>', views.update_user),
    path('api/updateProfile/<int:id>', views.update_profile),
    path('api/updateProfileImage/<int:id>', views.update_profile_pic),
    path('api/comments', views.get_comments),
    path('api/deleteComment/<int:id>', views.delete_comment),
    path('api/cart/<int:id>', views.get_cart),
    path('api/addToCart', views.add_to_cart),
    path('api/removeFromCart', views.remove_from_cart),
    path('api/messages/add', views.add_message),
    path('api/messages/<int:user_id>', views.get_messages),
    path('api/products/recommended/', views.recommended_products, name='recommended-products'),
    path('api/checkout', views.order_product),
    path('api/orders', views.get_orders),
    path('api/user/orders/<int:id>', views.get_user_order),

    #=====================================================================================
    # old paths
    
    path('admin/', admin.site.urls),

    path('', views.index, name='index'),
    path('login/', auth_views.LoginView.as_view(template_name="login.html"), name='login'),
    path('favorites/', views.favorites, name='favorites'),
    path('register/', views.register, name='register'),
    path('product/<int:product_id>/', views.product_details, name='product_details'),
    path('cart/', views.cart, name='cart'),
    path('following/', views.following, name='following'),
    path('myproducts/', views.myproducts, name='myproducts'),
    path('addproduct/', views.addproduct, name='addproduct'),
    path('editproduct/<int:product_id>/', views.edit_product, name='editproduct'),
    path('admin-page/', views.admin_page, name='admin_page'),
    path('user/<int:user_id>/', views.user_detail, name='user_detail'),
    path('checkout/', views.checkout, name='checkout'),
    path('profile_settings/', views.profile_settings, name='profile_settings'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('messages/', views.messages_page, name='messages_page'),
    path('messages/<int:user_id>/', views.messages_page, name='messages_page'),

]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


