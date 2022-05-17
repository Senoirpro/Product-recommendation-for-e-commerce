$(document).ready(async function(){


    var sPageURL = window.location.search.substring(1)
    var sURLVariables = sPageURL.split('&')
    var sParameterName
    var productID
    
    for (var i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
    
        if (sParameterName[0] === 'id') {
            productID = sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }

    const renderReviews = (list)=>{
        if(list.length===0) return
        $('div.review-list').html(
            function(){
                return list.map(item=>{
                    return $("<div class='review-item'></div>").html(`
                        <div class='name-date'>
                            <h4 class='review-name'>${item.name}</h4>
                            <p class='review-date'>${item.date}</p>
                        </div>
                        <p class='review-desc'>${item.description}</p>
                    `)
                })
            }
        )
    }

    const renderDetails = async (product)=>{
        
        if(!product){
            window.location.href = window.location.origin+'/Front-end/index.html'
        }

        // const image = await getProductImages(product.id)
        $('div.product-details div.product-item-detail').html(
            function(){
                const content = []
                
                content.push($("<div class='img-box'></div>").html(`<img src=${product.image||'Image/cartPlaceholder.png'}>`))
                content.push($("<div class='item-detail'></div>").html(`
                    <div class="name-price">
                        <h2 class="item-name">${product.title}</h2>
                        <h3 class='item-price'>Br. ${product.unit_price}</h3>
                    </div>
                    <p>${product.description}</p>
                    
                `))
                content.push($("<button class='cart details-cart'></button>").html(`
                    Add to cart
                    <img src="Image/cart.png">
                `).click(function(){
                    
                    addToCart(product)
                }))
                return content
            }
        )

        renderReviews(await getProductReviews(product.id))
        
    }


    
    

    if(productID){
        renderDetails(await getProductDetail(productID))
    }
    else{
        window.location.href = window.location.origin+'/Front-end/index.html'
    }
    
})