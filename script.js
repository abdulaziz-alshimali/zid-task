

document.addEventListener('DOMContentLoaded', async function() {
	document.getElementById('Page2').style.display = 'none';
	let products = [];
	let cart = [];

	const makeCard = (name, img, description,status,price,id) => `
    
	<div class="card overcontainer">
    <div class="card-image waves-effect waves-block waves-light">
	  <img class="activator" src="${img}">
	</div>
	<div class="card-content">
	  <span class="card-title activator grey-text text-darken-4">${name}<i class="material-icons right">more_vert</i></span> 
	  <h5>${price} SAR</h5>
	  <a id="${id}" class="waves-effect waves-light btn"><i class="material-icons left">add_shopping_cart</i>Add to Cart</a>

	  </div>
    <div class="card-reveal">
      <span class="card-title grey-text text-darken-4">${name}<i class="material-icons right">close</i></span>
	  <h3>${price} SAR</h3>
	  <h3>${status}</h3>
	  <hr>
	<p>${description}</p>
	</div>
	${status === "Unvailable"?`
	<div class="overlay">
    <div class="text">Unvailable</div>
  </div>
  `:''}
	
  </div>
     
	`;
	const makeCart = (name, img, price,quantity) => `

	  <tr>
		<th ><img class="img":40px;" width= "30" height= "30" src="${img}"></th>
		<td>${name}</td>
		<td>${quantity}</td>
		<td>${price} SAR</td>
	  </tr>
	 `
  
  function disable() {
	
	 }
	
	function show(shown, hidden) {
		document.getElementById(shown).style.display='block';
		document.getElementById(hidden).style.display='none';
		if(shown === 'Page2') displayCart();
		return false;
	  }
	  document.getElementById('homebut').addEventListener('click',function(){
		 show('Page1','Page2');
	  })
	  document.getElementById('storebut').addEventListener('click',function(){
		show('Page1','Page2');
	 })
	  document.getElementById('cartbut').addEventListener('click',function(){
		show('Page2','Page1');
	})

	async function getProducts() {
		var ftch = await fetch('http://localhost:3000/layout');

		var jso = await ftch.json();
		products.push(...jso.body.recent_products);

	}

	await getProducts();

	console.log(products);

	async function getcart() {
		var ftch = await fetch('http://localhost:3000/cart');

		var jso = await ftch.json();
		cart.push(...jso.items);
	}

	await getcart();

	

let pPage = document.getElementById('content');
function displayCart() {
	let cartBody = document.getElementById('cart');
	cartBody.innerHTML = '';
	cart.forEach(c => {
		cartBody.innerHTML = cartBody.innerHTML + makeCart(c.name, c.image, c.price, c.quantity);
	});
}
function displayProducts() {
	pPage.innerHTML = '';
	products.forEach((p, i) => {
		if (i % 3 === 0) {

			let row = document.createElement('div');
			row.classList.add('row');
			products.forEach((newProd, newIndex) => {
				if (newIndex < i + 3 && newIndex >= i) {
					let col = document.createElement('div');
					col.classList.add('col-md-4');
					col.innerHTML = makeCard(
						newProd.name,
						newProd.image,
						newProd.description,
						newProd.stock_status,
						newProd.price,
						newProd.id
						

					);
					row.appendChild(col);
				}
			});
			pPage.appendChild(row);
		}
			document
			.getElementById(p.id)
			.addEventListener('click', function(e) {
				addToCart(p, p.minimum);
			});
		
	});
}

displayProducts();

function addToCart(item, quantity) {
	products.forEach(function(p) {
		if (item.id === p.id && p.quantity > 0) {
			if (quantity > p.quantity) {
				p.quantity = 0;
			} else {
				p.quantity = p.quantity - quantity;
			}

			if (p.quantity === 0) {
				p.stock_status = 'Unvailable';
			}
			displayProducts();
		}
	});
	if (item.stock_status === 'Available') {
		if (
			cart.findIndex(function(c) {
				return c.id === item.id;
			}) >= 0
		) {
			cart.forEach(function(c) {
				if (c.id === item.id) {
					c.quantity += quantity;
				}
			});
		} else {
			cart.push({ ...item, quantity });
		}
	}
}
});
