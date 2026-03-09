const video = document.getElementById("video")
const strip = document.getElementById("photos")
const counter = document.getElementById("countdown")

let photos=[]
let capturing=false
let retakeCount=0

const MAX_PHOTOS=4
const MAX_RETAKE=2

navigator.mediaDevices.getUserMedia({video:true})
.then(stream=>{
video.srcObject=stream
})

updateDateTime()

async function startCapture(){

if(capturing) return

capturing=true
photos=[]
strip.innerHTML=""

updateDateTime()

for(let i=0;i<MAX_PHOTOS;i++){

await countdown(5)

const img=capture()

photos.push(img)

addPreview(img)

}

capturing=false

}

function capture(){

const canvas=document.createElement("canvas")
const ctx=canvas.getContext("2d")

const w=video.videoWidth
const h=video.videoHeight

canvas.width=w
canvas.height=h

ctx.filter="grayscale(100%) contrast(135%) brightness(135%)"

const scale=0.9
const nw=w*scale
const nh=h*scale

const offsetX=(w-nw)/2
const offsetY=(h-nh)/2

ctx.drawImage(video,offsetX,offsetY,nw,nh)

flash()

return canvas.toDataURL("image/png")

}

function flash(){

const flash=document.createElement("div")

flash.style.position="fixed"
flash.style.top="0"
flash.style.left="0"
flash.style.width="100%"
flash.style.height="100%"
flash.style.background="white"
flash.style.opacity="0.9"
flash.style.zIndex="9999"

document.body.appendChild(flash)

setTimeout(()=>{
flash.remove()
},120)

}

function addPreview(photo){

const img=document.createElement("img")
img.src=photo

strip.appendChild(img)

}

function retake(){

if(retakeCount>=MAX_RETAKE){

alert("Retake limit reached")
return

}

retakeCount++

photos=[]
strip.innerHTML=""

startCapture()

}

function printStrip(){
window.print()
}

function countdown(sec){

return new Promise(resolve=>{

let i=sec
counter.innerText=i

const timer=setInterval(()=>{

i--
counter.innerText=i

if(i<=0){

clearInterval(timer)
counter.innerText=""
resolve()

}

},1000)

})

}

function updateDateTime(){

const el=document.getElementById("datetime")

const now=new Date()

const months=[
"Jan","Feb","Mar","Apr","May","Jun",
"Jul","Aug","Sep","Oct","Nov","Dec"
]

const month=months[now.getMonth()]
const year=now.getFullYear()

const hours=now.getHours().toString().padStart(2,'0')
const mins=now.getMinutes().toString().padStart(2,'0')

el.innerText=`${month} ${year}  |  ${hours}:${mins}`

}