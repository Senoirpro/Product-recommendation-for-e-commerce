$(document).ready(async function () {


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

    const renderReviews = (list) => {
        if (list.length === 0) return
        $('div.review-list').html(
            function () {
                return list.map(item => {
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

    const renderRecommended = (list) => {
        if (list && list.length > 0) {
            if (!$("div.recommended-list").hasClass('show'))
                $("div.recommended-list ").toggleClass('show')

            console.log($("div.recommended-list").hasClass('show'))

            $("div.recommended-list ").html(
                function () {
                    const content = list.map(item => {
                        let { images } = item
                        const productItem = $("<div class='product-item column'></div>").append(() => {
                            return $("<div class='details'></div>").html(
                                `<div class="img-box">
                                <img src="${images && images.length > 0 && images[0] ? images[0].image || "Image/cartPlaceholder.png" : "Image/cartPlaceholder.png"}">
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
                            ).append(() => {
                                return $("<button class='cart'></button>").html(
                                    `Add to cart
                                    <img src="Image/cart.png">`
                                ).click(
                                    function (event) {
                                        event.stopPropagation();
                                        addToCart(item)
                                    }
                                )
                            })
                        }).click(
                            function () {
                                window.location.href = window.location.origin + '/Front-end/productdetail.html?id=' + item.id

                            }
                        )
                        return productItem
                    })
                    return [$("<h2>Recommended Products</h2>"), ...content, $("<hr>")]
                }
            )
        }
        else {
            if ($("div.recommended-list ").hasClass('show'))
                $("div.recommended-list ").toggleClass('show')
        }
    }

    const renderDetails = async (product) => {

        if (!product) {
            window.location.href = window.location.origin + '/Front-end/index.html'
        }

        // const image = await getProductImages(product.id)
        $('div.product-details div.product-item-detail').html(
            function () {
                const content = []
                const { images } = product
                content.push($("<div class='img-box'></div>").html(`
                <img class='img-main' src="${images && images.length > 0 && images[0] ? images[0].image || 'Image/cartPlaceholder.png' : 'Image/cartPlaceholder.png'}">
                `).append(
                    function () {
                        const list = []
                        if (images.length > 1) {
                            images.forEach((item, idx) => {
                                if (idx > 0) {
                                    list.push($(`<img class='img-item' src='${item ? item.image || 'Image/cartPlaceholder.png' : 'Image/cartPlaceholder.png'}'/>`))
                                }
                            })
                        }
                        return $("<div class='image-list'></div>").html(list)
                    }
                ))
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
                `).click(function () {

                    addToCart(product)
                }))
                return content
            }
        )
        renderRecommended(await getProductsByCollection(product.collection))
        renderReviews(await getProductReviews(product.id))

    }





    if (productID) {
        renderDetails(await getProductDetail(productID))
    }
    else {
        window.location.href = window.location.origin + '/Front-end/index.html'
    }

})