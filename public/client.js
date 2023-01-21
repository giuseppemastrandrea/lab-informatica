let socket,
	width = 500,
	height = 500,
	canvas,
	xspeed = 3,
	yspeed = 3,
	ball = {
	  x: 100,
	  y: 200,
	  radius: 50,

	  draw: function() {
	      fill('red');
	      circle(this.x, this.y, this.radius*2);
	  },
	  move: function(){
      this.x += xspeed;
		  this.y += yspeed;
		  if (this.x > width - this.radius || this.x < this.radius) {
		    xspeed = -xspeed;
		  }
		  if (this.y > height - this.radius || this.y < this.radius) {
		    yspeed = -yspeed;
		  }
	  }
	}	
window.addEventListener('load', ()=>{
	console.log('test')

	socket = io.connect(
		'http://labinformatica.panettipitagora.edu.it:8080',
		{ "transports" : ["websocket"] }
	)

	function addPlayer(player){
		let el = document.createElement('div');
		el.dataset.id = player.id;
		el.innerHTML = `Giocatore ${player.id}: <span class="score">${player.score}</span>`;
		document.querySelector('#players').append(el)
	}

	function removePlayer(player){
		let el = document.querySelector(`[data-id='${player.id}']`)
		console.log(el.parentNode)
		el.parentNode.removeChild(el);
	}

	function addToPlayer(player){
		document.querySelector(`[data-id='${player.id}'] .score`).innerHTML = player.score;
	}

	socket.on('init', (obj)=>{
		document.querySelector('#players').innerHTML = ""
		obj.players.forEach(a=>addPlayer(a))
	})

	socket.on('hit', (e)=>{
		console.log('hit', e)
		addToPlayer(e)
	})

	socket.on('quit', (e)=>{
		console.log('quit');
		removePlayer(e);
	})
})

function setup(){
	canvas = createCanvas(width, height);
	canvas.parent("canvasWrapper")
	background(200, 225, 200);
}

function draw() {
    background(200,225,200);
    ball.draw();
    ball.move();
}

function mousePressed(){
	let a = (mouseX-ball.x);
	let b = (mouseY-ball.y);

	let distance = Math.sqrt(a*a + b*b)
	if(distance < ball.radius){
		console.log('HIT!')
		socket.emit('hit', {
			id: socket.id
		})
	}else{
		console.log('Miss!')
	}
}