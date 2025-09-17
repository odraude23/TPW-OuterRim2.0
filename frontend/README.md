# TPW-proj2

# Introduction

Olx clone, where users can buy and sell star wars themed items, the wesite was designed and developed to increase and fullfuil user experience while allowing maximum funcionlaity.

# We achieved both complementary research issues
    
- The Development of an authentication system, using Django Rest Framework Authentication.
- The Deploymente of both the backend frontend in a real n-tier architecture

# Deployment

# The backend is deployed at

https://odraude.pythonanywhere.com 

# The frontend is deployed at

https://outer-rim.vercel.app/

# Running local (Folder submitted on elearning)

To run the backend, you can use the **setup_and_run.sh** in the backend folder, or you can follow the steps bellow

Install the following requirements

- pip install djangorestframework
- pip install markdown
- pip install django-filter
- pip install django-cors-headers
- pip install -r requirements.txt

> The last one is inside the backend folder

Run the backend on port 8002

```
python3 manage.py runserver 8002
```

> first run python3 insertData.py

Run the frontend

```
ng serve
```

# Members of the Group

| Nome | NMec |
|:---|:---:|
| Inês Ferreira | 104415 |
| Hugo Ribeiro | 113402 |
| Eduardo Lopes | 103070 |

# Users 

| User    | Password     | Admin |
|:--------|:-------------|:------|
| joao    | password1    | False |
| maria   | password2    | False |
| ricardo | password3    | False |
| ana     | password4    | False |
| tiago   | password5    | False |
| mateus  | password123  | True  |


# The development of the project is centered around components and services

# List of Components

    - Acount Profile
    - Acount Settings
    - Add product
    - Admin
    - Cart
    - Checkout
    - Edit Product
    - Favorites Page
    - Following Products
    - Footer
    - Index
    - Login
    - Messages
    - Model
    - My products
    - Navbar
    - Product box
    - Product Card
    - Product Detail
    - Profile Header
    - Register
    - Seller-Profile

# List of Services

    - User Service
    - Register Service
    - Favorites Service
    - Cart Service
    - Current User Service
    - Follower Service
    - Product Service
    - Messages Service
    - Comment Service
    - Logout Service

# Backend

The backend consists of a DRF allowing the following endpoints:

| **Link** | **Method** | **Description** |
|----------|------------|-----------------|
| `/api/products` | GET | Retrieve a list of products. |
| `/api/login` | POST | Login a user. |
| `/api/register` | POST | Register a new user. |
| `/api/user` | GET | Retrieve the currently logged-in user. |
| `/api/users` | GET | Retrieve a list of all users. |
| `/api/user/comments/<int:id>` | GET | Retrieve comments made on a user's profile. |
| `/api/user/products/<int:id>` | GET | Retrieve products posted by a user. |
| `/api/user/following-products/<int:id>` | GET | Retrieve products from followed users. |
| `/api/products/<int:id>` | GET | Retrieve product details. |
| `/api/<int:id>/followers` | GET | Retrieve the followers of a user. |
| `/api/<int:id>/following` | GET | Retrieve users a user is following. |
| `/api/user/<str:username>` | GET | Retrieve a user by their username. |
| `/api/addComment` | POST | Add a comment to a user's profile. |
| `/api/<int:id>/followUser` | POST | Follow a user. |
| `/api/<int:id>/unfollowUser` | POST | Unfollow a user. |
| `/api/favorites/toggle/` | POST | Toggle a product as favorite. |
| `/api/favorites/is-favorite/<int:product_id>/<int:user_id>/` | GET | Check if a product is a user's favorite. |
| `/api/products/<int:product_id>/` | DELETE | Delete a product. |
| `/api/favorites/<int:user_id>` | GET | Retrieve a user's favorite products. |
| `/api/products/<int:product_id>/update` | PUT | Update a product's details. |
| `/api/products/<int:product_id>/updateImage` | PUT | Update a product's image. |
| `/api/products/add` | POST | Add a new product. |
| `/api/deleteAccount/<int:id>` | DELETE | Delete a user account. |
| `/api/updateAccount/<int:id>` | PUT | Update a user account. |
| `/api/updateProfile/<int:id>` | PUT | Update a user's profile details. |
| `/api/updateProfileImage/<int:id>` | PUT | Update a user's profile image. |
| `/api/comments` | GET | Retrieve all comments. |
| `/api/deleteComment/<int:id>` | DELETE | Delete a comment. |
| `/api/cart/<int:id>` | GET | Retrieve a user's cart. |
| `/api/addToCart` | POST | Add a product to the cart. |
| `/api/removeFromCart` | POST | Remove a product from the cart. |
| `/api/messages/add` | POST | Send a message to a user. |
| `/api/messages/<int:user_id>` | GET | Retrieve messages for a user. |
| `/api/products/recommended/` | GET | Retrieve recommended products. |
| `/api/checkout` | POST | Place an order for products in the cart. |
| `/api/orders` | GET | Retrieve all user orders. |
| `/api/orders/<int:id>` | GET | Retrieve orders for a specific user. |


# Funcionalities 

## User - Not logged

- Register/Login 
- View all ads  
- Search and Filter 

## User - com login

- All from above
- Open ads 
- Add ads 
- See their own ads 
- Remove their ads 
- Track views on their add 
- Edit their ads 
- Add ads to cart and buy 
- Follow 
- See products from users they follow 
- See who follows them 
- Add ads to favourites 
- See their favourites 
- Send/Receive messages 
- View profiles 
- Change profile info 
- Comment on profiles 
- View his cart 
- Logout 
- Receive notification upon selling a product 
- View their order history
- Get recomendations for products

## Admin

- All from above
- Remove any users 
- Remove any ads 
- Remove any comment
- Search users and products 
- View all orders 