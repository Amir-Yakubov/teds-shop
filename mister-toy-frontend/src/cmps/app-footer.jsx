
import { UserMsg } from './user-msg.jsx'
import { ShoppingCart } from './shopping-cart.jsx'
import { TOGGLE_CART_SHOWN } from '../store/toy.reducer.js'
import { useDispatch, useSelector } from 'react-redux'

export function AppFooter() {

    const isCartShown = useSelector((storeState) => storeState.toyModule.isCartShown)
    const toysCount = useSelector((storeState) => storeState.toyModule.toys.length)
    const cart = useSelector((storeState) => storeState.toyModule.shoppingCart)
    console.log('cart', cart);
    const dispatch = useDispatch()

    function onToggleCart(ev) {
        ev.preventDefault()
        // setIsCartShown(!isCartShown)
        dispatch({ type: TOGGLE_CART_SHOWN })
    }

    return (
        <footer className='main-layout full' >
            <p>Amir Yakubov</p>
            {/* <p>
                Currently {toysCount} toys in the shop
            </p>

            {
                <p>
                    <span>{cart.length}</span> Products in your Cart
                    <a href="#" onClick={onToggleCart}>
                        ({(isCartShown) ? 'hide' : 'show'})
                    </a>
                </p>
            }
            {isCartShown && <ShoppingCart cart={cart} dispatch={dispatch} />} */}
            <UserMsg />
        </footer>
    )
}
