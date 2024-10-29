import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.scss']
})
export class LoginStatusComponent implements OnInit{
  isAuthenticated: boolean = false;
  userFullName: string = ""; 
  storage: Storage = sessionStorage;


  constructor(private oktaAuthStateService: OktaAuthStateService, @Inject(OKTA_AUTH) private oktaAuth: OktaAuth, private router: Router) {}

  ngOnInit(): void {
    

    // subscribe to authentication state change
    this.oktaAuthStateService.authState$.subscribe(result =>{
        this.isAuthenticated = result.isAuthenticated!;
        console.log("Authenthicated", result)
        this.getUserDetails();
    });
  }
  getUserDetails() {
    if (this.isAuthenticated) {
      // fetch logged details
      // user name is exposed as property name
      this.oktaAuth.getUser().then(
        (result: any) => {
          this.userFullName = result.name as string;

          this.storage.setItem("userEmail", JSON.stringify(result.email));
          console.log("Authenthicated: ", this.userFullName);

        }
      )
    }
  }

  logout() {
    // terminate session in Okta and remove token 
    this.oktaAuth.signOut();
    this.router.navigateByUrl('/products');
  }
}
