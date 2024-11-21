import { Component, inject } from '@angular/core';
import { UserDetails } from '../../models/user-details-data';
import { AuthService } from '../../services/auth.service';
import { ListsService } from '../../services/lists.service';
import { ProfileService } from '../../services/profile.service';
import { Observable } from 'rxjs';
import { HttpHandler, HttpHeaders } from '@angular/common/http';
import { ListsData } from '../../models/list-data';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoppingListData } from '../../models/shopping-list-data';
import { ProductsData } from '../../models/product-data';
import { ProductsService } from '../../services/products.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrl: './list-page.component.css',
})
export class ListPageComponent {
  firstNameInitial: string = '';
  uuid?: string;
  userDetails?: UserDetails;
  listId!: number;
  listDetails?: ListsData;
  showAddProduct: boolean = false;
  listItems: ShoppingListData[] = [];
  products: ProductsData[] = [];
  filteredProducts: any[] = [];
  searchProductName: string = '';
  newProductName: string = '';
  isSettingsDialogOpen = false;
  editListId!: number;
  editListName: string = '';
  isEditDialogOpen = false;
  purchased: boolean = false;
  addedProducts: Set<string> = new Set<string>();
  private profileService = inject(ProfileService);
  private listsService = inject(ListsService);
  private productsService = inject(ProductsService);

  constructor (
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.authService.decodeToken();
    if (this.authService.decodedToken) {
      this.uuid = this.authService.decodedToken.sub;
    }
    this.getProfileDetails();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id !== null) {
        this.listId = +id;
        this.getListDetails();
        this.getListItems();
        this.loadProducts();
        this.loadAddedProducts();
        this.sortListItems();
        this.filterProducts();
      }
    });
  }

  sortListItems() {
    this.listItems.sort((a,b) => a.productName.localeCompare(b.productName));
  }

  getProfileDetails(): void {
    this.profileService.getProfileDetails().subscribe(
      (response) => {
        this.userDetails = response;
        this.firstNameInitial = this.userDetails.firstname.charAt(0);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getListDetails(): void {
    this.listsService.getListById(this.listId).subscribe(
      (response) => {
        this.listDetails = response;
        console.log(this.listDetails?.name);
      },
      (error) => {
        console.error('Error fetching list details:', error);
      }
    );
  }

  goToRoute(route: string) {
    this.router.navigateByUrl(route);
  }

  goToShoppingLists() {
    this.router.navigate(['/main']);
  }

  goToTrash() {
    this.router.navigate(['/trash']);
  }

  showSettingsDialog(): void {
    this.openSettingsDialog();
  }

  openSettingsDialog() {
    this.isSettingsDialogOpen = true;
  }

  closeSettingsDialog() {
    this.isSettingsDialogOpen = false;
  }

  generateRandomIcon(): void {
    const icons = ["🧺", "🍎", "🍇", "🥑", "🍉", "🍌", "🍒", "🍑", "🍍", "🥥"];
    const randomIndex = Math.floor(Math.random() * icons.length);
    const randomIcon = icons[randomIndex];
    const iconElement = document.getElementById('randomIcon');
    if (iconElement) {
      iconElement.innerText = randomIcon;
    }
  }

  toggleAddProduct(): void {
    this.showAddProduct = !this.showAddProduct;
  }

  toggleBoughtStatus(item: ShoppingListData): void {
    item.purchased = !item.purchased;
  }

  filterProducts() {
    this.filteredProducts = this.products
      .filter(product => product.name.toLowerCase().includes(this.searchProductName.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  getListItems(): void {
    this.listsService.getShoppingListItems(this.listId).subscribe(
      (response) => {
        this.listItems = response.sort((a: { productName: string; },b: { productName: string; }) => a.productName.localeCompare(b.productName));
        this.updateAddedProducts();
        console.log(this.listItems);
      },
      (error) => {
        console.error('Error fetching list items:', error)
      }
    );
  }

  updateAddedProducts(): void {
    this.addedProducts.clear();
    this.listItems.forEach(item => this.addedProducts.add(item.productName));
    this.saveAddedProducts();
  }

  addProduct(productName: string): void {
    if(this.isProductAdded(productName)) {
      return;
    }

    const product = this.products.find(p => p.name === productName);
    if (product) {
      this.listsService.addProductToList(this.listId, product.name).subscribe(
        () => {
          console.log('Product added successfully with quantity 1');
          this.getListItems();
          this.addedProducts.add(productName);
          this.saveAddedProducts();
        },
        (error) => {
          console.error('Error adding product:', error);
        }
      );
    }
  }

  addCustomProduct(productName: string): void {
           if (!this.searchProductName || this.isProductAdded(this.searchProductName)) {
               return;
             }

             this.listsService.addProductToList(this.listId, this.searchProductName).subscribe(
               () => {
                 console.log('Produkt został pomyślnie dodany z ilością 1');
                 this.getListItems();
                 this.addedProducts.add(this.searchProductName);
                 this.saveAddedProducts();
                 this.searchProductName = ''; // Opcjonalnie wyczyść pole po dodaniu produktu
               },
               (error) => {
                 console.error('Błąd podczas dodawania produktu:', error);
               }
             );
           }

  saveAddedProducts(): void {
    localStorage.setItem(`addedProducts_${this.listId}`, JSON.stringify(Array.from(this.addedProducts)));
  }

  loadAddedProducts(): void {
    const savedProducts = localStorage.getItem(`addedProducts_${this.listId}`);
    if (savedProducts) {
      this.addedProducts = new Set<string>(JSON.parse(savedProducts));
    }
  }

  isProductAdded(productName: string): boolean {
    return this.addedProducts.has(productName);
  }

  loadProducts(): void {
    this.productsService.getProducts().subscribe(
      (response) => {
        this.products = response.products;
        this.filteredProducts = [...this.products];
      },
      (error) => {
        console.error('Error loading products:', error);
      }
    )
  }

  submitNewProduct(): void {
    if(this.newProductName.trim()) {
      const newProduct: Omit<ProductsData, 'id'> = {
        name: this.newProductName,
        category: 'Other'
      };

      this.products.push(newProduct as ProductsData);
      this.addProduct(this.newProductName);
      this.newProductName = '';
    }
  }

  updateProductQuantity(productName: string, newQuantity: number): void {
    if (productName && newQuantity) {
      console.log('Updating product quantity:', productName, newQuantity);
      const body = { [productName]: newQuantity };
      
      this.listsService.updateProductQuantity(this.listId, body).subscribe(
        () => {
          console.log('Product quantity updated successfully');
          this.getListItems();
        },
        (error) => {
          console.error('Error updating product quantity:', error);
        }
      );
    } else {
      console.error('Product name or new quantity is missing')
    }
  }

  openEditDialog(list: ListsData) {
    this.editListName = list.name;
    this.editListId = list.id;
    this.isEditDialogOpen = true;
  }

  closeEditDialog() {
    this.isEditDialogOpen = false;
  }

  increaseQuantity(item: any): void {
    item.quantity += 1;
    this.updateProductQuantity(item.productName, item.quantity);
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 0) {
      item.quantity -= 1;

      if (item.quantity === 0) {
        this.deleteProduct(item.productName);
        return;
      }

      this.updateProductQuantity(item.productName, item.quantity);
    }
  }

  deleteProduct(productName: string): void {
    this.listsService.deleteProductsFromList(this.listId, [productName]).subscribe(
      () => {
        console.log(`Product ${productName} deleted successfully`);
        this.getListItems();
        this.addedProducts.delete(productName);
        this.saveAddedProducts();
      },
      (error) => {
        console.error('Error deleting product:', error);
      }
    );
  }

  confirmDeleteProduct(productName: string): void {
    if (confirm(`Are you sure you want to delete ${productName} from the list?`)) {
      this.deleteProduct(productName);
    }
  }

  logoutAllAccount(): void {
    this.profileService.logoutAllAccount().subscribe(
      (response) => {
        console.log('Konto zostało wylogowane:', response);
        localStorage.clear();
        this.router.navigate(['/login']);
        this.snackBar.open('Account logout succesfull from all devices!', 'Close', {
          duration: 3000, 
          horizontalPosition: 'center',
          verticalPosition: 'top', 
        });
       
      },
      (error) => {
        console.error('Błąd podczas wylogowywania konta:', error);
       
      }
    );
  }

  logoutAccount(): void {
    this.profileService.logoutAccount().subscribe(
      (response) => {
        console.log('Konto zostało wylogowane:', response);
        localStorage.clear();
        this.router.navigate(['/login']);
        this.snackBar.open('Account logout succesfull!', 'Close', {
          duration: 3000, 
          horizontalPosition: 'center',
          verticalPosition: 'top', 
        });
       
      },
      (error) => {
        console.error('Błąd podczas wylogowywania konta:', error);
       
      }
    );
  }

}