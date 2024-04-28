export default class Move {
	constructor() {

	}
}

		this.movingItems = {
			selected: null,
			moving: null,
			blank: null,
		}

		this.mouseListeners = {
			down: [],
			move: [],
			up: [],
		}

		this.touchListeners = {
			start: [],
			move: [],
			end: [],
		}

	endingMoving() {
		this.movingItems.moving.remove();
		this.movingItems.selected.classList.remove("selected", "hidden-item");

		this.movingItems = {
			selected: null,
			moving: null,
			blank: null,
		};
	}

	removeTicket(id) {
		const ticketLi = this.tickets.querySelector(`.ticket[data-id="${id}"]`);

		ticketLi.remove();
	}

	cloningTicket(ticket) {
		const clone = ticket.cloneNode(true);
		clone.classList.add("moving");

		document.body.append(clone);
		this.movingItems.moving = clone;
		this.movingItems.selected = ticket;

		return clone;
	}
	selectingTicket(ticket) {
		ticket.classList.add("selected");
	}
	
	moveTicket(top, left) {
		this.movingItems.moving.style.top = `${top}px`;
		this.movingItems.moving.style.left = `${left}px`;
	}

	createBlankItem() {
		const blankTicket = document.createElement('li');
		blankTicket.classList.add('ticket', 'blank-ticket');

		const sizes = this.movingItems.selected.getBoundingClientRect();

		const height = sizes.height;
		const width = sizes.width;
		blankTicket.style.height = `${height}px`;
		blankTicket.style.width = `${width}px`
		
		this.movingItems.blank = blankTicket;	
		this.movingItems.selected.classList.add('hidden-item');
	}


	this.movingPositions = {
			startX: null,
			startY: null,
			startTop: null,
			startLeft: null,
		}

		this.render.addMouseListeners('down', this.byDownMouse.bind(this));
		this.render.addMouseListeners('move', this.byMoveMouse.bind(this));
		this.render.addMouseListeners('up',	this.byUpMouse.bind(this)); 

		this.render.addTouchListeners('start', this.byStartTouch.bind(this)); 
		this.render.addTouchListeners('move', this.byMoveTouch.bind(this)); 
		this.render.addTouchListeners('end', this.byEndTouch.bind(this)) 
		byDownMouse(event) {
		if(!event.target.classList.contains('ticket__date')) {
			return;
		}

		const ticketLi = event.target.closest('li.ticket');

		this.movingPositions.startX = event.pageX;
		this.movingPositions.startY = event.pageY;

		this.startMovingTicket(ticketLi);
	}

	byMoveMouse(event) {
		if(!this.render.movingItems.moving) {
			return;
		}
		this.calcNewCoort(event.pageX, event.pageY);
		this.render.movingItems.moving.style.display = "none";

		const elementUnderCursor = document.elementFromPoint(event.pageX, event.pageY);

		const isWindowArea = elementUnderCursor || false;

		if(isWindowArea) {
			const isTicket = elementUnderCursor.closest('li.ticket');
			if(isTicket) {
				if(!isTicket.classList.contains('selected')) {
					this.checkBlankItem(isTicket);
				}
			} else {
				const coordTicketList = this.render.tickets.getBoundingClientRect();
				
				if(event.pageY > coordTicketList.bottom) {
					if(!this.render.movingItems.blank) {
						this.render.createBlankItem()
					}
					this.render.tickets.append(this.render.movingItems.blank);
				}
			}
		}

		this.render.movingItems.moving.style.removeProperty("display");
	}

	byUpMouse(event) {
		if (!this.render.movingItems.moving) {
			return;
		}

		if (this.render.movingItems.blank) {
			this.replaceSelectedAndBlank();
			this.render.movingItems.blank.remove();
		}

		this.render.endingMoving();
		this.clearMovingPosition();
	}

	byStartTouch(event) {
		// console.log(event)
	}
	byMoveTouch(event) {
		// console.log(event)
	}
	byEndTouch(event) {
		// console.log(event)
	}

		startMovingTicket(ticket) {
		const activeTicket = this.render.cloningTicket(ticket);
		this.calcStartCoort(ticket, this.render.movingItems.moving);
		this.render.selectingTicket(ticket);
	}	

	calcStartCoort(ticket, movingItem) {
		const coord = ticket.getBoundingClientRect();

		const height = coord.height;
		const width = coord.width;
		const top = coord.top + window.pageYOffset;
		const left = coord.left + window.pageXOffset;

		this.movingPositions.startTop = top;
		this.movingPositions.startLeft = left;

		movingItem.style.height = `${height}px`;
		movingItem.style.width = `${width}px`;
		movingItem.style.top = `${top}px`;
		movingItem.style.left = `${left}px`;
	}

	calcNewCoort(pageX, pageY) {
		const shiftY = pageY - this.movingPositions.startY;
		const shiftX = pageX - this.movingPositions.startX;

		const newTop = this.movingPositions.startTop + shiftY;
		const newLeft = this.movingPositions.startLeft + shiftX;

		this.render.moveTicket(newTop, newLeft)

	}

	checkBlankItem(ticket) {
		if(!this.render.movingItems.blank) {
			this.render.createBlankItem()
		}

		const previeTicket = ticket.previousSibling;
		

		if(previeTicket && previeTicket.classList.contains('blank-ticket')) {
			return;
		}

		this.render.tickets.insertBefore(this.render.movingItems.blank, ticket)
	}

	replaceSelectedAndBlank() {
		const { blank, selected } = this.render.movingItems;
	
		this.render.tickets.replaceChild(selected, blank);
	}

	clearMovingPosition() {
		this.movingPositions = {
			startTop: null,
			startLeft: null,
			startY: null,
			startX: null,
		};
	}

export {  }