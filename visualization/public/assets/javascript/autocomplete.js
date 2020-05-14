var newArray = [];

new autoComplete({
	data: {
		// Data src [Array, Function, Async] | (REQUIRED)
		src: async () => {
			// API key token
			// User search query
			const query = document.querySelector('#autoComplete').value;
			// Fetch External Data Source
			let matches = nameOfAllCommunes.filter((s) => s.includes(query));

			return matches;
		},
		key: [ '' ],
		cache: false
	},
	sort: (a, b) => {
		// Sort rendered results ascendingly | (Optional)
		if (a.match < b.match) return -1;
		if (a.match > b.match) return 1;
		return 0;
	},
	placeHolder: 'Search for a commune...', // Place Holder text                 | (Optional)
	selector: '#autoComplete', // Input field selector              | (Optional)
	threshold: 0, // Min. Chars length to start Engine | (Optional)
	debounce: 300, // Post duration for engine to start | (Optional)
	searchEngine: 'loose', // Search Engine type/mode           | (Optional)
	resultsList: {
		// Rendered results list object      | (Optional)
		render: true,
		container: (source) => {
			source.setAttribute('id', 'food_list');
		},
		destination: document.querySelector('#autoComplete'),
		position: 'beforebegin',
		element: 'ul'
	},
	maxResults: 100, // Max. number of rendered results | (Optional)
	highlight: true, // Highlight matching results      | (Optional)
	resultItem: {
		// Rendered result item            | (Optional)
		content: (data, source) => {
			source.innerHTML = data.match;
		},
		element: 'li'
	},
	onSelection: (feedback) => {
		// Action script onSelection event | (Optional)
		selectedCommunesNames.push(feedback.selection.value);
		addKommunesToList(selectedCommunesNames);
		drawOnMap(feedback.selection.value);
	}
});
