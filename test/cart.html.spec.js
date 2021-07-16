import '@testing-library/jest-dom/extend-expect'
import { JSDOM } from 'jsdom'
import fs from 'fs'
import path from 'path'

const html = fs.readFileSync(
    path.resolve(__dirname, '../src/cart.html'),
    'utf8'
)

let dom
let container


describe('cart.html', () => {
    beforeEach(() => {
        // Constructing a new JSDOM with this option is the key
        // to getting the code in the script tag to execute.
        // This is indeed dangerous and should only be done with trusted content.
        // https://github.com/jsdom/jsdom#executing-scripts
        dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' })
        container = dom.window.document.body
    })
    it('has a title', () => {
        container = dom.window.document.head
        const pageTitle = container.querySelector('title')
        expect(pageTitle).toBeInTheDocument()
        expect(pageTitle).toHaveTextContent('XYZ Corporation')
    })
    it('has a header with the company logo as link to the homepage/store', () => {
        const header = container.querySelector('header')
        const headerLinks = header.querySelectorAll('a')
        const logoLink = Array.from(headerLinks).find(link => link.text === 'XYZ Corporation')
        expect(header).toBeInTheDocument()
        expect(headerLinks.length > 0).toBe(true)
        expect(logoLink).toBeInTheDocument()
        expect(logoLink.href).toBe("index.html")
    })
    it('has does not have a link to the shopping cart in the header', () => {
        const header = container.querySelector('header')
        const headerLinks = header.querySelectorAll('a')
        const cartLink = Array.from(headerLinks).find(link => link.href === 'cart.html')
        expect(header).toBeInTheDocument()
        expect(headerLinks.length > 0).toBe(true)
        expect(cartLink).toBe(undefined)
    })
    it('has a footer with a copyright mark', () => {
        const footer = container.querySelector('footer')
        expect(footer).toBeInTheDocument()
        expect(footer).toHaveTextContent("© 2021 XYZ Corporation, all rights reserved");
    })
    describe('Cart', () => {
        it('exists', () => {
            const cart = container.querySelector('[data-cart]')
            expect(cart).toBeInTheDocument()
        })
        it('has a list of 0 items by default', () => {
            const cart = container.querySelector('[data-cart]')
            const cartItemsList = cart.querySelector('[data-cart-items]')
            const cartItems = cartItemsList.querySelectorAll('[data-cart-item]')
            expect(cartItemsList).toBeInTheDocument()
            expect(cartItems.length).toBe(0)
        })
        it('has a subtotal of the cart items $0.00 by default', () => {
            const cart = container.querySelector('[data-cart]')
            const subtotal = cart.querySelector('[data-cart-subtotal]')
            expect(subtotal).toBeInTheDocument()
            expect(subtotal.textContent).toBe("$0.00")
        })
        it('has a count of the cart items 0 by default', () => {
            const cart = container.querySelector('[data-cart]')
            const itemCount = cart.querySelector('[data-cart-items-count]')
            expect(itemCount).toBeInTheDocument()
            expect(itemCount.textContent).toBe("0")
        })
        it('has a link to the checkout page', () => {
            const cart = container.querySelector('[data-cart]')
            const links = cart.querySelectorAll('a')
            const checkoutLink = Array.from(links).find(link => link.href === 'checkout.html')
            expect(checkoutLink).toBeInTheDocument()
            expect(checkoutLink.textContent).toBe("Checkout")
        })
        describe('Cart Item Template', () => {
            // NOTE: templates cannot be tested like ordinary dom nodes b/c their children are not rendered into the dom
            it('exists', () => {
                const template = container.querySelector('[data-cart-item-template]')
                expect(String(template)).toBe("[object HTMLTemplateElement]")
            })
            it('has a cart-item marker and all required fields', () => {
                const template = container.querySelector('[data-cart-item-template]')
                const templateHtml = template.innerHTML
                expect(templateHtml.includes('data-cart-item')).toBe(true)
                expect(templateHtml.includes('data-id')).toBe(true)
                expect(templateHtml.includes('data-name')).toBe(true)
                expect(templateHtml.includes('data-price')).toBe(true)
            })
            it('has an increment qty button', () => {
                const template = container.querySelector('[data-cart-item-template]')
                const templateHtml = template.innerHTML
                expect(templateHtml.includes('data-btn-qty-increment')).toBe(true)
            })
            it('has a decrement qty button', () => {
                const template = container.querySelector('[data-cart-item-template]')
                const templateHtml = template.innerHTML
                expect(templateHtml.includes('data-btn-qty-decrement')).toBe(true)
            })
            it('has a remove item button', () => {
                const template = container.querySelector('[data-cart-item-template]')
                const templateHtml = template.innerHTML
                expect(templateHtml.includes('data-btn-remove-item')).toBe(true)
            })
        })
    })
})