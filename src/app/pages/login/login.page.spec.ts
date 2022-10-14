import {ComponentFixture, inject, TestBed, waitForAsync} from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let div: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginPage ],
      imports: [IonicModule.forRoot(), HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    console.log(component)
    div = fixture.nativeElement.querySelector('.button');

    fixture.detectChanges();
  }));



  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display original button text', () => {
    expect(div.textContent).toContain("Start");
  });

});
