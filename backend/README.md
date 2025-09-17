# TPW-proj2

# Backend

# Introduction

Olx clone, where users can buy and sell star wars themed items, the wesite was designed and developed to increase and fullfuil user experience while allowing maximum funcionlaity.

# How to run localy

    Start a venv if you want.

    pip install -r requirements.txt

    python3 manage.py makemigrations

    python3 manage.py migrate

    python3 insertData.py

    python3 manage.py runserver 8002

# Aternativly run this script

[setup_and_run.sh](setup_and_run.sh)

# Acess this link to view the website deployed

https://odraude.pythonanywhere.com 

# Users 

| User    | Password     | Admin |
|:--------|:-------------|:------|
| joao    | password1    | False |
| maria   | password2    | False |
| ricardo | password3    | False |
| ana     | password4    | False |
| tiago   | password5    | False |
| mateus  | password123  | True  |


| Superuser | Password |
|:---|:---:|
| admin | admin123 |

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


# How to add a new admin

Create a super user, and give the admin flag in the default admin django page.


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