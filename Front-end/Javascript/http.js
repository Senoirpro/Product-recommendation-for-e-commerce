

const getProducts = async (url = 'http://127.0.0.1:8000/store/products/') =>{
    
    var result = null
    await axios.get(`${url}`)
    .then(res=>{
        result = res.data
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
    .then(res=>{
        result = res.data
    }).catch(err=>console.log(err))
    return result
}

const getProductImages = async(id='')=>{
    var result = null
    await axios.get(`http://127.0.0.1:8000/store/products/${id}/images/`)
    .then(res=>{
        result = res.data
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

const getRecommendedList = async () =>{
    const list = []
    for(var i=0;i<6;i++){
        let num =Math.floor(Math.random() * 1000)+1
        if(list.length===0 || !list.find(item=>item && item.id===num)){
            list.push(await getProductDetail(num))
        }
        else{
            i--;
            continue
        }

    }
    return list
}

const createUser = (user) =>{
    console.log(user)
    return true
}

const loginUser = (user) =>{
    console.log(user)
    return true
}

