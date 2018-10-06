productGrid = {
	init: function(url) {
		this.cacheDom();
		this.fetchApi(url);
	},
	// caching DOM improve performance
	cacheDom: function() {
		this.gridContainer = document.querySelector(".product-grid-container");
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
			// createElement take 2 argument, 1st is the tag type, 2nd is the classlist.
			// create product container div
			const productContainer = this.createElement( 'div', ['product-container','col-xs-12','col-sm-6','col-lg-4' ] );

			// create thumbnail
			const thumbnail = this.createElement('div', ['thumbnail']);
			thumbnail.setAttribute("href", item.url);

			// create overlay
			// const overlay = this.createElement("div");
			const description = this.createElement("span", ["overlay"]);
			description.innerHTML = item.description;

			// create remove icon
			const iconContainer = this.createElement("div", ["icon-container"]);
			const removeIcon = this.createElement("span", ["glyphicon","glyphicon-remove","remove-icon"]);
			removeIcon.setAttribute("aria-hidden", "true");

			// create image tag
			const img = this.createElement("img");
			img.setAttribute("src", item.photos.medium_half);
			img.setAttribute("alt", item.tagline);

			// create caption
			const caption = this.createElement("div", ["caption"]);

			// create h3 tag
			const name = this.createElement("h3");
			name.innerText = item.name;

			// create p tag
			const tagline = this.createElement("p");
			tagline.innerText = item.tagline;

			// determine if this is the first element in the list.
			productRow.hasChildNodes() ? productRow.insertBefore(productContainer, productRow.nextElementSibling) : productRow.appendChild(productContainer);

			// add Element to DOM
			productContainer.appendChild(thumbnail);
			thumbnail.appendChild(iconContainer).appendChild(removeIcon);
			thumbnail.appendChild(description)
			thumbnail.appendChild(img)
			thumbnail.appendChild(caption);
			caption.appendChild(name);
			caption.appendChild(tagline);
		}
		this.bindEvent();
	},
	gotoLink: e => {
		const link = e.target.parentElement.getAttribute('href')
		window.location.href = link;
		console.log(link)
	},
	removeItem: e => {
		const itemContainer = e.target.parentElement.parentElement.parentElement;
		const itemParent = itemContainer.parentElement;
		itemContainer.style.transform = "scale(0)";

		setTimeout(() => {
			itemParent.removeChild( itemContainer );
		}, 400)
	}
};
