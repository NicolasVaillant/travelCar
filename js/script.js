//JS FILE

/**
 * Si on prend en compte le décalage d'une étape :
 * - Modifier "-1" (L.271 : f.changeDisplayClients)
 *
 */

const time_left = document.querySelector('.time_left')
const timeline__line = document.querySelector('.timeline--line')
const timeline__line__draw = document.querySelector('.timeline--line--draw')
const header = document.querySelector('.header')
const clients = document.querySelector('.clients')

const button_modal = document.querySelector('.button_submit_modal')
const name__modal = document.querySelector('#name--modal')
const name__main = document.querySelector('#name--main')
const luggage__modal = document.querySelector('#luggage--modal')

const main = document.querySelector('main')
const body = document.querySelector('body')

const leftPosition = 30

name__main.addEventListener('change', () => {
    clientDisplay(name__main.value)

    // const timeline__line_change = document.querySelector('.timeline--line')
    // clients.style.height = timeline__line_change.offsetHeight + "px"
})

function setNewDesign(){
    header.classList.add('travel--on--style')
}

function calcDate(iso){
    const timeStart = new Date(iso).getTime()
    const current = new Date().getTime()

    const hourDiff = current - timeStart //in ms
    // console.log(hourDiff)
    const hours = Math.abs(hourDiff) / 36e5 //in hours
    const minDiff = hourDiff / 60000 //in minutes

    const humanReadable = {}
    humanReadable.day = (hours - hours % 24)/24
    humanReadable.hours = Math.floor(hours % 24)
    // humanReadable.minutes = (minDiff - 60) * Math.floor(hours)

    return humanReadable
}

function displayTimeLeft(){
    const date = calcDate(dayOfTravelISO)
    if(date.day === 0){
        if(date.hours <= 0){
            setNewDesign()
        }else{
            time_left.innerHTML = `Le trajet est prévu dans ${date.hours} heure(s)`
        }
    }else{
        time_left.innerHTML = `Le trajet est prévu dans ${date.day} jours(s) et ${date.hours} heure(s)`
    }
}

let blankSpace = 2*window.innerHeight - header.offsetHeight
let heightContainer = (blankSpace/steps_hours.length) - 20

async function createSteps(callback){

    for (let i = 0; i < steps_hours.length; i++) {
        const container = document.createElement('div')
        container.classList.add('container')

        const dot = document.createElement('div')
        dot.classList.add('dot--step')
        const label_hour = document.createElement('div')
        label_hour.classList.add('label--hour')
        const container_options = document.createElement('div')
        container_options.classList.add('container--options')
        const opt_city = document.createElement('p')
        opt_city.classList.add('opt--city')
        const opt_sub = document.createElement('p')
        opt_sub.classList.add('opt--subtitle')
        const opt_added = document.createElement('div')
        opt_added.classList.add('opt--added')
        const opt_added_p = document.createElement('p')
        opt_added_p.classList.add('opt--added--p')
        const opt_added_title = document.createElement('p')
        opt_added_title.classList.add('opt--added--title')
        const buttonToMap = document.createElement('button')
        buttonToMap.classList.add('shortcuts--maps')
        //TODO : UX A DEF -------------------------------
        const localisation_ico = document.createElement('i')
        localisation_ico.classList.add('fas')
        localisation_ico.classList.add('fa-map-marker-alt')
        //-----------------------------------------------
        const shortcut_localisation_text = document.createElement('p')
        shortcut_localisation_text.classList.add('shortcut--localisation--text')
        shortcut_localisation_text.innerHTML = "Voir sur un plan"
        //-----------------------------------------------

        opt_city.innerHTML = steps_cities[i]
        opt_sub.innerHTML = steps_subtitles[i]
        label_hour.innerHTML = steps_hours[i].slice(0,5)

        container_options.appendChild(label_hour)
        container_options.appendChild(opt_city)
        container_options.appendChild(opt_sub)


        if(steps_added[i] !== "") {

            opt_added_title.innerHTML = "Précisions"
            opt_added_p.innerHTML = steps_added[i]
            opt_added.appendChild(opt_added_title)
            opt_added.appendChild(opt_added_p)
            container_options.appendChild(opt_added)
        }

        console.log("Set default design")
        // container.style.minHeight = heightContainer + "px"

        buttonToMap.appendChild(localisation_ico)
        buttonToMap.appendChild(shortcut_localisation_text)
        container_options.appendChild(buttonToMap)

        let url = ""
        let localisation = steps_cities[i] + " " + steps_subtitles[i]
        buttonToMap.ontouchstart = function (e){
            if(support === "Apple"){
                url = "maps://maps.google.com/maps?q=" + localisation
            }else{
                url = "https://maps.google.com/maps?q=" + localisation
            }
            window.open(url)
        }

        container.appendChild(container_options)
        container.appendChild(dot)
        timeline__line.appendChild(container)
    }

    callback()
    return true
}

function setHeight(){
    const label__hour = document.querySelectorAll('.label--hour')
    const dot__step = document.querySelectorAll('.dot--step')

    // console.log(timeline__line)

    let timelineTop = timeline__line.offsetTop
    let timelineHeight = timeline__line.offsetHeight

    timeline__line__draw.style.top = timelineTop + "px"
    timeline__line__draw.style.height = timelineHeight + "px"

    dot__step.forEach((e, index) => {
        e.setAttribute("data-num", index.toString())
        //3 : border non pris en compte par offsetHeight
        let calc = (e.offsetHeight+3)/2
        e.style.top = label__hour[index].offsetHeight/2 - calc + "px"
    })

    clients.style.top = timelineTop + "px"
    // clients.style.height = timelineHeight + "px"
}

function sumArray(a, b) {
    let c = [];
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
        c.push((a[i] || 0) + (b[i] || 0));
    }
    return c;
}

function setClients(){
    let number = steps_clients.length
    const dot__step = document.querySelectorAll('.dot--step')
    const container = document.querySelectorAll('.container')
    let stock_dot = [], stock_dot_e = [], stock_container = []

    dot__step.forEach(e => {
        stock_dot.push(e.offsetTop)
        stock_dot_e.push(e.offsetHeight)
    })
    container.forEach(e => {
        stock_container.push(e.offsetTop)
    })

    const offsetTopDots = sumArray(stock_dot, stock_container)
    const clientsWidth = clients.offsetWidth
    const space = clientsWidth/steps_clients.length
    const blank = space - 8

    for (let i = 0; i < number; i++) {
        const client = document.createElement('div')
        client.classList.add('client')
        const dot_start = document.createElement('div')
        dot_start.classList.add('dot--start')
        const dot_end = document.createElement('div')
        dot_end.classList.add('dot--end')
        const client_container = document.createElement('div')
        client_container.classList.add('client--container')
        const client_name = document.createElement('div')
        client_name.classList.add('client--name')
        client_name.innerHTML = steps_clients[i]

        let pathSeg = path[i].split("-")
        let start = pathSeg[0]
        let end = pathSeg[1]

        client.setAttribute('data-name', steps_clients[i])
        client.setAttribute('data-start', start)
        client.setAttribute('data-end', end)

        client.style.top = Number(offsetTopDots[start] - clients.offsetTop) + "px"
        client.style.left = i*blank + leftPosition + "px"
        client.style.height = offsetTopDots[end] - offsetTopDots[start] + stock_dot_e[end-start] + "px"

        dot_end.style.top = offsetTopDots[end] - offsetTopDots[start] - stock_dot_e[end-start] + "px"
        client.appendChild(dot_start)
        client.appendChild(dot_end)
        client_container.appendChild(client_name)
        client.appendChild(client_container)

        clients.appendChild(client)
    }
}

function submitModal(callback){
    let arrayDataClients = []
    button_modal.closest('.modal').classList.add('close--modal')
    main.classList.remove('disabled--main')
    body.classList.remove('disabled--body')

    const name_value = name__modal.value
    const luggage_value = luggage__modal.value

    name__main.selectedIndex = name_value

    const container = document.querySelectorAll('.container')

    console.log("Set new design")
    for (let i = 0; i < container.length; i++) {
        //TODO
        //Modification des offset à faire
        //Submit du modal nous assure que les offsetHeight/offsetTop sont définis

        // container[i].style.minHeight = maxHeight + 20 + "px"
    }

    // console.log(maxHeight)

    const client = document.querySelectorAll('.client')
    client.forEach(e => {
        //TODO
        //Modification des offset à faire
        //Submit du modal nous assure que les offsetHeight/offsetTop sont définis

        // e.style.top = maxHeight - clients.offsetTop + "px"

        if(e.dataset.name === steps_clients[name_value]){
            console.log("scrollIntoView : " + steps_clients[name_value])
            // e.scrollIntoView()
        }
    })

    arrayDataClients.push(steps_clients[name_value], type_luggage[luggage_value])
    //POST arrayDataClients to store clients preferences

    callback()
}

function setLabels(arr, container){
    for (let i = 0; i < arr.length; i++) {
        const option = document.createElement('option')
        option.setAttribute('value', i.toString())
        option.innerHTML = arr[i]
        container.appendChild(option)
    }
}

const cumulativeSum = arr => {
    const c = arr.reduce((acc, val) => {
        let {sum, res} = acc
        sum += val
        res.push(sum)
        return {sum, res}
    },{
        sum : 0,
        res : []
    })
    return c.res
}

function heightCalc(index = 1){
    const timeline__line = document.querySelector('.timeline--line')
    const dot = timeline__line.children[0].querySelector('.dot--step')
    // console.log("dot : " + dot.offsetTop)

    return timeline__line.children[0].offsetTop - clients.offsetTop + (index*dot.offsetTop)
}


function changeDisplayClients(e){
    const dot__step = document.querySelectorAll('.dot--step')

    const start = e.dataset.start
    const end = e.dataset.end
    const diff = end - start

    //steps_hours.length nous donne le nb de dot
    for (let i = 0; i < steps_hours.length; i++) {
        let container = dot__step[i].closest('.container')

        if(dot__step[i].dataset.num < start - 1 || dot__step[i].dataset.num > end){
            container.classList.add("remove--display--client")
            container.style.minHeight = "0px"
        }else{
            container.classList.remove("remove--display--client")
            container.style.minHeight = minHeight + "px"
        }
    }

    setOffsetTopClient(minHeight)
    setLineDrawHeight(diff, minHeight)

}

class Element {
    constructor(element) {
        this.e = element
    }
    remove(){
        this.e.classList.add('remove--display')
    }
    show(stringCallback){
        this.e.classList.remove('remove--display')
        this.e.classList.remove('change--display')

        if(stringCallback !== "modify"){
            changeDisplayClients(this.e)
        }
    }
    modify(){
        this.e.classList.add('change--display')
    }
}

function setOffsetTopClient(heightContainer){

    let topPosition

    const clientVisible = document.querySelector('.client:not(.remove--display)')
    let height
    if(clientVisible.dataset.start === "0"){
        height = 0
        topPosition = heightCalc(1)
    }else{
        height = heightContainer
        topPosition = heightCalc(1.33)
    }

    clientVisible.style.top = topPosition + height  + "px"
    clientVisible.style.left = leftPosition  + "px"
}

function setLineDrawHeight(index = null, heightContainer = null){
    //8 : margin-top
    const offset = heightCalc() + 8

    const clientVisible = document.querySelector('.client:not(.remove--display)')
    let newIndex
    if(clientVisible.dataset.start === "0"){
        newIndex = index
    }else{
        newIndex = index + 1
    }
    timeline__line__draw.style.height = (newIndex+1)*heightContainer + 1.1*offset + "px"
}

function clientDisplay(value = name__modal.value){
    const clients = document.querySelectorAll('.client')
    const date = calcDate(dayOfTravelISO)

    clients.forEach(e => {
        let a = new Element(e)

        if(e.dataset.name !== steps_clients[value]){
            if(date.day === 0 && date.hours <= 0){
                a.remove()
            }else{
                a.modify()
            }
        }else{
            if(date.day === 0 && date.hours <= 0){
                a.show("remove")
            }else{
                a.show("modify")
            }
        }
    })
}

function setShortcutButton(){
    const shortcut__sms = document.querySelector('.shortcut--sms')
    const shortcut__call = document.querySelector('.shortcut--call')

    let msg = "Salut%20Thérence,%20"

    if(support === "Apple"){
        shortcut__sms.href = "sms://open?addresses=+33667167160/&body=" + msg
    }else{
        shortcut__sms.href = "sms://+33667167160?body=" + msg
    }

    shortcut__call.href = "tel:+33667167160"
}

function setTimeLine(){
    console.log("o")
}

let support = ""
window.onload = function (){

    if((navigator.platform.indexOf("iPhone") !== -1) || (navigator.platform.indexOf("iPod") !== -1) || (navigator.platform.indexOf("iPad") !== -1)){
        support = "Apple"
    }else{
        support = "Others"
    }

    if (!localStorage.getItem("first_connection_timeCARLine") === true ||
        !localStorage.getItem("first_connection_timeCARLine") === "true") {

        button_modal.closest('.modal').classList.remove('close--modal')
        main.classList.add('disabled--main')
        body.classList.add('disabled--body')

        // localStorage.setItem("first_connection_timeCARLine", "true");
    }

    setShortcutButton()

    setLabels(steps_clients, name__modal)
    setLabels(type_luggage, luggage__modal)
    setLabels(steps_clients, name__main)

    displayTimeLeft()
    createSteps(containerHeight).then(
        () => {
            setHeight()
            setClients()
            setTimeLine()
        },
        (error) => {
            console.log(error)
        }
    )
}

let minHeight = 0

function containerHeight(){
    let maxHeightContainer = []
    const container = document.querySelectorAll('.container')
    container.forEach(e => {
        maxHeightContainer.push(e.querySelector('.container--options').offsetHeight)
    })
    minHeight = Math.max(...maxHeightContainer) + 20
    container.forEach(e => {
        e.style.minHeight = minHeight + "px"
    })
    console.log("minHeight container : " + minHeight)
}



