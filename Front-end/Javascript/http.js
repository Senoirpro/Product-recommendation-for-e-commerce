
const getProductImages = async(id='')=>{
    var result = null
    await axios.get(`http://127.0.0.1:8000/store/products/${id}/images/`)
    .then(res=>{
        result = res.data
    }).catch(err=>console.log(err))
    return result
}

const getProducts = async (url = 'http://127.0.0.1:8000/store/products/') =>{
    
    var result = null
    await axios.get(`${url}`)
    .then(async res=>{
        const list = await Promise.all(res.data.results.map(async item=>{
            return {
                ...item,
                images: await getProductImages(item.id)
            }
        })).then(res=>{
            return res
        })
        
        result = {
            ...res.data,
            results: list
        }

    }).catch(err=>console.log(err))
    return result
}

const getCollections = async (url = 'http://127.0.0.1:8000/store/collections/') =>{
    
    var result = null
    await axios.get(`${url}`)
    .then(res=>{
        result = res.data
    }).catch(err=>console.log(err))
    return result
}

const getProductDetail = async(id='')=>{
    var result = null
    await axios.get(`http://127.0.0.1:8000/store/products/${id}/`)
    .then(async res=>{
        result = {
            ...res.data,
            images:await getProductImages(res.data.id)
        }
    }).catch(err=>console.log(err))
    return result
}


const getProductReviews = async(id='')=>{
    
    var result = null
    await axios.get(`http://127.0.0.1:8000/store/products/${id}/reviews/`)
    .then(res=>{
        result = res.data
    }).catch(err=>console.log(err))
    return result
}

const getRecommendedList = async (id) =>{
    var result = null
    await axios.get(`http://127.0.0.1:8000/store/products/${id}/recommends/`)
    .then(res=>{
        result = res.data.map(async item=>{
                const product = {
                    ...item,
                    images: await getProductImages(item.id)
                }
                return product
            })
    }).catch(err=>console.log(err))

    if(result.length>0)
        return result

    result = []
    const list = await getProducts()
    for(var i=0;i<6;i++){
        let num =Math.floor(Math.random() * list.count)+1
        if(result.length===0 || !result.find(item=>item && item.id===num)){
            result.push(await getProductDetail(num))
        }
        else{
            i--;
            continue
        }

    }
    return result
}

const createUser = (user) =>{
    console.log(user)
    return true
}

const loginUser = (user) =>{
    console.log(user)
    return true
}

