import { Component, OnInit, inject } from '@angular/core';
import { ListsService } from '../../services/lists.service';
import { AuthService } from '../../services/auth.service';
import { ListsData } from '../../models/list-data';
import { UserDetails } from '../../models/user-details-data';
import { ProfileService } from '../../services/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-trash-page',
  templateUrl: './trash-page.component.html',
  styleUrls: ['./trash-page.component.css']
})

export class TrashPageComponent implements OnInit {
  listsInTrash: ListsData[] = [];
  uuid?: string;
  userDetails?: UserDetails;
  firstNameInitial: string = '';
  isSettingsDialogOpen = false;
  shoppingLists: ListsData[] = [];

  private profileService = inject(ProfileService);
  private listsService = inject(ListsService);

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

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

  goToShoppingLists() {
    this.router.navigate(['/main']);
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

  getShoppingLists() {
    const userId = this.authService.decodedToken.sub;
    if(userId) {
      this.listsService.getListsByUserId(userId).subscribe(
        (lists: ListsData[]) => {
          this.shoppingLists = lists.filter(list => list.status === 'Trash');
          console.log('Loaded shopping lists:', this.shoppingLists)
        },
        (error) => {
          console.error('Error loading shopping lists', error);
        }
      );
    }
  }

  toggleOverlayPanel(event: Event, overlayPanel: OverlayPanel) {
    event.stopPropagation();
    overlayPanel.toggle(event);
  }

  deleteListPermamently(shoppingListId: number): void {
    this.listsService.updateListStatus(shoppingListId, 'Deleted').subscribe(
        () => {
            this.listsService.deleteShoppingList(shoppingListId).subscribe(
                () => {
                    this.getShoppingLists();
                    this.snackBar.open('List deleted permamently!', 'Close', {
                        duration: 3000,
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                    });
                },
                (error) => {
                    console.error('Error deleting list permamently:', error);
                    this.snackBar.open('Failed to delete list permamently!', 'Close', {
                        duration: 3000,
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                    });
                }
            );
        },
        (error) => {
            console.error('Error updating list status to delete:', error);
            this.snackBar.open('Failed to update list status!', 'Close', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
            });
        }
    );
  }

  restoreList(shoppingListId: number): void {
    this.listsService.updateListStatus(shoppingListId, 'Active').subscribe(
        () => {
            this.getShoppingLists();
            this.snackBar.open('List restored successfully!', 'Close', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
            });
        },
        (error) => {
            console.error('Error restoring list:', error);
            this.snackBar.open('Failed to restore list!', 'Close', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
            });
        }
    );
  }
}
