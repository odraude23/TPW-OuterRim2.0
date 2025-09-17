import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountProfileComponent } from './account-profile/account-profile.component';
import { IndexComponent } from './index/index.component';
import { MyProductsComponent } from './my-products/my-products.component';
import { FollowingProductsComponent } from './following-products/following-products.component';
import { SellerProfileComponent } from './seller-profile/seller-profile.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { FavoritesPageComponent } from './favorites-page/favorites-page.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { AddProductComponent } from './add-product/add-product.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { AdminComponent } from './admin/admin.component';
import { CartComponent } from './cart/cart.component';
import { MessagesComponent } from './messages/messages.component';
import { CheckoutComponent } from './checkout/checkout.component';

export const routes: Routes = [
    {path: '', component: IndexComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'profile', component: AccountProfileComponent},
    {path: 'my-products', component: MyProductsComponent},
    {path: 'following-products', component: FollowingProductsComponent},
    {path: 'seller/profile/:username', component: SellerProfileComponent},
    {path: 'product-detail/:id', component: ProductDetailComponent },
    {path: 'favorites-page', component: FavoritesPageComponent},
    {path: 'edit-product/:id', component: EditProductComponent},
    {path: 'add-product', component: AddProductComponent},
    {path: 'profile/settings', component: AccountSettingsComponent},
    {path: 'admin', component: AdminComponent},
    {path: 'cart', component: CartComponent},
    {path: 'messages', component: MessagesComponent},
    {path: 'checkout', component: CheckoutComponent}
];
