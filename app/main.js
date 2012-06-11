define({

	// Create a component instance
	controller: {
		create: 'app/controller',
		properties: {
			node: { $ref: 'dom.first!.value', at: 'view' }
		},

		// Exploring the possibilities.  Mark a method as updating
		// a particular part of atomize.root.  Whatever the return
		// value of this method is will be assigned to that part of
		// atomize.root
		update: {
			value: 'incrementValue'
		},
		// Observe the 'value' field of atomize.root.  When it
		// changes, invoke renderValue
		observe: {
			value: 'renderValue'
		},

		// Connect a click handler to the button (see view below)
		on: {
			view: { 'click:button': 'incrementValue' }
		}
	},

	// Quick and dirty use wire/dom/render to pop something
	// useful into the DOM
	view: {
		render: '<div><p>Value: <span class="value"></span></p><button>+1</button></div>',
		insert: { first: { $ref: 'dom.first!body'} }
	},

	// wire plugins
	plugins: [
		// Debug -- see the browser console
		{ module: 'wire/debug' },
		{ module: 'wire/dom' },
		{ module: 'wire/dom/render' },
		{ module: 'wire/on' },
		// Quick and dirty atomize plugin for wire that starts atomize
		// and provides access to an atomize instance and the shared root
		// via a wire reference resolver (see usage of "atomize!" above)
		{ module: 'lib/atomize-wire', logging: true }
	]
});