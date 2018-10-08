productGrid = {
	init: function(url) {
		this.cacheDom();
		this.fetchApi(url);
	},
	// caching DOM improve performance
	cacheDom: function() {
		this.gridContainer = document.querySelector(".product-grid-container");
		this.windowWidth = window.innerWidth;
	},
	bindEvent: function() {
		this.gridContainer.addEventListener("click", (e) => {
			e.target.classList.contains("remove-icon") ? this.removeItem(e) : this.gotoLink(e)
		});
	},
	createElement: ( el, classLists ) => {
		const element =  document.createElement( el )
		for(let className in classLists){
			element.classList.add( classLists[className] );
		}
		return element;
	},
	fetchApi: function(url) {
		let self = this;
		fetch(url)
			.then(resp => {
				if (resp.status > 400 && resp.status < 499) {
					throw Error(`Request rejected with status ${resp.status}`);
				} else if (resp.status >= 500) {
					throw Error(`Server error status ${resp.status}`);
				} else {
					return resp.json();
				}
			})
			.then(function(data) {
				self.loadProduct(data);
			})
			.catch(console.error);
	},
	loadProduct: function(productData) {
		const salesItems = productData.sales;
		const productRow = this.gridContainer.querySelector("div.row");

		for (const item of salesItems) {

			// create DOM element
			// createElement take 2 argument, 1st is the tag type, 2nd is classlist. classlist is passed as an Array
			// create product container div
			const productContainer = this.createElement( 'div', ['product-container','col-xs-12', 'col-sm-6','col-lg-4' ] );

			// create thumbnail div
			const thumbnail = this.createElement('div', ['thumbnail']);
			thumbnail.setAttribute("data-href", item.url);

			// create overlay on hover and product description
			const description = this.createElement("div", ["overlay"]);
			description.innerHTML = item.description;

			// create remove "X" div
			const iconContainer = this.createElement("div", ["remove-icon"]);
			iconContainer.innerText = "X";

			// create loading icon group
			const loadingIconContainer = this.createElement("div", ["loader-container"]);
			const loadingIcon = this.createElement("div", ["loader"]);

			// create image tag
			const img = new Image();
			// set image src base on browser width. example if width > 767, display desktop image else display mobile image
			img.src = this.windowWidth > 767 ? item.photos.medium_half : item.photos.medium_wide;
			img.setAttribute("alt", item.tagline);

			// load image
			img.onload = () => {
				// remove loading icon
				thumbnail.removeChild(loadingIconContainer);

				// load product content when image is ready.
				thumbnail.appendChild(caption);
				caption.appendChild(name);
				caption.appendChild(tagline);
			};
			// remove product if image return error
			img.onerror = (e) => {
				const itemContainer = e.target.parentElement.parentElement;
				const itemParent = itemContainer.parentElement;
				itemParent.removeChild( itemContainer );
			};

			// create caption container
			const caption = this.createElement("div", ["caption"]);

			// create h4 tag, product name
			const name = this.createElement("h4");
			name.innerText = item.name;

			// create p tag, product tagline
			const tagline = this.createElement("p");
			tagline.innerText = item.tagline;

			// determine if this is the first element in product container. order product last item first.
			productRow.hasChildNodes() ? productRow.insertBefore(productContainer, productRow.nextElementSibling) : productRow.appendChild(productContainer);

			// add Element to DOM
			productContainer.appendChild(thumbnail);
			thumbnail.appendChild(iconContainer);
			thumbnail.appendChild(description)
			thumbnail.appendChild(loadingIconContainer).appendChild(loadingIcon)
			thumbnail.appendChild(img)
		}
		this.bindEvent();
	},
	gotoLink: e => {
		const link = e.target.parentElement.getAttribute('data-href')
		window.location.href = link;
	},
	removeItem: e => {
		const itemContainer = e.target.parentElement.parentElement;
		const itemParent = itemContainer.parentElement;
		itemContainer.style.transform = "scale(0)";

		// remove element after animation
		itemContainer.addEventListener("transitionend", (e) => {
			itemParent.removeChild( itemContainer );
		}, false);

	}
};


// function domobj() {
// 	var self = this;
// 	self.products = [];

// 	self.getproducts = function(url) {
// 		$.getJSON(url, function(response) {
// 			for (i = 0; i < response.sales.length; i++) {
// 				self.products.push(new productobj(response.sales[i], i));
// 			}
// 		});
// 	};

// 	self.updateproducthtml = function() {
// 		for (i = 0; i < self.products.length; i++) {
// 			self.products[i].updatehtml();
// 		}
// 	};

// 	self.updatedom = function() {
// 		var i = 0;
// 		thishtml = "";
// 		for (i = 0; i < self.products.length; i++) {
// 			if (i % 3 == 0) {
// 				thishtml += "<div class='row'>";
// 				console.log("START");
// 			}
// 			thishtml += self.products[i].htmlview;
// 			if (i % 3 == 2 || i == self.products.length - 1) {
// 				thishtml += "</div>";
// 				console.log("FINISH");
// 			}
// 		}
// 		$("#content").append(thishtml);
// 	};
// }

// function productobj(product, i) {
// 	var self = this;
// 	self.photo = product.photos.medium_half;
// 	self.title = product.name;
// 	self.tagline = product.tagline;
// 	self.url = product.url;
// 	self.htmlview = "";
// 	self.index = i;
// 	self.custom_class = "col" + ((i % 3) + 1);

// 	self.updatehtml = function() {
// 		$.get("product-template.html", function(template) {
// 			self.htmlview = template
// 				.replace("{image}", self.photo)
// 				.replace("{title}", self.title)
// 				.replace("{tagline}", self.tagline)
// 				.replace("{url}", self.url)
// 				.replace("{custom_class}", self.custom_class);
// 		});
// 	};
// }

// var page = new domobj();
// page.getproducts("data.json");
// setTimeout("console.log('building html');page.updateproducthtml();", 20);
// setTimeout("page.updatedom()", 50);
