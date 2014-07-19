document.addEventListener("DOMContentLoaded", function(event) {
	var box = new Box({x:0, y:0});
	//alert("11");
});

function Box(position) {
	this.x = position.x;
	this.y = position.y;
	
	this.listen();
}

Box.prototype.move = function(direction) {
	// 0: left
	// 1: right
	// 2: up
	// 3: down

	// remove old pos box
	var container = document.getElementsByClassName("box-container")[0];
	
	container.removeChild(container.firstElementChild);	

	if (direction == 0) {
		this.y -= 1;
	}
	else if (direction == 1) {
		this.y += 1;
	}
	else if (direction == 2) {
		this.x -= 1;
	}
	else {
		this.x += 1;
	}

	if (this.x < 0) {
		this.x = 0;
	}
	if (this.x > 3) {
		this.x = 3;
	}
	if (this.y < 0) {
		this.y = 0;
	}
	if (this.y > 3) {
		this.y = 3;
	}
 	// add box to new pos	
	var element = document.createElement("div");
  element.classList.add("box", "box-position-" + this.x + "-" + this.y);
  container.appendChild(element);	
}

Box.prototype.listen = function() {
	var self = this;
	document.addEventListener("keydown", function(event) {
		var map = {
			37: 0,  // Left
			39: 1, // Right
			38: 2, // Up
			40: 3, // Down
		};	

		var dir = map[event.which];
		if (dir !== undefined) {
			self.move(dir);
		}
	}); 
};
