import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {UsersState, AddUser, IUsersState, IUsersList, LoadUsers, RemoveUser, EditUser} from './store/users.state';
import {map} from 'rxjs/operators';
import {MyStoreService} from './store/my-store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @Select(state => state.usersState.status) usersStatus$: Observable<number>;

  constructor(private store: Store, public myStore: MyStoreService) {
    this.myStore.usersState$.subscribe(val => console.log(val));
  }

  public loadUsers = () => {
    this.myStore.loadUsers().then(data => console.log('Loading users', data));
  };
  public getUsers = () => {
    this.myStore.getUsers().then(data => {
      console.log('Getting users', data);
      // data.
    });
  };

  public addUser = () => {
    this.myStore.addUser({
      username: 'user99', email: 'user99@blueface.com',
      first_name: 'Mrs',  last_name: 'Tomato'
    }).then(data => {
      console.log('User added', data);
    });
  };


  public editUser = (user) => {
    this.myStore.editUser({
      id: user.id,
      first_name: user.last_name,
      last_name: user.first_name,
    });
  };
}
