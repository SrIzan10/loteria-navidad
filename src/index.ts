import puppeteer from "puppeteer";
import * as fs from 'node:fs'

const numbers = JSON.parse(fs.readFileSync('./numbers.json').toString()) as string[]
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
let sum = 0

numbers.forEach(async (number) => {
    const browser = await puppeteer.launch({
        headless: 'new',
        defaultViewport: null,
    })

    const page = await browser.newPage()

    await page.goto(`https://elpais.com/loteria-de-navidad/numeros/${number}/?importe=20`, { waitUntil: 'domcontentloaded', timeout: 0 })

    const getWin = await page.evaluate(() => {
        const selector = document.querySelector('.np_p_c > span')?.innerHTML
        if (!selector) return null
            else return selector
    })
    console.log(`Número ${number} ${getWin ? getWin : 'no premiado'}`)
    if (getWin) {
        sum += Number(getWin.replace('€', ''))
        console.log('De momento, ', sum)
    }
    await browser.close()
    await delay(3000)
})