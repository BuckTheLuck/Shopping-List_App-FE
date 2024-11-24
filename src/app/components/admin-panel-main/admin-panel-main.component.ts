import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-admin-panel-main',
  templateUrl: './admin-panel-main.component.html',
  styleUrl: './admin-panel-main.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AdminPanelMainComponent implements OnInit {
  users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'blocked' },
    { id: 3, name: 'Bob Brown', email: 'bob@example.com', status: 'deleted' },
    { id: 4, name: 'Alice Green', email: 'alice@example.com', status: 'active' },
    { id: 5, name: 'Chris Black', email: 'chris@example.com', status: 'blocked' },
  ];

  activeUsers: { id: number; name: string; email: string; status: string }[] = [];
  blockedUsers: { id: number; name: string; email: string; status: string }[] = [];
  deletedUsers: { id: number; name: string; email: string; status: string }[] = [];

  ngOnInit(): void {
    this.updateUserLists();
  }

  updateUserLists() {
    this.activeUsers = this.users.filter(user => user.status === 'active');
    this.blockedUsers = this.users.filter(user => user.status === 'blocked');
    this.deletedUsers = this.users.filter(user => user.status === 'deleted');
  }

  blockUser(userId: number) {
    const user = this.users.find(user => user.id === userId);
    if (user) {
      user.status = 'blocked';
      this.updateUserLists();
    }
  }

  unblockUser(userId: number) {
    const user = this.users.find(user => user.id === userId);
    if (user) {
      user.status = 'active';
      this.updateUserLists();
    }
  }

  deleteUser(userId: number) {
    const user = this.users.find(user => user.id === userId);
    if (user) {
      user.status = 'deleted';
      this.updateUserLists();
    }
  }

  restoreUser(userId: number) {
    const user = this.users.find(user => user.id === userId);
    if (user) {
      user.status = 'active';
      this.updateUserLists();
    }
  }

  toggleOverlayPanel(event: Event, overlayPanel: OverlayPanel) {
    event.stopPropagation();
    overlayPanel.toggle(event);
  }
}
