// var noti = document.querySelector('h4');
// 	var select = document.querySelector('.select');
// 	var button = document.getElementsByTagName('button');
// 	for(var but of button){
// 		but.addEventListener('click', (e)=>{
// 			var add = Number(noti.getAttribute('data-count') || 0);
// 			noti.setAttribute('data-count', add +1);
// 			noti.classList.add('zero')

			
		

		
// 			var parent = e.target.parentNode;
// 			var clone = parent.cloneNode(true);
// 			select.appendChild(clone);
// 			clone.lastElementChild.innerText = "Buy-now";
			
// 			if (clone) {
// 				noti.onclick = ()=>{
// 					select.classList.toggle('display');
// 				}	
// 			}
// 		})
// 	}

const renderCartNotif = () =>{


	let cart = JSON.parse(localStorage.getItem('cart-list'))

	if(cart && cart.length>0){
		let count = 0
		cart.forEach(item=>{
			count+=item.quantity
		})
		if(!$("div.cart-count").html(`${count}`).hasClass('show'))
			$("div.cart-count").html(`${count}`).toggleClass('show')
	}
}

const addToCart = (item)=>{
	let cart = JSON.parse(localStorage.getItem('cart-list'))
	if(!cart){
		cart = []
	}

	if(cart.length===0){
		const product = {
			id:item.id,
			title:item.title,
			unit_price:item.unit_price,
			image:item.images &&item.images[0]?item.images[0].image:''
		}
		cart.push({
			product:product,
			quantity:1,
			total_price:product.unit_price
		})
		localStorage.setItem('cart-list',JSON.stringify(cart))
	}
	else{
		let idx = cart.findIndex((el)=>el.product.id===item.id)
		if(idx!==-1){
			cart[idx].quantity +=1
			cart[idx].total_price = item.unit_price * cart[idx].quantity
		}
		else{
			const product = {
				id:item.id,
				title:item.title,
				unit_price:item.unit_price,
				image:item.images &&item.images[0]?item.images[0].image:''
			}
			cart.push({
				product:product,
				quantity:1,
				total_price:product.unit_price
			})
		}

		localStorage.setItem('cart-list',JSON.stringify(cart))

	}

	renderCartNotif()
}

	$(document).ready(async function(){


		const renderCollections = (collections) =>{
			if(collections.length>0){
				$('div.collection-container').html(
					function(){
						const list = collections.map(item=>{
							// if(item.products_count > 0)
							return $(`<a href='http://127.0.0.1:8000/store/products/?collection_id=${item.id}' onclick=catagorize(${item.id}); class='collection-item'></a><br>`).html(`${item.title}`)
	
						})
						// list.push($("<a href='' class='collection-item active'></a>").html(`${""}`))
						return list
					}
				)
			}
		}
		
	
		renderCartNotif()
		renderCollections(await getCollections())

	})