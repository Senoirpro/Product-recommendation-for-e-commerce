$(document).ready(function(){
    

    subCartItem = (idx)=>{
        const cart = JSON.parse(localStorage.getItem('cart-list'))
        cart[idx].total_price = (cart[idx].total_price/cart[idx].quantity)*(cart[idx].quantity-1)
        cart[idx].quantity -=1
        localStorage.setItem('cart-list',JSON.stringify(cart))
    }
    deleteCartItem = (idx)=>{
        const cart = JSON.parse(localStorage.getItem('cart-list'))
        cart.splice(idx,1)
        localStorage.setItem('cart-list',JSON.stringify(cart))
    }

    clearCart=()=>{
        localStorage.setItem('cart-list',JSON.stringify([]))

    }

    const renderCart =()=>{
        const cart = JSON.parse(localStorage.getItem('cart-list'))
        if(!cart || cart.length===0){
            $("div.cart-items").html("Cart is empty")
            $(".cart-total").html("Br. 0.00")
        }
        if(cart){
            if(!$("button.clear-cart").hasClass('show'))
                $("button.clear-cart").toggleClass('show')
                
                $("button.clear-cart").click(
                    function(){
                        clearCart()
                        renderCart()
                        renderCartNotif()
                        window.location.href = window.location.origin+'/Front-end/index.html'
                    }
                )
            $("div.cart-items").html(
                function(){
                    return cart.map((item,idx)=>{
                        return $("<div class='cart-item'></div>").html(
                            function(){
                                const content = []
                                const {image} = item.product
                                content.push($("<div class='cart-item-title'>").html([
                                    $("<button class='delete-item'></button>").html("X").click(
                                        function(){
                                            deleteCartItem(idx)
                                            renderCart()
                                            renderCartNotif()

                                        }
                                    ),
                                    `<div><img src="${image?image||"Image/cartPlaceholder.png":"Image/cartPlaceholder.png"}"/></div>
                                    <h3>${item.product.title}</h3>`
                                ]))
                                content.push($("<h4 class='cart-item-unit'></h4>").html(`Br. ${item.product.unit_price}`))
                                content.push($("<div class='cart-price'></div>").html(
                                    function(){
                                        return [
                                            $("<div class='cart-quantity'></div>").html(
                                                function(){
                                                    return [
                                                        $("<button class='delete-item'></button>").html("-").click(
                                                            function(){
                                                                subCartItem(idx)
                                                                renderCart()
                                                                renderCartNotif()
                                                            }
                                                        ),
                                                        `${item.quantity}`,
                                                        $("<button class='delete-item'></button>").html("+").click(
                                                            function(){
                                                                addToCart(item.product)
                                                                renderCart()
                                                                renderCartNotif()
                                                            }
                                                        )
                                                    ]
                                                }
                                            ),
                                            `<h4 class="cart-item-total">Br. ${parseFloat(item.total_price).toFixed(2)}</h4>`
                                        ]
                                    }
                                ))
                                return content
                            }
                        )
                    })
                }
            )
            $(".cart-total").html(
                function(){
                    let total = 0
                    cart.forEach(item=>{
                        total+=item.total_price
                    })
                    return "Br. "+parseFloat(total).toFixed(2)
                }
            )
        }
    }

    renderCart()
})