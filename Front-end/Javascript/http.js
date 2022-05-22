
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
    .then(async res=>{
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

const getRecommendedList = async (id) =>{
    var result = null
    await axios.get(`http://127.0.0.1:8000/store/products/${id}/recommends/`)
    .then(res=>{
        result = res.data
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

const createUser = async(user) =>{
    console.log(user)
    return await axios.post('http://127.0.0.1:8000/auth/users/',user).
    then(res=>{
        console.log(res)
        return true
    }).catch(err=>{
        console.log(err.response)
        return false
    })
}

const loginUser = async(user) =>{
    console.log(user)
    return await axios.post('http://127.0.0.1:8000/auth/jwt/create/',user).
    then(res=>{
        console.log(res)
        const {refresh,access} = res.data
        localStorage.setItem('ecommerce-tokens',JSON.stringify({
            refresh,
            access
        }))
        return true
    }).catch(err=>{
        console.log(err.response)
        return false
    })
}
