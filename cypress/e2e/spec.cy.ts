import {Storage} from "@capacitor/storage";
import {environment} from "../../src/environments/environment";

context('720p resolution', () => {
let test:any;
  beforeEach(async () => {
    // run these tests as if in a desktop
    // browser with a 720p monitor
    cy.viewport(320, 480)
  })


  it('loads login page', () => {
    cy.visit('/login');
    cy.contains('Start');
  });

  it('start application', () => {
    cy.get('.button').click()
  });

  it('generate letters', () => {
    cy.get('.buttons ion-button').eq(0).click();
    cy.get('.buttons ion-button').eq(1).click();
    cy.get('.buttons ion-button').eq(2).click();
    cy.get('.buttons ion-button').eq(3).click();
    cy.get('.buttons ion-button').eq(4).click();
  });

  it('test chosen word no exist',  () => {
    cy.get('.bottom .enter').click()
  });


})
