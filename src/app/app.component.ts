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

  // @Select(UsersState) users$: Observable<IUsers>;
  @Select() users$: Observable<IUsersState>;   // Reads the "name" of the state (without $)
  @Select(state => state.users.list) usersList$: Observable<IUsersList>;

  // ---------------------------------------------

  // public users$: Observable<IUsers>;
  // public usersList$: Observable<Array<IUsers>>;

  constructor(private store: Store, public myStore: MyStoreService) {
    // this.users$ = this.store.select(state => state.users);
    this.users$.subscribe(val => console.log(val));

    // this.usersList$ = this.store.select(state => state.users)
    //   .pipe(map(users => users.list));

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
