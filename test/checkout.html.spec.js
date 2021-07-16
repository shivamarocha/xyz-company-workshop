import '@testing-library/jest-dom/extend-expect'
import { JSDOM } from 'jsdom'
import fs from 'fs'
import path from 'path'

const html = fs.readFileSync(
    path.resolve(__dirname, '../src/checkout.html'),
    'utf8'
)

let dom
let container


describe('checkout.html', () => {
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
        expect(pageTitle).toHaveTextContent('XYZ Corporation: Checkout')
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
    it('has a link to the shopping cart in the header', () => {
        const header = container.querySelector('header')
        const headerLinks = header.querySelectorAll('a')
        const cartLink = Array.from(headerLinks).find(link => link.href === 'cart.html')
        expect(header).toBeInTheDocument()
        expect(headerLinks.length > 0).toBe(true)
        expect(cartLink).toBeInTheDocument()
    })
    describe('footer', () => {
        it('has a copyright mark', () => {
            const footer = container.querySelector('footer')
            expect(footer).toBeInTheDocument()
            expect(footer).toHaveTextContent("© 2021 XYZ Corporation, all rights reserved");
        })
        it('has a link to privacy policy', () => {
            const footer = container.querySelector('footer')
            const links = footer.querySelectorAll('a')
            const privacyPolicyLink = Array.from(links).find(link => link.href === 'privacypolicy.html')
            expect(privacyPolicyLink).toBeInTheDocument()
            expect(privacyPolicyLink).toHaveTextContent("Privacy Policy")
        })
        it('has a link to terms and conditions', () => {
            const footer = container.querySelector('footer')
            const links = footer.querySelectorAll('a')
            const tacLink = Array.from(links).find(link => link.href === 'terms.html')
            expect(tacLink).toBeInTheDocument()
            expect(tacLink).toHaveTextContent("Terms & Conditions")
        })
    })
    it.todo('has a checkout section')
})