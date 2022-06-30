function search() {
    var input = document.getElementById("searchbar");
    input.addEventListener("keydown", async function (word) {
        if (word.key === "Enter") {
            const SearchResult = await getProductDetail(word);
            console.log("JSON.stringify(SearchResult)")
            const amountofReturn = SearchResult.results;
            console.log(amountofReturn)
            renderRecommended(SearchResult.results);
        }
    });

    const getProductDetail = async (name) => {
        var text = name.target.value;
        console.log(text);
        var searchresult = null;
        await axios.get(`http://127.0.0.1:8000/store/products/?search=${text}`)
            .then(async res => {
                searchresult = res.data
            }).catch(err => console.log(err))
        return searchresult
    }


   


    const renderRecommended = async (list) => {
        document.getElementById("recomands").style.display = "none";
        document.getElementById("makenone").style.display = "none";
        $("div.recommended-list ").html(
            function(){
                const content = list.map(item=>{
                    let images = item.images
                    const productItem =  $("<div class='product-item column'></div>").append(()=>{
                        return $("<div class='details'></div>").html(
                            `<div class="img-box">
                            <img src="${images && images.length>0&& images[0]?images[0].image||"Image/cartPlaceholder.png":"Image/cartPlaceholder.png"}">
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

}