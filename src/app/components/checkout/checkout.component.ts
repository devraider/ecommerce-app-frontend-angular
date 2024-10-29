import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, combineLatest, tap } from 'rxjs';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  checkoutFormsGroup!: FormGroup;
  totalPrice!: Observable<number>;
  totalQuantity!: Observable<number>;
  creditCardMonths!: Observable<number[]>;
  creditCardYears!: Observable<number[]>;

  countries!: Observable<Country[]>;
  states!: Observable<State[]>;

  shippingAddressStates!: Observable<State[]>;
  billingAddressStates!: Observable<State[]>;

  storage: Storage = sessionStorage;
  constructor(private formBuilder: FormBuilder, private shopForm: ShopFormService, private cartService: CartService, private checkoutService: CheckoutService, private router: Router) {}


  ngOnInit(): void {
    const usrEmail = JSON.parse(this.storage.getItem("userEmail")!);


    this.checkoutFormsGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhiteSpaces]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhiteSpaces]),
        email: new FormControl(usrEmail, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhiteSpaces]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhiteSpaces]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{4,7}$')])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhiteSpaces]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhiteSpaces]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{4,7}$')])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhiteSpaces]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{17}$')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{3}$')]),
        expirationMonth: new FormControl('', [Validators.required]),
        expirationYear: new FormControl('', [Validators.required])
      }),
    });


    // price and qty
    this.creditCardMonths = this.shopForm.getCreditCardMonths(new Date().getMonth() + 1);
    this.creditCardYears = this.shopForm.getCreditCardYears();


    // populate countries
    this.countries = this.shopForm.getCountries();

    this.reviewCartDetails();
  }


  reviewCartDetails() {
    this.totalPrice = this.cartService.totalPrice;
    this.totalQuantity = this.cartService.totalQuantity;
  }


  onSubmit() {
    if (this.checkoutFormsGroup.invalid) {
      this.checkoutFormsGroup.markAllAsTouched();
      return;
    }

    // set up order
    let order = new Order(0, 0);

    combineLatest([
      this.cartService.totalPrice,
      this.cartService.totalQuantity
    ]).subscribe(data => {
      order.totalPrice = data[0];
      order.totalQuantity = data[1];
    })

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems for cartItems
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    // set up purchase
    let purchase = new Purchase();


    // populate purchase - customer
    purchase.customer = this.checkoutFormsGroup.controls['customer'].value

    // populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormsGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;
    // populate purchase - billing address
    purchase.billingAddress = this.checkoutFormsGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = shippingState.name;
    purchase.billingAddress.country = shippingCountry.name;

    // populate purchase - order and order items
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API 
    this.checkoutService.placeOrder(purchase).subscribe({
        next: response => {
          alert(`Your order is: ${response.orderTrackingNumber}`);

          // reset cart
          this.resetCart();
        },
        error: err => {
          alert(`There was an error ${err.message}`);
        }
      }

    );
  }

  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    
    // reset form
    this.checkoutFormsGroup.reset();

    // navigate main back to product page
    this.router.navigateByUrl("/products");

  }

  copyShippingAddressToBillingAddress(event: any) {


    if (event.target.checked) {
      this.checkoutFormsGroup.controls['billingAddress'].setValue(this.checkoutFormsGroup.controls['shippingAddress'].value);
    } else {
      this.checkoutFormsGroup.controls['billingAddress'].reset();

    }
  }

  handleMonthAndYears() {
    const creditCardFormGroup = this.checkoutFormsGroup.get("creditCard");

    const currentYear = new Date().getFullYear();
    const selectedYear = +creditCardFormGroup?.value.expirationYear;

    let startMonth;

    if (currentYear == selectedYear ) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.creditCardMonths = this.shopForm.getCreditCardMonths(startMonth);
  }

  getStates(formGroupSection: string) {
    const formGroup = this.checkoutFormsGroup.get(formGroupSection);

    const countryCode = formGroup?.value.country.code;

    this.states = this.shopForm.getStates(countryCode).pipe(
      // tap(d => console.log(d))
    );
  }


  get firstName() {
    return this.checkoutFormsGroup.get("customer.firstName");
  }

  get lastName() {
    return this.checkoutFormsGroup.get("customer.lastName");
  }

  get email() {
    return this.checkoutFormsGroup.get("customer.email");
  }

  get shippigAddressState() {
    return this.checkoutFormsGroup.get("shippingAddress.state");
  }

  get shippigAddressStreet() {
    return this.checkoutFormsGroup.get("shippingAddress.street");
  }

  get shippigAddressCity() {
    return this.checkoutFormsGroup.get("shippingAddress.city");
  }

  get shippigAddressCountry() {
    return this.checkoutFormsGroup.get("shippingAddress.country");
  }
  get shippigAddressZipCode() {
    return this.checkoutFormsGroup.get("shippingAddress.zipCode");
  }

  get billingAddressState() {
    return this.checkoutFormsGroup.get("billingAddress.state");
  }

  get billingAddressStreet() {
    return this.checkoutFormsGroup.get("billingAddress.street");
  }

  get billingAddressCity() {
    return this.checkoutFormsGroup.get("billingAddress.city");
  }

  get billingAddressCountry() {
    return this.checkoutFormsGroup.get("billingAddress.country");
  }
  get billingAddressZipCode() {
    return this.checkoutFormsGroup.get("billingAddress.zipCode");
  }

  // card

  get creditCardCardType() {
    return this.checkoutFormsGroup.get("creditCard.cardType");
  }
  get creditCardNameOnCard() {
    return this.checkoutFormsGroup.get("creditCard.nameOnCard");
  }
  get creditCardcardNumber() {
    return this.checkoutFormsGroup.get("creditCard.cardNumber");
  }
  get creditCardSecurityCode() {
    return this.checkoutFormsGroup.get("creditCard.securityCode");
  }
  get creditCardExpirationMonth() {
    return this.checkoutFormsGroup.get("creditCard.expirationMonth");
  }
  get creditCardExpirationYear() {
    return this.checkoutFormsGroup.get("creditCard.expirationYear");
  }
}
