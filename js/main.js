document.addEventListener("DOMContentLoaded", function(event) {
	var game = new Game(5);
});


Game.prototype.update = function(dir) {
	var nextPos = {x:this.x, y:this.y};
	var nextNextPos = {x:this.x, y:this.y};
	if (dir == 0) {
		nextPos.y -= 1;
		nextNextPos.y -= 2;
	}
	else if (dir == 1) {
		nextPos.y += 1;
		nextNextPos.y += 2;
	}
	else if (dir == 2) {
		nextPos.x -= 1;
		nextNextPos.x -= 2;
	}
	else if (dir == 3) {
		nextPos.x += 1;
		nextNextPos.x += 2;
	}

	if (nextNextPos.x < 0 || nextNextPos.x >= this.size) {
		return;
	}
	if (nextNextPos.y < 0 || nextNextPos.y >= this.size) {
		return;
	}
	// box in next pos?
	if (this.map[nextPos.x][nextPos.y] == 1) {
		// can we move it
		if (this.map[nextNextPos.x][nextNextPos.y] != 0 && this.map[nextNextPos.x][nextNextPos.y] != 1) {
			// delete the old box
			this.remove({x:nextPos.x, y:nextPos.y});
			// put a box in new pos
			this.add({x:nextNextPos.x, y:nextNextPos.y}, 1);
			// update map
			this.map[nextPos.x][nextPos.y] = 4;
			this.map[nextNextPos.x][nextNextPos.y] = 1;
		}
	}

	if (this.map[nextPos.x][nextPos.y] != 0 && this.map[nextPos.x][nextPos.y] != 1) {
		// delete old porter
		this.remove({x:this.x, y:this.y});
		// put a porter in new pos
		this.add({x:nextPos.x, y: nextPos.y}, 3);
		// update map
		this.map[this.x][this.y] = 4;
		this.map[nextPos.x][nextPos.y] = 3;
		this.x = nextPos.x;
		this.y = nextPos.y;
		++this.steps;
		this.updateSteps(this.steps);
	}
};

Game.prototype.updateSteps = function(steps) {
	var steps_elem = document.getElementsByClassName("steps-container")[0];
	steps_elem.textContent = steps.toString();
};
Game.prototype.win = function() {
	var i;
	for (i = 0; i < this.cross.length; i++) {
		var pos = this.cross[i];
		if (this.map[pos.x][pos.y] !== 1) {
			break;
		}
	}
	if (i == this.cross.length) {
		return true;
	}
	return false;		
}
Game.prototype.listen = function() {
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
			event.preventDefault();
			self.update(dir);
			if (self.win()) {
				alert("win");
			}
		}
	}); 
};

function Game(size) {
	this.size = size;
	this.map = new Array(size);
	// porter pos
	this.x = 2;
	this.y = 2;

	this.steps = 0;
	//cross hole pos
	this.cross = [];

	this.buildMap();
	this.listen();
}

Game.prototype.add = function(position, type) {
	var x = position.x * 100;
	var y = position.y * 100;
	var container = document.getElementsByClassName("box-container")[0];
	var elem = document.createElement("div");
	elem.style.top = x.toString() + "px";
	elem.style.left = y.toString() + "px";
	if (type == 0) {
		elem.classList.add("brick");
	}
	else if (type == 1){
		elem.classList.add("box");
	}
	else if (type == 2) {
	}
	else {
		// porter
		elem.classList.add("porter");
	}
	elem.id = position.x.toString() + position.y.toString();
	container.appendChild(elem);
}

Game.prototype.remove = function(position) {
	var id = position.x.toString() + position.y.toString();
	var elem = document.getElementById(id);
	elem.parentNode.removeChild(elem);
}

Game.prototype.buildMap = function() {
	for (var i = 0; i < this.map.length; i++) {
		this.map[i] = new Array(this.size);
	}

	/*
	 * 0 - brick
	 * 1 - box
	 * 2 - cross
	 * 3 - porter
	 * 4 - grass
	 */
	for (var i = 0; i < this.map.length; i++) {
		for (j = 0; j < this.map.length; j++) {
			this.map[i][j] = 0;
		}
	}

	this.map[0][2] = 2;
	this.map[2][4] = 2;
	this.map[4][2] = 2;
	this.map[2][0] = 2;
	
	this.map[2][1] = 1;
	this.map[1][2] = 1;
	this.map[3][2] = 1;
	this.map[2][3] = 1;

	this.map[2][2] = 3;

	// this.printMap();	
	for (var i = 0; i < this.map.length; i++) {
		for (j = 0; j < this.map.length; j++) {
			var val = this.map[i][j];
			if (val == 0) {
				this.add({x:i, y:j}, 0);
			}
			else if (val == 1) {
				this.add({x:i, y:j}, 1);
			}
			else if (val == 2) {
			}
			else {
				// porter
				this.add({x:i, y:j}, 3);
			}
		}
	}
	this.cross.push({x:0, y:2});
	this.cross.push({x:2, y:0});
	this.cross.push({x:2, y:4});
	this.cross.push({x:4, y:2});
};

Game.prototype.printMap = function() {
	this.map.forEach(function (row) {
		var mapped = row.map(function (digit) {
			return digit;
		}).join(" | ");
		console.log(mapped);
	});
};
