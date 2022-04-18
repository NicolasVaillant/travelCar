//JS FILE

const dayOfTravelISO = dayOfTravel.concat(" ", steps_hours[0])
const endTrip = dayOfTravel.concat(" ", steps_hours[steps_hours.length - 1])

const time_left = document.querySelector('.time_left')
const timeline__line = document.querySelector('.timeline--line')
const timeline__start__label = document.querySelector('.timeline--start')
const timeline__line__draw = document.querySelector('.timeline--line--draw')
const timeline__line__evolution = document.querySelector('.timeline--line--evolution')
const header = document.querySelector('.header')
const clients = document.querySelector('.clients')

const button_modal = document.querySelector('.button_submit_modal')
const name__modal = document.querySelector('#name--modal')
const name__main = document.querySelector('#name--main')
const team__modal = document.querySelector('#team--modal')
const extend__content = document.querySelector('.extend--content')
const luggage__modal = document.querySelector('#luggage--modal')
const luggage__modal__second = document.querySelector('#luggage--modal--2')

const main = document.querySelector('main')
const body = document.querySelector('body')

const leftPosition = 30

name__main.addEventListener('change', () => {
    clientDisplay(name__main.value)
})

team__modal.addEventListener('change', (e) => {
    if(e.target.checked){
        extend__content.classList.add('show--more')
    }else{
        extend__content.classList.remove('show--more')
    }
})

function setNewDesign(){
    header.classList.add('travel--on--style')
    timeline__start__label.classList.add('start_trip')
}

function calcDate(iso, to = null){
    const date_iso = new Date(iso)
    let date_to
    if(to === null){
        date_to = new Date()
    }else{
        date_to = new Date(to)
    }

    const humanReadable = {}

    const diffMs = (date_iso - date_to) // milliseconds
    const diffDays = Math.floor(diffMs / 86400000) // days
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000) // hours
    const diffMin = Math.ceil(((diffMs % 86400000) % 3600000) / 60000) // minutes

    if(diffMs < 60000){
        humanReadable.day = diffDays + 1
        humanReadable.hours = diffHrs + 1
        humanReadable.minutes = diffMin
    }else {
        humanReadable.day = diffDays
        humanReadable.hours = diffHrs
        humanReadable.minutes = diffMin
    }

    return humanReadable
}

function displayTimeLeft(){
    const date = calcDate(dayOfTravelISO)
    if(date.day <= 0){
        if(date.hours <= 0){
            if(date.minutes <= 0){
                setNewDesign()
            }
        }else{
            time_left.innerHTML = `Le trajet est prévu dans ${date.hours} heure(s) et ${date.minutes} minute(s)`
        }
    }else{
        time_left.innerHTML = `Le trajet est prévu dans ${date.day} jours(s) et ${date.hours} heure(s)`
    }
}

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
        const buttonToMap = document.createElement('a')
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

        buttonToMap.appendChild(localisation_ico)
        buttonToMap.appendChild(shortcut_localisation_text)
        container_options.appendChild(buttonToMap)

        let url = ""
        let localisation = steps_cities[i] + " " + steps_subtitles[i]
        if(support === "Apple"){
            buttonToMap.href = "https://maps.apple.com?q=" + localisation
        }else{
            buttonToMap.href = "https://maps.google.com/maps?q=" + localisation
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

    let timelineTop = timeline__line.offsetTop
    let timelineHeight = timeline__line.offsetHeight

    timeline__line__draw.style.top = timelineTop - 1 + "px"
    timeline__line__evolution.style.top = timelineTop - 1 + "px"

    dot__step.forEach((e, index) => {
        e.setAttribute("data-num", index.toString())
        //3 : border non pris en compte par offsetHeight
        let calc = (e.offsetHeight+3)/2
        e.style.top = label__hour[index].offsetHeight/2 - calc + "px"
    })

    clients.style.top = timelineTop + "px"

    timeLineProgress(timelineHeight)

    setInterval(() => {
        timeLineProgress(timelineHeight)
    }, refreshInterval)
}

function timeLineProgress(timelineHeight){
    const date = calcDate(dayOfTravelISO)
    const dateEndTrip = calcDate(dayOfTravelISO,endTrip)
    const current = getCurrentTime()

    let currentHours = current.hours
    let currentMinutes = current.minutes
    let time = currentHours + ":" + currentMinutes

    let tripStartHours = Math.abs(date.hours) * 60
    let tripStartMinutes = Math.abs(date.minutes)
    let minutesFromStart = tripStartHours + tripStartMinutes

    let tripHours = Math.abs(dateEndTrip.hours) * 60
    let tripMinutes = Math.abs(dateEndTrip.minutes)
    let allMinutes = tripHours + tripMinutes

    let percent = (minutesFromStart/allMinutes).toFixed(2)

    // console.log(percent, (timelineHeight*percent).toFixed(2))


    for (let i = 0; i < steps_hours.length; i++) {
        console.log(steps_hours[i].slice(0,5), time)
        if(steps_hours[i].slice(0,5) <= time){
            const dot__step = document.querySelectorAll('.dot--step')

            dot__step.forEach(e => {
                if(e.dataset.num === i.toString()){
                    e.classList.add('done')
                }
            })
        }
    }

    timeline__line__draw.style.height = timelineHeight + "px"
    timeline__line__evolution.style.height = (timelineHeight*percent).toFixed(2) + "px"
    timeline__line__evolution.style.maxHeight = timelineHeight + "px"
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

        if(steps_clients[i].length >= 6){
            client_container.classList.add('tn--long')

        }
        const client_name = document.createElement('div')
        client_name.classList.add('client--name')
        client_name.innerHTML = steps_clients[i]
        const client_ico = document.createElement('i')
        client_ico.classList.add('fas')
        client_ico.classList.add('fa-user-plus')
        const client_in_car = document.createElement('p')
        client_in_car.classList.add('client--in--car')
        client_in_car.classList.add('TEST--HIDDEN')
        let client_col = 0
        client_in_car.innerHTML = `${client_col}`
        client_in_car.appendChild(client_ico)

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
        client_container.appendChild(client_in_car)
        client.appendChild(client_container)

        clients.appendChild(client)
    }
}

function submitModal(callback){
    button_modal.closest('.modal').classList.add('close--modal')
    main.classList.remove('disabled--main')
    body.classList.remove('disabled--body')

    const name_value = name__modal.value
    const luggage_value = luggage__modal.value
    const luggage_value_s = luggage__modal__second.value

    name__main.selectedIndex = name_value

    console.log("Set new design")

    //ScrollIntoView effect when submitting modal
    const client = document.querySelectorAll('.client')
    client.forEach(e => {
        if(e.dataset.name === steps_clients[name_value]){
            const midScreenClient = e.offsetTop + (e.offsetHeight/2)
            // console.log("scrollIntoView : " + steps_clients[name_value])
            window.scroll(0, midScreenClient)
        }
    })

    try{
        $.ajax({
            type : "POST",
            url  : "../php/store_client_data.php",
            data : { name : steps_clients[name_value], type_luggage : type_luggage[luggage_value] }
        });
        // In other way, try to get the luggage :
        $.ajax({
            type : "POST",
            url  : "../php/get_client_data.php",
            data : { name : steps_clients[name_value] },
            success: function(res) {
                console.log(steps_clients[name_value] + " -> " + res)
            }
        });
    }catch (e) {
        console.error(e)
    }

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
            if(date.day <= 0 && date.hours <= 0){
                a.remove()
            }else{
                a.modify()
            }
        }else{
            if(date.day <= 0 && date.hours <= 0){
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

function getCurrentTime(){
    const date = new Date()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    return {hours : hours, minutes : minutes}
}

function setTimeLine(){

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
}

let path_clients = []
let path_clients_in = []
let common = []
const count = {};

function setStepsClients(){

    for (let i = 0; i < path.length; i++) {
        let pathS = path[i].split('-')
        let start = pathS[0]
        let end = pathS[1]

        path_clients_in = []
        for (let j = 0; j <= steps_cities.length; j++) {
            if(j >= Number(start) && j <= Number(end)){
                path_clients_in.push(j)
            }
        }
        path_clients.push(path_clients_in)
    }

    for (let i = 0; i < path_clients.length; i++) {
        for (let j = 0; j < steps_cities.length; j++) {
            if(path_clients[i].includes(j)){
                common.push(j)
            }
        }
    }
    common.forEach(element => {
        count[element] = (count[element] || 0) + 1;
    })
    /**
     * count : how many customer in the same place
     * path_clients : path followed by customers
     */
}

let support = ""
window.onload = function (){

    setStepsClients()

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
    setLabels(type_luggage, luggage__modal__second)
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
    console.info("Set default design")
    console.info("minHeight container : " + minHeight)
}



