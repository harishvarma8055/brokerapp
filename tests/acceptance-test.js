/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

// These are Chimp globals
/* globals browser assert server */


describe('Broker App - Gold User UserStory : ', function () {
  var driver;

  before(function () {
    browser.url('http://localhost:3000/login');
    //server.call('generateFixtures');
  });

  it('Feature Gold user can Login @watch', function () {
    browser.setValue('input[id="inputUserName"]', 'sarath');
    browser.setValue('input[id="inputPassword"]', '');
    browser.click('#submit');
    var doesExistPageNavBar = browser.waitForExist('nav[class="navbar navbar-default"]');
  });


  it('Feature Gold user - Able to see MI Data Page and click to enter customer details @watch', function () {
     var elementPresent = browser.waitForExist("//li[@class='dropdown']//a[.='Progressive Brokers ']",4000);
     expect(elementPresent).to.exist;
     browser.click("//li[@class='dropdown']//a[.='Progressive Brokers ']");
     browser.click("//ul[@class='dropdown-menu']//a[.='Onboard Customer']");
  });

   it('Feature Gold user - Able to fill in customer details @watch', function () {
     var elementPresent = browser.waitForExist("/html/body/div/div/client-info/div[2]/form[1]/fieldset/div[1]/label",6000);
     expect(elementPresent).to.exist;
     browser.setValue("/html/body/div/div/client-info/div[2]/form[1]/fieldset/div[1]/div/input",'sarath pillai');
     browser.setValue("/html/body/div/div/client-info/div[2]/form[1]/fieldset/div[2]/div/input",'spillai@prolifics.com');
     
     browser.setValue("/html/body/div/div/client-info/div[2]/form[1]/fieldset/div[3]/div/input",'RG1 6QX');
     browser.click("/html/body/div/div/client-info/div[2]/form[1]/fieldset/div[3]/div[2]/button");

    
      /* commented now as address service slow
      browser.waitForSelected('//*[@id="select"]/option[1]',5500);
      browser.click('//*[@id="select"]');
      browser.click('//*[@id="select"]/option[1]');
      */

      browser.setValue("/html/body/div/div/client-info/div[2]/form[1]/fieldset/div[5]/div/textarea",'Flat 7,Thetford House,Reading');

      browser.click('//div/div/client-info/div[2]/form[1]/fieldset/div[6]/div/select//option[3]');
      browser.click('//div/div/client-info/div[2]/form[1]/fieldset/div[7]/div/input');
      browser.click('//div/div/client-info/div[2]/form[1]/fieldset/div[7]/div/div/div/div/div/div/table/tbody/tr[3]/td[4]/span');
      
      browser.setValue("//div/div/client-info/div[2]/form[1]/fieldset/div[8]/div/input",'7466810495');
      browser.setValue("//div/div/client-info/div[2]/form[1]/fieldset/div[9]/div/input",'2013124124');
      browser.setValue("//div/div/client-info/div[2]/form[1]/fieldset/div[10]/div/input",'1234');

      browser.click('//div/div/client-info/div[2]/form[1]/fieldset/div[11]/div/select//option[2]');
      browser.click('//div/div/client-info/div[2]/form[1]/fieldset/div[11]/div/select//option[1]');//SELECTING THE LAST DROPDOWN
      

      browser.click('//div/div/client-info/div[2]/form[1]/fieldset/div[12]/div/button[2]');//CLICK NEXT     
     //browser.click("//ul[@class='dropdown-menu']//a[.='Onboard Customer']");
  });

  it('Feature Gold user - Able to fill in Policy details @watch', function () {
     var elementPresent = browser.waitForExist("//div/div/client-info/div[2]/form[2]/legend",6000);
     expect(elementPresent).to.exist;
     expect(browser.getText("//div/div/client-info/div[2]/form[2]/legend")).to.equal('Enter Policy Details');

     browser.click('//div/div/client-info/div[2]/form[2]/fieldset/div[1]/div/select//option[2]');
     browser.click('//div/div/client-info/div[2]/form[2]/fieldset/div[2]/div/select//option[2]');

     browser.setValue("//div/div/client-info/div[2]/form[2]/fieldset/div[3]/div/input",'1231');


     expect(browser.getValue('//div/div/client-info/div[2]/form[2]/fieldset/div[5]/div/input')).to.equal('1262.8');
     browser.setValue("//div/div/client-info/div[2]/form[2]/fieldset/div[6]/div/input",'7572056930');
        
     //browser.click("//div/div/client-info/div[2]/form[2]/fieldset/div[7]/div/button[2]");
  }); 
});