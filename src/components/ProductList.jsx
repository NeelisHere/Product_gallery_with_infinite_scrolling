import React, { useEffect, useState, useRef } from 'react'
import "../App.css";

const ProductList = () => {
    const [products, setProducts] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(0)

    const elementRef = useRef(null)

    const onIntersection = (entries) => {
        console.log(entries)
        const firstEntry = entries[0]
        if(firstEntry.isIntersecting && hasMore){
            fetchMoreItems()
        }
    }

    
    const fetchMoreItems = async () => {
        const response = await fetch(
            `https://dummyjson.com/products?limit=10&skip=${page*10}`
        )
        const data = await response.json()
        console.log(data.products)
        if(data.products.length === 0){
            setHasMore(false)
        }else{
            setProducts(prevProducts => [...prevProducts, ...data.products])
            setPage(prevPage=>prevPage+1)
        }
    }   
    

    useEffect(() => {
        const observer = new IntersectionObserver(onIntersection)
        if(observer && elementRef.current){
            observer.observe(elementRef.current)
        }
        return ()=>{
            if(observer){
                observer.disconnect()
            }
        }
    }, [products])

    return (
        <div>
            {
                products.map((item)=>{
                    const {
                        brand, thumbnail, price, title
                    } = item
                    // console.log('>>', item)
                    return(
                        <div>
                            <h1>{brand}</h1>
                            <p>{title}</p>
                            <img src={thumbnail}/>
                            <h3>price: ${price}</h3>
                        </div>
                    )
                })
            }
            {   
                hasMore && 
                <div ref={elementRef} style={{border: '2px solid red'}}>
                    Loading...
                </div>
            }
        </div>
    )
}

export default ProductList
