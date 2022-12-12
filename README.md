# get started

* Config your Api-Key into .env file for Infura Provider
* npm i 
* npm start 

-L nodemon run on port 3001

# api endpoints

<h2>  /last <h2/>
  <h6>- Inform the latest transaction made on chain between a given a contract’s address and a wallet’s address in the ethereum network<h6>
  
  * walletAdress : string 
  
  * contractAdress : string 
  
 <h3>postman example <h3>

    "walletAdress":"0x1cf652Dd115Fa7fF244A491E66B3387589DCa301",
    "contractAdress":"0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB"

 --------------------------------------------------------------------------------
   
<h2>  /most <h2>
  <h6>- Inform which address has made more transactions given a contract’s address and an array of wallet’s address<h6>
  
   * walletAdress : array 
  
   * contractAdress : string
      
<h3>postman example <h3>
  
    "[walletAdress":"0x1cf652Dd115Fa7fF244A491E66B3387589DCa301]",
    "contractAdress":"0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB"
  
 --------------------------------------------------------------------------------
