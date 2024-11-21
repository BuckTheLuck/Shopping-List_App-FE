import { Component, ElementRef, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { UserDetails } from '../../models/user-details-data';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { DialogModule } from 'primeng/dialog'
import { ListsData } from '../../models/list-data';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { ListsService } from '../../services/lists.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css',
})

export class MainPageComponent {
  uuid?: string;
  userDetails?: UserDetails;
  isDialogOpen = false;
  isSettingsDialogOpen = false;
  isEditDialogOpen = false;
  visible = false;
  settingVisible = false;
  newListName: string = '';
  firstNameInitial: string = '';
  editListName: string = '';
  shoppingLists: ListsData[] = [];
  listDetails?: ListsData;
  listId!: number;
  editListId!: number;
  listsInTrash: ListsData[] = [];
  private profileService = inject(ProfileService);
  private listsService = inject(ListsService);

  constructor(
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
    this.getShoppingLists();
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

  goToRoute(route: string) {
    this.router.navigateByUrl(route);
  }

  goToTrash() {
    this.router.navigate(['/trash']);
  }

  checkListDetails(listId: number): void {
    this.router.navigate(['/list', listId]);
  }

  showDialog(): void {
    this.openDialog();
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

  openDialog() {
    this.isDialogOpen = true;
  }
  
  closeDialog() {
    this.isDialogOpen = false;
  }

  openEditDialog(list: ListsData) {
    this.editListName = list.name;
    this.editListId = list.id;
    this.isEditDialogOpen = true;
  }

  closeEditDialog() {
    this.isEditDialogOpen = false;
  }

  submitList() {
    if (this.newListName.trim().length > 0) {
      this.listsService.createList(this.newListName).
      subscribe(
        (response) => {
          console.log('List created:', response);
          this.isDialogOpen = false;
          this.getShoppingLists();
        },
        (error) => {
          console.log('Error creating post:', error);
        }
      );
    }
    this.refreshPage();
  }

  getShoppingLists() {
    const userId = this.authService.decodedToken.sub;
    if(userId) {
      this.listsService.getListsByUserId(userId).subscribe(
        (lists: ListsData[]) => {
          this.shoppingLists = lists.filter(list => list.status === 'Active');
          console.log('Loaded shopping lists:', this.shoppingLists)
        },
        (error) => {
          console.error('Error loading shopping lists', error);
        }
      );
    }
  }

  moveToTrash(shoppingListId: number): void {
    this.listsService.updateListStatus(shoppingListId, 'Trash').subscribe(
      () => {
        this.getShoppingLists();
      },
      (error) => {
        console.error('Error moving list to trash:', error);
      }
    );
  }

  onListClick(lists: ListsData) {
    console.log('List clicked: ', lists.name);
  }

  toggleOverlayPanel(event: Event, overlayPanel: OverlayPanel) {
    event.stopPropagation();
    overlayPanel.toggle(event);
  }

  deleteList(list: ListsData) {

  }

  refreshPage(): void {
    window.location.reload();
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

  // renameList(list: ListsData): void {
  //   const newName = prompt('Enter the new name for the list:', list.name);
  //   if(newName && newName.trim() !== '') {
  //     this.listsService.updateListName(list.id, newName.trim()).subscribe(
  //       () => {
  //         console.log('List name updated successfully');
  //         this.getShoppingLists();
  //         this.snackBar.open('List name updated successfully!', 'Close', {
  //           duration: 3000,
  //           horizontalPosition: 'center',
  //           verticalPosition: 'top',
  //         });
  //       },
  //       (error) => {
  //         console.error('Error updating list name:', error);
  //         this.snackBar.open('Failed to update list name!', 'Close', {
  //           duration: 3000,
  //           horizontalPosition: 'center',
  //           verticalPosition: 'top',
  //         });
  //       }
  //     );
  //   }
  // }

  submitEditList() {
    if (this.editListName.trim().length > 0) {
      this.listsService.updateListName(this.editListId, this.editListName.trim()).subscribe(
        () => {
          console.log('List name updated successfully');
          this.getShoppingLists();
          this.isEditDialogOpen = false;
          this.snackBar.open('List name updated successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        },
        (error) => {
          console.error('Error updating list name:', error);
          this.snackBar.open('Failed to update list name!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
      );
    }
  }

}
