function ShootyController(elem, color1, color2){
	let canvas = document.createElement("CANVAS");
	canvas.style.backgroundColor = "white";
	const ctx = canvas.getContext("2d");
	const radius = 10;	
	let shooterDrawn = false;
	let shooterX = 0;
	let shooterY = 0;
	let mouseX = 0;
	let mouseY = 0;
	let mouseDown = false;
	let shots = [];
	let shootingInterval = null;
	
	let drawShooter = function(){
		if (shooterDrawn){
			ctx.beginPath();
			ctx.arc(shooterX, shooterY, radius, 0, 2*Math.PI);
			ctx.fillStyle = color1;
			ctx.fill();
		}
	}
	
	this.init = function() {
		setInterval(function(){
			clearCanvas();
			drawShooter();
			advanceShots();
		}, 10);
	}
	
	
	
	let updateMousePosition = function(){
		mouseX = event.clientX;
		mouseY = event.clientY;
	}
	
	this.handleCanvasMouseDown = function() {
		mouseDown = true;
		let cnvBox = canvas.getBoundingClientRect();
		let x = event.clientX - cnvBox.left;
		let y = event.clientY - cnvBox.top;
		shootingInterval = setInterval(shoot, 10, x, y);
	}
	
	this.handleCanvasMouseUp = function() {
		mouseDown = false;
		clearInterval(shootingInterval);
	}		
	
	this.handleCanvasClick = function(){		
		const delta = radius;
		let cnvBox = canvas.getBoundingClientRect();
		let x = event.clientX - cnvBox.left;
		let y = event.clientY - cnvBox.top;

		if (!shooterDrawn){			
			shooterDrawn = true;		
			shooterX = x;
			shooterY = y;
			drawShooter();			
		}
		// Delete shooter if user clicks on it
		else if ((x < shooterX + delta && x > shooterX - delta) && (y < shooterY + delta && y > shooterY - delta)){			
			shooterDrawn = false;
			shots = [];
		}
	}
	
	let shoot = function() {
		if (mouseDown && shooterDrawn){
			let ball = new Ball(ctx, {x:shooterX, y:shooterY},{cursorX:mouseX, cursorY:mouseY}, color2);
			shots.push(ball);
		}
	}
	
	let clearCanvas = function(){
		ctx.clearRect(0,0, canvas.width, canvas.height);		
	}	
	
	let advanceShots = function(){
		let length = shots.length;
		for (let i = 0; i < length; i++){
			let ball = shots[i];
			if (ball != undefined){
				ball.advance();
				if (ball.xPosition >= canvas.width || ball.xPosition <=0
				|| ball.yPosition >= canvas.height || ball.yPosition <= 0){
					shots.splice(i, 1);
				}
			}
		}
	}
	
	this.init();
	canvas.setAttribute('width', '500');
	canvas.setAttribute('height', '500');
	canvas.addEventListener("mousemove", updateMousePosition);
	canvas.addEventListener("mousemove", this.clearCanvas);
	canvas.addEventListener("mousedown", this.handleCanvasMouseDown);
	canvas.addEventListener("mouseup", this.handleCanvasMouseUp);
	canvas.addEventListener("click", this.handleCanvasClick);
	elem.appendChild(canvas);
}

function Ball(ctx, start, cursorLoc, color){
	this.xPosition = start.x;
	this.yPosition = start.y;
	let delta_x = cursorLoc.cursorX - start.x;
	let delta_y = cursorLoc.cursorY - start.y;
	let v = 200;	//ball velocity
	this.angle = Math.atan2(delta_y, delta_x);
	this.vx = v * Math.cos(this.angle);
	this.vy = v * Math.sin(this.angle);
	let stepSize = 0.02;
	let ballRadius = 2;
	this.draw = function(){
		ctx.beginPath();
		ctx.arc(this.xPosition,this.yPosition,ballRadius,0,2*Math.PI);
		ctx.fillStyle = color;
		ctx.fill();
	}
	this.advance = function(){
		this.xPosition += this.vx * stepSize;
		this.yPosition += this.vy * stepSize;
		this.draw();
	}
}
