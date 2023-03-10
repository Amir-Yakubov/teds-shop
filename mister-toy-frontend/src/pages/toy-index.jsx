import { useDispatch, useSelector } from 'react-redux'
// import { Link } from 'react-router-dom'

import { ToyList } from '../cmps/toy-list.jsx'
import { ToyFilter } from '../cmps/toy-filter.jsx'
// import { toyService } from '../services/toy.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { loadToys, removeToy, saveToy } from '../store/toy.action.js'
import { ADD_TO_CART } from '../store/toy.reducer.js'
import { useEffect } from 'react'

export function ToyIndex() {

    const toys = useSelector((storeState) => storeState.toyModule.toys)
    const isLoading = useSelector((storeState) => storeState.toyModule.isLoading)
    // const shoppingCart = useSelector((storeState) => storeState.toyModule.shoppingCart)
    const dispatch = useDispatch()

    useEffect(() => {
        onLoadToys()
    }, [])

    async function onLoadToys(filterBy) {
        try {
            loadToys(filterBy)
            showSuccessMsg('Toys loaded')
        } catch (err) {
            showErrorMsg('Cannot load toys')
        }
    }

    async function onRemoveToy(toyId) {
        try {
            await removeToy(toyId)
            showSuccessMsg('Toy removed')
        } catch (err) {
            showErrorMsg('Cannot remove toy')
        }
    }

    async function onEditToy(toy) {
        const price = +prompt('New price?')
        const toyToSave = { ...toy, price }
        try {
            const savedToy = await saveToy(toyToSave)
            showSuccessMsg(`Toy updated to price: $${savedToy.price}`)
        } catch (err) {
            showErrorMsg('Cannot update toy')
        }
    }

    function addToCart(toy) {
        console.log(`Adding ${toy.name} to Cart`)
        dispatch({ type: ADD_TO_CART, toy })
        showSuccessMsg('Added to Cart')
    }

    function setFilter(filterBy) {
        onLoadToys(filterBy)
    }

    const loaderImg = 'dots-loader.svg'
    const bannerImg = 'banner.jpg'

    return <section className='main-container'>
        {/* <h3 className='main-app-title'>TEDS Toys shop</h3> */}
        <ToyFilter onSetFilter={setFilter} />
        <img className="banner-img" src={require(`../assets/img/${bannerImg}`)} />
        <main>
            {isLoading && <img className="loader-img" src={require(`../assets/img/${loaderImg}`)} />}
            {/* <button className='add-toy-btn' ><Link to={`/toy/edit`}>Add Toy</Link></button> */}
            <ToyList
                toys={toys}
                onRemoveToy={onRemoveToy}
                onEditToy={onEditToy}
                addToCart={addToCart}
            />
        </main>
    </section>
}
