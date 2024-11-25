import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { UserService } from '../../services/user.service';
import { UserDetails } from '../../models/user-details-data'; 
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-panel-main',
  templateUrl: './admin-panel-main.component.html',
  styleUrl: './admin-panel-main.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AdminPanelMainComponent implements OnInit {
  uuid?: string;
  users: UserDetails[] = [];
  activeUsers: UserDetails[] = [];
  admins: UserDetails[] = [];
  blockedUsers: UserDetails[] = [];
  error: string | null = null;
  private profileService = inject(ProfileService);

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // this.authService.decodeToken();
    // if (this.authService.decodedToken) {
    //   this.uuid = this.authService.decodedToken.sub;
    // }
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.updateUserLists();
      },
      error: (err) => {
        this.error = 'Failed to load users: ' + err.message;
      },
    });
  }

  updateUserLists(): void {
    this.activeUsers = this.users.filter((user) => user.role == 0)    //normal user
    this.admins = this.users.filter((user) => user.role == 1)         //admin user
    this.activeUsers = this.users.filter((user) => user.role == 2)    //blocked users
  }

  changeUserRole(userId: string, newRole: number): void {
    const user = this.users.find((user) => user.uuid === userId);
    if (user) {
      user.role = newRole;
      this.updateUserLists();
    }
  }

  blockUser(userId: string): void {
    this.changeUserRole(userId, 2);
  }

  unblockUser(userId: string): void {
    this.changeUserRole(userId, 0);
  }

  promoteToAdmin(userId: string): void {
    this.changeUserRole(userId, 1);
  }

  demoteFromAdmin(userId: string): void {
    this.changeUserRole(userId, 0);
  }

  toggleOverlayPanel(event: Event, overlayPanel: OverlayPanel) {
    event.stopPropagation();
    overlayPanel.toggle(event);
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
