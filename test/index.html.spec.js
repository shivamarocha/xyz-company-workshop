import '@testing-library/jest-dom/extend-expect'
import { JSDOM } from 'jsdom'
import fs from 'fs'
import path from 'path'

const html = fs.readFileSync(
    path.resolve(__dirname, '../src/index.html'),
    'utf8'
)

let dom
let container


describe('index.html', () => {
    beforeEach(() => {
        // Constructing a new JSDOM with this option is the key
        // to getting the code in the script tag to execute.
        // This is indeed dangerous and should only be done with trusted content.
        // https://github.com/jsdom/jsdom#executing-scripts
        dom = new JSDOM(html, { runScripts: 'dangerously' })
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
        expect(logoLink.href).toBe("about:blank#")
    })
    it('has a link to the shopping cart in the header', () => {
        const header = container.querySelector('header')
        const headerLinks = header.querySelectorAll('a')
        const cartLink = Array.from(headerLinks).find(link => link.href === 'cart.html')
        expect(header).toBeInTheDocument()
        expect(headerLinks.length > 0).toBe(true)
        expect(cartLink).toBeInTheDocument()
    })
    it('has a footer with a copyright mark', () => {
        const footer = container.querySelector('footer')
        expect(footer).toBeInTheDocument()
        expect(footer).toHaveTextContent("© 2021 XYZ Corporation, all rights reserved");
    })
    describe('ProductList', () => {
        it('exists', () => {
            const productList = container.querySelector('[data-product-list]')
            expect(productList).toBeInTheDocument()
        })
        it('has at least 1 product', () => {
            const productList = container.querySelector('[data-product-list]')
            const products = productList.querySelectorAll('[data-product-item]')
            expect(products.length).toBeGreaterThan(0)
        })
        describe('Product', () => {
            it('has all required fields', () => {
                const productList = container.querySelector('[data-product-list]')
                const products = productList.querySelectorAll('[data-product-item]')
                Array.from(products).forEach(product => {
                    const id = product.querySelector('[data-id]')
                    const name = product.querySelector('[data-name]')
                    const price = product.querySelector('[data-price]')
                    
                    const requiredFields = [id, name, price]
                    requiredFields.forEach(field => {
                        expect(field).toBeInTheDocument()
                        expect(field.textContent.length).toBeGreaterThan(0)
                    })
                })
            })
            it('has an add to cart button', () => {
                const productList = container.querySelector('[data-product-list]')
                const products = productList.querySelectorAll('[data-product-item]')
                Array.from(products).forEach(product => {
                    const btnAddToCart = product.querySelector('[data-btn-add-to-cart]')
                    expect(btnAddToCart).toBeInTheDocument()
                })
            })
        })
    })
})