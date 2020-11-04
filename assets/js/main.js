
let selectedCatID=0;
$(document).ready(function(){
  showRecepies();
  showCategories();
});
function ajaxRecepies(callbackSuccess){ 
    $.ajax({
        url: "data/recepies.json",
        method: "GET",
        success: callbackSuccess
    });
}
function showRecepies() {

  ajaxRecepies(
      function(recepies){
          printRecepies(recepies);
      }
  );
}
function printRecepies(recepies){
  let html = "";
  if(recepies.length > 0){
      for(let product of recepies){
          html += printSingleProduct(product);
      }
  } else {
      html += "<h3 class='block-4 text-center'>No recepies.</h3>";
  }
  
  $("#blockRecepies").html(html);
  $(".fav").click(addToFav);
  $('.vise').click(showMore);
}

function printSortButtons(){
  let is=`
  <div id="btnSort">
                                  
  <button  data-order="asc" class="el btnSort"> Sort recepies from A-Z</button> 
  <button  data-order="desc" class="el btnSort"> Sort recepies from Z-A</button> 
  <h3 class="red"><i class="fa fa-search trazi" aria-hidden="true"></i> Search</h3>
   <input type="text" name="trazi" id="trazi" placeholder="search..."/>
                  
</div>
  `
  if(document.getElementById("sortRec") != null)
  document.getElementById("sortRec").innerHTML=is;
  $(".el").click(sortByRecName);
  $("#trazi").blur(search);
  

}
function addToFav(){
  let id=$(this).data('id');
  alert("Cart successfully updated!");
  var products = productsInCart();

  if(products) {
      if(productIsAlreadyInCart()) {
          return
      } else {
          addToLocalStorage()
      }
  } else {
      addFirstItemToLocalStorage();
  }

 // alert("Cart successfully updated!");

  function productIsAlreadyInCart() {
      return products.filter(p => p.id == id).length;
  }

  function addToLocalStorage() {
      let products = productsInCart();
      products.push({
          id : id  
      });
      localStorage.setItem("products", JSON.stringify(products));
  }

  function addFirstItemToLocalStorage() {
      let products = [];
      products[0] = {
          id : id
      };
      localStorage.setItem("products", JSON.stringify(products));
  }
}

function showEmptyCart() {
  if(document.getElementById("emptyFavs") != null)
  
  document.getElementById("emptyFavs").innerHTML="<h2>Your cart is currenlty empty!</h2>";
  
}

function removeFromCart(id) {
  let products = productsInCart();
  let filtered = products.filter(p => p.id != id);

  localStorage.setItem("products", JSON.stringify(filtered));

  displayCartData();
}

function productsInCart() {
  return JSON.parse(localStorage.getItem("products"));
  
}


function displayCartData() {
    
let products = productsInCart();
//console.log(products);
if(!products.length){
 showEmptyCart();
}else{
    ajaxRecepies(
          function(data){
              neki = data.filter(p => {
                  for(let prod of products)
                  {
                         
                    return p.id==prod.id;
                             
                  }
              return false;
              });
              populateCardPage(neki);
              console.log(neki)
          }
      );
          
  }
}

function populateCardPage(data){
  //console.log(data);
  let korpa="";
  for(let d of data){
    korpa+=`
    <div class="col-xs-12 col-sm-6 jedanRecept">
    <div class="features-item">
              <h3 class="naslov">${d.recepieName}
              <button class="fav" id="btnHeart" data-id="${d.idO}"><i class="fa fa-heart-o" aria-hidden="true"></i>
              </button></h3>
            <img src="${d.img.src}" class="slikaRecept"/>
            </div>
            </div>
            <div class="cleaner"></div>
    </div>
    `;
  }
  
  if(document.getElementById("cardFavs") != null)
  document.getElementById("cardFavs").innerHTML=korpa;
  
}



function search(){
  var unos=document.getElementById("trazi").value;
  alert(unos);
 
  ajaxRecepies(
 function(data){
 var somePosts=data.filter(el=>{
 if(el.recepieName.toLowerCase().indexOf(unos.toLowerCase())!==-1){
 return true;
 }
 });
 
 printRecepies(somePosts);
 console.log(somePosts);
 }
 );


}


function onFilterByCategory(e){
  e.preventDefault();
  selectedCatID= $(this).data('id');
  //alert(selectedCatID);

  ajaxRecepies(function(recepies){
     var pr=recepies.filter(x=>{
        return x.categorys.categoryId==selectedCatID
      });
      printRecepies(pr);
      console.log(pr);
  });

 
}

function sortByRecName(){
  let order=$(this).data('order');
 // console.log(order);
 ajaxRecepies(
      function(data){
      data.sort(function(a,b) {
      let valueA = a.recepieName;
      let valueB = b.recepieName;
      if(valueA > valueB)
        return order=='asc' ? 1 : -1;
      else if(valueA < valueB)
        return order=='asc' ? -1 : 1;
      else
        return 0;
      });
      if(selectedCatID!=0){
      podaci = data.filter(p=>{
        return p.categorys.categoryId==selectedCatID;
        
      }); 
      printRecepies(podaci);}
      else{
        printRecepies(data);
      };
  });
 }


function printSingleProduct(product){
  return `
  <div class="col-xs-12 col-sm-6 jedanRecept">
  <div class="features-item">
            <h3 class="naslov">${product.recepieName}
            <button class="fav" id="btnHeart" data-id="${product.idO}"><i class="fa fa-heart-o" aria-hidden="true"></i>
            </button></h3>
          <img src="${product.img.src}" class="img-responsive slikaRecept"  alt="">
          <p>${product.shortDescription}</p>
          <button id="${product.idO}" onclick="readMore()" class="btn btn-custom btn-lg ReadMore vise">Read more</button>
          <div class="readmore-hidden">
          <h3>Ingredients</h3>
          ${obrada(product.ingredients)}
          <h3 class="ins">Instructions</h3>
          <div class="instructions" ${product.idO}>${obradaInstr(product.instructions)}</div>
          </div>
          </div>
          <div class="cleaner"></div>
  </div>`;
}
function obrada(ingredients){
  let prikazi ="<ul>";
  for(var i = 0; i<ingredients.length; i++){
      prikazi += ingredients[i] + ", ";
  }
  prikazi += "</ul>";
  return prikazi;
}
function obradaInstr(instructions){
  let prikazi ="<ol>";
  for(var i = 0; i<instructions.length; i++){
      prikazi +="<li>" + instructions[i] + "</li>";
  }
  prikazi += "</ol>";
  return prikazi;
}


function showMore(){
  //alert('bskjla');
  var $sledeciPTag = $(this).next(); 
  $sledeciPTag.slideToggle();
}
 
function showCategories(){
  $.ajax({
      url: "data/categories.json",
      method: "GET",
      success: function(categories){
          printCategories(categories);
      }
  })
}

function printCategories(categories){
  let html = "";
  for(let category of categories){
      html += printSingleCategory(category);
  }
  $("#categories").html(html);

  $('.filter-category').click(onFilterByCategory);
}
function printSingleCategory(category, numberOfRecepies){
  return `<li class="mb-1">
      <a href="#" class="d-flex filter-category" data-id="${category.id}">
        <span>${ category.name }</span> 
        <span class="text-black ml-auto">(${ category.numberOfRecepies })</span>
      </a>
    </li>`;

}

//ispis menija
window.onload = function(){
  printSortButtons();

let products = productsInCart();
    
if(products){
       
        displayCartData();
}
else{
    showEmptyCart();
}


  $.ajax({
      url: "data/navigation.json",
      data:"get",
      dataType:"json",
      success: function(data){
          navBar(data);
      },
      error: function(error){
          console.log(error);
      }
  });
  function navBar(data){
      logNavBar = "";
      data.forEach(element =>{
          logNavBar += `
              <li>
                   <a class="page-scroll" href ="${element.href}">${element.text}</a>
              </li>
          `;
      });
      if(document.getElementById("nav") != null)
      document.getElementById("nav").innerHTML = logNavBar;
  }
  /* SHOW SLIDER */
  $.ajax({
    url: "data/images.json",
    data:"get",
    dataType:"json",
    success: function(data){
        img(data);
    },
    error: function(error){
        console.log(error);
    }
});
function img(data){
    logImg = "";
    data.forEach(element =>{
        logImg += `
        <div class="col-xs-6 col-md-3">
        <div class="gallery-item"> <img src="${element.src}" class="img-responsive" alt=""></div>
      </div>
        `;
    });
    if(document.getElementById("logImg") != null)
    document.getElementById("logImg").innerHTML = logImg;
}


  //DOBIJENO
function main() {

(function () {
   'use strict';
   
  	$('a.page-scroll').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
          if (target.length) {
            $('html,body').animate({
              scrollTop: target.offset().top - 40
            }, 900);
            return false;
          }
        }
      });
     
	
    // Show Menu on Book
    $(window).bind('scroll', function() {
        var navHeight = $(window).height() - 600;
        if ($(window).scrollTop() > navHeight) {
            $('.navbar-default').addClass('on');
        } else {
            $('.navbar-default').removeClass('on');
        }
    });

    $('body').scrollspy({ 
        target: '.navbar-default',
        offset: 80
    });

	// Hide nav on click
  $(".navbar-nav li a").click(function (event) {
    // check if window is small enough so dropdown is created
    var toggle = $(".navbar-toggle").is(":visible");
    if (toggle) {
      $(".navbar-collapse").collapse('hide');
    }
  });

}());


}
  main();
}

//provera
if(document.getElementById("btnClick") != null)
window.document.getElementById("btnClick").addEventListener("click", function(){
  var validno = true;
	var podaci = [];
  var ime = document.querySelector("#name").value.trim();
  var reIme = /^[A-Z][a-z]{2,11}$/;
  if(ime == "") {
    document.getElementById("errorName").innerHTML = "You forgot to wtite your email."; 
    validno = false;  
 } else if(!reIme.test(ime)) {
  document.getElementById("errorName").innerHTML = "Not allowed characters are used.";
     validno = false;
 } else {
     podaci.push(ime);
     document.getElementById("errorName").innerHTML = "";   
 }

  var email = document.querySelector("#email").value;
  var reEmail=/^[a-z]+\.[a-z]+\.([1-9][0-9]{0,3})\.(1[0-8])\@gmail\.com\$/;
  if(email == "") {
    document.getElementById("errorEmail").innerHTML = "You forgot to wtite your email."; 
    validno = false;  
 } else if(!reEmail.test(email)) {
  document.getElementById("errorEmail").innerHTML = "Not allowed characters are used.";
     validno = false;
 } else {
     podaci.push(email);
     document.getElementById("errorEmail").innerHTML = "";   
 }


  var poruka=document.getElementById("message").value;
  if(poruka == "") {
    document.getElementById("errorMessage").innerHTML = "Write your message."; 
    validno = false;  
 } else {
     podaci.push(poruka);
     document.getElementById("errorMessage").innerHTML = "";   
 }
	  
    
});


    
