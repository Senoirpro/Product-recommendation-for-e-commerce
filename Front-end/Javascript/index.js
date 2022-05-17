$(document).ready(async function(){
    

    const renderProducts = (products)=>{
        if(products.results.length>0){
            $('.product-item-list').html(
                function(){
                    const {results} = products
                    const list = results.map(item=>{
                        // const image = await getProductImages(item.id)
                        const productItem =  $("<div class='product-item column'></div>").append(()=>{
                            return $("<div class='details'></div>").html(
                                `<div class="img-box">
                                <img src="${item.image||"Image/cartPlaceholder.png"}">
                                </div>
            
                                <h3>${item.title}</h3>
                                <h5>${parseFloat(item.unit_price).toFixed(2)} ETB</h5>
                                <div class="rating">
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star-o"></i>
                                </div>
                                `
                            ).append(()=>{
                                return $("<button class='cart'></button>").html(
                                    `Add to cart
                                    <img src="Image/cart.png">`
                                    ).click(
                                        function(event){
                                            event.stopPropagation();
                                            addToCart(item)
                                        }
                                    )
                            })
                        }).click(
                            function(){
                                window.location.href=window.location.origin+'/Front-end/productdetail.html?id='+item.id

                            }
                        )
                        return productItem
                    })
                    return list
                }
            )
        }

        
        $("div.pagination-container").html(
            function(){
                let navs = []
                let page = 1
                if(products.next){
                    page = parseInt(products.next.substr(products.next.indexOf('page=')+5,(products.next.length - products.next.indexOf('page='))))-1
                }
                else if(products.previous){
                    page = parseInt(products.previous.substr(products.previous.indexOf('page=')+5,(products.previous.length - products.previous.indexOf('page='))))-1
                }
                if(products.previous){
                    
                    navs.push($("<button></button>").html("<").click(
                        async function(){
                            const newPage = await getProducts(products.previous)
                            renderProducts(newPage)
                        }
                    ))
                }
                navs.push($("<div class='page-number'></div>").html(`${page}`))
                    
                navs.push($("<button></button>").html(">").click(
                    async function(){
                    const newPage = await getProducts(products.next)
                        renderProducts(newPage)
                    }
                ))
                return navs
            }
        )

        
    }

    const renderRecommended = async (list) => {
        $("div.recommended-list ").html(
            function(){
                const content = list.map(item=>{
                    const productItem =  $("<div class='product-item column'></div>").append(()=>{
                        return $("<div class='details'></div>").html(
                            `<div class="img-box">
                            <img src="${item.image||"Image/cartPlaceholder.png"}">
                            </div>
        
                            <h3>${item.title}</h3>
                            <h5>${parseFloat(item.unit_price).toFixed(2)} ETB</h5>
                            <div class="rating">
                                <i class="fa fa-star"></i>
                                <i class="fa fa-star"></i>
                                <i class="fa fa-star"></i>
                                <i class="fa fa-star"></i>
                                <i class="fa fa-star-o"></i>
                            </div>
                            `
                        ).append(()=>{
                            return $("<button class='cart'></button>").html(
                                `Add to cart
                                <img src="Image/cart.png">`
                                ).click(
                                    function(event){
                                        event.stopPropagation();
                                        addToCart(item)
                                    }
                                )
                        })
                    }).click(
                        function(){
                            window.location.href=window.location.origin+'/Front-end/productdetail.html?id='+item.id

                        }
                    )
                    return productItem
                })
                return content
            }
        )
    }

    

    


    renderRecommended(await getRecommendedList())
    renderProducts(await getProducts())
    
    
    
  
  });