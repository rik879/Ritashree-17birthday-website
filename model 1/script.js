// Fade in/out on scroll
const sections = document.querySelectorAll(".section");

const observer = new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
entry.target.classList.add("show");
}else{
entry.target.classList.remove("show");
}
});
},{threshold:0.2});

sections.forEach(sec=>observer.observe(sec));


// Timeline content
const timelineData = [
"We first met at Biswarup sir's tution.\nI sat behind you",
"In a class, I moved up and sat beside you",
"You talked to me for the very first time",
"You gave me your number and told me to contact you",
"I was scared\nI didn't message you for a whole week",
"Next week, u asked me why I hadn't messaged you",
"I lied, and said I forgot about it",
"I texted you for the first time\nmy message:\"hey\"\nyou:\"Bonjour!\"\nme:\"Ciao\"",
"We became bosom friends",
"We talked almost every day",
"We shared our first walk together",
"We confessed our feelings",
"We kissed for the first time",
"We kissed and hugged",
"And our story goes on...."
];

const timeline = document.querySelector(".timeline");

timelineData.forEach(text => {

    const item = document.createElement("div");
    item.classList.add("timeline-item");

    item.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-content">${text}</div>
    `;

    timeline.appendChild(item);
});

// Observe after creation
const timelineItems = document.querySelectorAll(".timeline-item");

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        } else {
            entry.target.classList.remove("show");
        }
    });
}, { threshold: 0.3 });

timelineItems.forEach(item => timelineObserver.observe(item));

// Particles
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

for(let i=0;i<80;i++){
particlesArray.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:Math.random()*2,
speed:Math.random()*0.5
});
}

function animate(){
ctx.clearRect(0,0,canvas.width,canvas.height);
particlesArray.forEach(p=>{
p.y-=p.speed;
if(p.y<0)p.y=canvas.height;
ctx.fillStyle="white";
ctx.beginPath();
ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
ctx.fill();
});
requestAnimationFrame(animate);
}

animate();